import { api, requestConfig, getToken } from "../utils/config";

// Importando Interfaces
import type { newClientData } from '../interfaces/ClientsInterface';
import { toFormData } from '../utils/config';

// Get Token to send
const token = getToken();

// Funções
// GetQtdAboutClients
const countAllClients = async () => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(`${api}/clients/Qtd`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res
  } catch (error) {
    console.log("Erro ao obter quantidade de clientes.", error);
    throw new Error("Erro na API, ao obter quantidade de clientes.");
  }
}
// SearchClientByName
const searchClientByName = async (name: string) => {
  const config = requestConfig("GET", null, token)
  try {
    console.log(`Pesquisando pelo nome: ${name}`)
    const rest = await fetch(`${api}/clients/searchClients?name=${name}`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return rest
  } catch (error) {
    console.log(error)
    throw new Error("Erro na API, ao obter quantidade de clientes.");
    
  }
}

// New client
const newClient = async (data: newClientData) => {
  // Convertando os dados do Objeto para um formData para enviar arquivos também...
  const formData = await toFormData(data);
  const config = requestConfig("POST", formData, token);
  try {
    const res = await fetch(`${api}/clients`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res
  } catch (error) {
    console.log("Erro ao obter quantidade de clientes.", error);
    throw new Error("Erro na API, ao obter quantidade de clientes.");
  }
}

const clientsService = {
  countAllClients,
  searchClientByName,
  newClient
}

export default clientsService