import { api, requestConfig, getToken } from "../utils/config";

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

const clientsService = {
  countAllClients
}

export default clientsService