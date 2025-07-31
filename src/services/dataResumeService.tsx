import { api, requestConfig, getToken } from '../utils/config';

// Separando o token para uso
const token = getToken();
// Criando as rotas
// Get Resume Status
const getResumeStatus = async () => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(`${api}/os/summary`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res
  } catch (error) {
    console.log('Erro ao obter o resumo.', error);
  }
}
//Get Resume About Users
const getResumeUsers = async () => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(`${api}/users/summary`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err));
    return res
  } catch (error) {
    console.log("Erro ao obter o resumo dos usuários.", error);
  }
}


const resumeService = {
  getResumeStatus,
  getResumeUsers
}

export default resumeService


