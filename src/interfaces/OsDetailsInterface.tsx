export interface OsDetailsInterface {
  osId: string;
  os_number: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: number;
  budget: string;
  discount: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    clientId: number;
    name: string;
    email?: string;
    contact?: string;
    contact_2?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  }
  clientAssigned?: number;
  user?: {
    userId: number;
    name: string;
    email: string;
  };
  files?: {
    fileName: string;
    fileUrl: string;
  }
}

export interface newOsInterface {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: number;
  budget: string;
  discount: string;
  clientAssigned?: number;
  images?: File[];
}

// Interfaces
export interface OsUpdateInterface {
  osId: string;
  description?: string;
  status?: string;
  priority?: string;
  budget?: string;
  discount?: string;
  updatedAt?: string;
  images?: File[];
}