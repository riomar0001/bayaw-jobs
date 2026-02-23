import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashRefreshToken = async (refreshToken: string): Promise<string> => {
  return await bcrypt.hash(refreshToken, SALT_ROUNDS);
};

export const verifyHashedRefreshToken = async (
  refreshToken: string,
  hashedRefreshToken: string
): Promise<boolean> => {
  return await bcrypt.compare(refreshToken, hashedRefreshToken);
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
