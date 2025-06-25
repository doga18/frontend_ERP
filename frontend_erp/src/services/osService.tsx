import { api, requestConfig, getToken } from "../utils/config";

// Get Token to send
const token = getToken();

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

const osService = {
  getAllOs,
}

export default osService