import { api, requestConfig} from '../utils/config';

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
};

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
  validUserLogged,
  register,
  login,
  logout,
  updateTimePassword
}

export default authService;