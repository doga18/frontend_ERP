export interface ClientDataUnique {
  clientId: number
  name: string
  lastname: string
  email: string
  password?: string
  contact: string
  contact_2?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  complement?: string
  autorizationContactPhone?: boolean
  autorizationContactEmail?: boolean
  assignedTo: number
  createdAt?: string
  updatedAt?: string
  files?: {
    fileName: string
    fileUrl: string
  }
  message?: string
}

export interface listAllClients {
  count: number,
  rows: ClientDataUnique[]
}

export interface newClientData {
  name: string
  lastname: string
  email: string
  contact: string
  contact_2?: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  complement?: string
  files?: string
  autorizationContactPhone: boolean
  autorizationContactEmail: boolean
}