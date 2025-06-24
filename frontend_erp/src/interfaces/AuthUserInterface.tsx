export interface AuthUserInterface {
  userId: number;
  name: string;
  lastname: string;
  email: string;
  roleId: number;
  avaiable: boolean;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  laspassword?: string;
  hash_recover_password?: string;
  token: string;
}