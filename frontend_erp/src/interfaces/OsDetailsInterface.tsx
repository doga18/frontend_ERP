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
  clientAssigned?: {
    clientId: number;
    name: string;
    email: string;
    contact: string;
    contact_2?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  }
  user: {
    userId: number;
    name: string;
    email: string;
  };
}