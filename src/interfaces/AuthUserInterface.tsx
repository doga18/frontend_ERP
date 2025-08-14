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
  files?: {
    fileName: string;
    fileUrl: string;
  }
  token: string;
}

export interface userDataEdit {
  userId?: string;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  hash_recover_password?: string;
  roleId?: number;
  avaiable?: boolean;
  imagePerfil?: {
    fileName: string;
    fileUrl: string;
  }
}

export interface userDataList {
  userId: number;
  name: string;
  lastname: string;
  email: string;  
  avaiable: boolean;
  hash_recover_password?: string;
  roleId: number;
  role?: {
    name: string
  }
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  files: [
    {
      fileName: string;
      fileUrl: string;
    }
  ]
}