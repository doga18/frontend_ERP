export interface ClientDataUnique {
  clientId: number,
  name: string,
  lastname: string,
  email: string,
  contact: string,
  contact_2?: string,
  address?: string,
  city?: string,
  state?: string,
  country?: string,
  zipCode?: string,
  assignedTo: number
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
  autorizationContactPhone: boolean
  autorizationContactEmail: boolean
}