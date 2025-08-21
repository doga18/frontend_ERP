import { api, requestConfig} from '../utils/config';
import type { userDataEdit, newUserByAnother } from '../interfaces/AuthUserInterface';

interface updateTimePasswordProps {
  info_login: number | undefined;
  password: string;
}

interface RegisterUserResponse {
  name: string;
  lastname: string;
  email: string;
  password?: string;
}
// Coletando a quantidade de usuários e seus dados.
const getAllUsersAndCount = async () => {
  const config = requestConfig("GET", null, getToken());
  try {
    const res = await fetch(`${api}/users/summary`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err))
    return res
  } catch (error) {
    console.log('Erro ao coletar a quantidade de usuários e os dados: ' + error);
    return null
  }
}
// Coletando os dados detalhados de usuário por Id.
const getUserById = async (id: number) => {
  const config = requestConfig("GET", null, getToken());
  try {
    const res = await fetch(`${api}/users/${id}`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err))
    return res
  } catch (error) {
    console.log('Erro ao coletar os dados do usuário: ' + error);
    return null
  }
}
const getToken = () => {
  try {
    if(localStorage.getItem('token')){      
      const token = JSON.parse(localStorage.getItem('token') || '');
      // console.log(token);
      // console.log(token.toString());
      return token.toString();
    }    
    const userLocal = localStorage.getItem('user');
    if(userLocal){
      const user = JSON.parse(userLocal);
      console.log(user.token);
      return user.token;
    }
  } catch (error) {
    console.log(error);
    console.log('Não foi possível localizar o token do usuário logado.');
    return null;
  }
}
// Validação periódica do usuário logado.
const validUserLogged = async () => {
  const config = requestConfig("GET", null, getToken());
  try {
    const res = await fetch(`${api}/users/validUserLogged`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err))
    return res
  } catch (error) {
    console.log(error);
  }
}
// Register a user
const register = async(data: RegisterUserResponse) => {
  const config = requestConfig("POST", data);
  try {
    const res = await fetch(`${api}/users`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err))
    return res
  } catch (error) {
    console.log(error);
    console.log('Erro na tentativa de registro.');
  }
}
// Register a UserByAnotherUser
const registerByAnotherUser = async(data: newUserByAnother) => {
  const config = requestConfig("POST", data, getToken());
  try {
    const res = await fetch(`${api}/users/newUserByDashboard`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err))
    return res
  } catch (error) {
    console.log(error);
    console.log('Erro na tentativa de registro.');
  }
}
// Login user
const login = async(data: {[key: string]: string}) => {
  const config = requestConfig("POST", data);
  try {
    const res = await fetch(`${api}/users/auth`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err))
    return res
  } catch (error) {
    console.log(error);
    console.log('Erro na tentativa de login.');
  }
}
// Update UserItSelf
const updateDataUserSelf = async(FormData: FormData) => {
  const token = getToken();
  const config = requestConfig("PUT", FormData, token);
  try {
    const user = FormData.get('userId');
    const res = await fetch(`${api}/users/editself/${user}`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err))
    return res
  } catch (error) {
    console.log(error);
    console.log('Erro na tentativa de atualizar os dados do usuário.');
  }
}
// Update data about User Id
const updateDataUser = async(data: userDataEdit) => {
  const token = getToken();
  const config = requestConfig("PUT", data, token);
  try {
    const res = await fetch(`${api}/users/edit/${data.userId}`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err))
    return res
  } catch (error) {
    console.log(error);
    console.log('Erro na tentativa de atualizar os dados do usuário.');
  }
}
// UpdateTimePassword
const updateTimePassword = async(data: updateTimePasswordProps) => {
  const token = getToken();
  const config = requestConfig("PUT", data, token);
  try {
    const res = await fetch(`${api}/users/renew`, config)
      .then((res) => res.json())
      .catch((err: unknown) => console.log(err))
    return res
  } catch (error) {
    console.log(error);
    console.log('Erro na tentativa de atualizar a senha.');
  }
}
// Logout user
const logout = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('error');
    console.log('Sessão encerrada.');
  } catch (error) {
    console.log("Não foi possível encerrar a sessão adequadamente..." + error)
  }  
}
// Export
const authService = {
  getAllUsersAndCount,
  getUserById,
  validUserLogged,
  register,
  registerByAnotherUser,
  login,
  logout,
  updateTimePassword,
  updateDataUserSelf,
  updateDataUser
}

export default authService;

// getAllUsersAndCount getUserById