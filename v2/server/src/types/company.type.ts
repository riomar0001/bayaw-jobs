export interface CompanyAdmin {
  role: string;
  position: string;
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}