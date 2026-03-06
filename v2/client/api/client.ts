import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const API_TIMEOUT = 30000;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RefreshSubscriber = (token: string) => void;
type AuthErrorCallback = () => void;

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;
  private isRefreshing = false;
  private refreshSubscribers: RefreshSubscriber[] = [];
  private onAuthError: AuthErrorCallback | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      withCredentials: true, // required for httpOnly refresh token cookie
      headers: { "Content-Type": "application/json" },
    });

    this.setupInterceptors();
  }

  /** Register a callback to be called when token refresh fails (e.g. redirect to login) */
  setAuthErrorCallback(cb: AuthErrorCallback) {
    this.onAuthError = cb;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private addRefreshSubscriber(cb: RefreshSubscriber) {
    this.refreshSubscribers.push(cb);
  }

  private notifySubscribers(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private rejectSubscribers(error: unknown) {
    this.refreshSubscribers.forEach((_, __, arr) => arr.splice(0));
    this.refreshSubscribers = [];
    void error;
  }

  private setupInterceptors() {
    // Request — attach access token, but don't override an already-set Authorization header
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response — handle 401 with silent token refresh + request retry
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        const isAuthEndpoint =
          original?.url?.includes("/auth/refresh") ||
          original?.url?.includes("/auth/login") ||
          original?.url?.includes("/auth/verify-auth");

        if (
          error.response?.status === 401 &&
          !original?._retry &&
          !isAuthEndpoint
        ) {
          original._retry = true;

          if (this.isRefreshing) {
            // Queue while another refresh is in progress
            return new Promise<AxiosResponse>((resolve, reject) => {
              this.addRefreshSubscriber((newToken) => {
                original.headers["Authorization"] = `Bearer ${newToken}`;
                resolve(this.instance(original));
              });
              void reject; // reject path handled by rejectSubscribers
            });
          }

          this.isRefreshing = true;

          try {
            const res = await this.instance.post<{
              data?: { accessToken?: string };
            }>("/auth/refresh");
            const newToken = res.data?.data?.accessToken;

            if (!newToken)
              throw new Error("No access token in refresh response");

            this.setToken(newToken);
            this.notifySubscribers(newToken);
            original.headers["Authorization"] = `Bearer ${newToken}`;
            return this.instance(original);
          } catch (refreshError) {
            this.rejectSubscribers(refreshError);
            this.setToken(null);
            this.onAuthError?.();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Standard error normalisation
        if (error.response) {
          const data = error.response.data as Record<string, unknown>;
          throw new ApiError(
            (data?.message as string) || "Request failed",
            error.response.status,
            data?.errors as Record<string, string[]>,
          );
        } else if (error.request) {
          throw new ApiError("Network error. Please check your connection.");
        } else {
          throw new ApiError(error.message || "Request failed");
        }
      },
    );
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  async upload<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, formData, {
      ...config,
      headers: { "Content-Type": "multipart/form-data", ...config?.headers },
    });
  }
}

export const apiClient = new ApiClient();
