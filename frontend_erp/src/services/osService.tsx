import { api, requestConfig, getToken } from "../utils/config";

// Get Token to send
const token = getToken();

// Interfaces
export interface OsUpdateInterface {
  osId: string;
  description?: string;
  status?: string;
  priority?: string;
  budget?: string;
  discount?: string;
  updatedAt?: string;
}

// Funções
const getAllOs = async () => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(`${api}/os`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res
  } catch (error) {
    console.log('Erro ao obter todas as OS.', error);
    throw new Error("Erro na API, ao obter todas as OS.");
    
  }
}

const getAllOsWithLimitAndPage = async (page: number, limit: number = 5) => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(`${api}/os?limit=${limit}&page=${page}`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res
  } catch (error) {
    console.log('Erro ao obter todas as OS.', error);
    throw new Error("Erro na API, ao obter todas as OS.");
    
  }
}

const getOsById_number = async (os_number: string) => {
  const config = requestConfig("GET", null, token);
  console.log('Tentando obter a OS pelo ID: ' + os_number);
  try{
    const res = await fetch(`${api}/os/${os_number}`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res
  }catch (error) {
    console.log('Erro ao obter a OS pelo ID.', error);
    throw new Error("Erro na API, ao obter a OS pelo ID.");
  }
}

const getOsByArgumentsString = async (searchTerm: string) => {
  const config = requestConfig("POST", null, token);
  console.log('Tentando obter a OS pelo String: ' + searchTerm);
  try{
    const res = await fetch(`${api}/os/getbyparams?q=${searchTerm}`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res
  }catch (error) {
    console.log('Erro ao obter a OS pelo ID.', error);
    throw new Error("Erro na API, ao obter a OS pelo ID.");
  }
}

const getOsById = async (uuid: string) => {
  const config = requestConfig("GET", null, token);
  console.log('Tentando obter a OS pelo ID: ' + uuid);
  try{
    const res = await fetch(`${api}/os/os_id/${uuid}`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res
  }catch (error) {
    console.log('Erro ao obter a OS pelo ID.', error);
    throw new Error("Erro na API, ao obter a OS pelo ID.");
  }
}

// Editando OS.
const updateOsDetails = async (data: OsUpdateInterface) => {
  const config = requestConfig("PUT", data, token);
  try {
    const res = await fetch(`${api}/os/${data.osId}`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res;
  } catch (error) {
    console.error('Erro ao atualizar OS:', error);
    throw new Error("Erro na API, ao atualizar OS.");
  }
}

const osService = {
  getAllOs,
  getOsById,
  getAllOsWithLimitAndPage,
  getOsById_number,
  getOsByArgumentsString,
  updateOsDetails
}

export default osService