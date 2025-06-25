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
  user: {
    userId: number;
    name: string;
    email: string;
  };
}