import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../slices/authSlice";

import Message from '../../components/Message';
import type { AppDispatch } from '../../store'; 
import type { RootState } from '../../store';
//import type { RootState } from '@reduxjs/toolkit/query';

// import { useAuth } from "../../hooks/useAuth";

// Interface para o estado de erro
  
interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  // Preparando o uso do navigate
  // const navigate = useNavigate();
  // Variaveis
  // const { user } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [messagePage, setMessagePage] = useState<{msg: string, type: 'success' | 'error' | 'info'} | undefined>(undefined);
  // Preparando o dispatch para usar o Redux
  const dispatch: AppDispatch = useDispatch();
  const {
    error: AuthError,
    user: AuthUser,
    isLoading: AuthLoading,
    success: AuthSuccess
  } = useSelector((state: RootState) => state.auth);
  


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Todos os campos devem ser preenchidos");
      return;
    }
    // Montando o objeto de Login
    const LoginData: LoginForm = {
      email: email,
      password: password,
    }
    console.log("Dados de login:", LoginData);
    // Disparando o pedido de login
    dispatch(loginUser(LoginData))
  };
  useEffect(() => {
    if(AuthLoading){
      setIsLoadingPage(true);
    }
    if(AuthError){
      setIsLoadingPage(false);
      setError(AuthError.message)
      console.log("Erro no login:", AuthError.message);
    }
    if(AuthUser){
      setIsLoadingPage(false);
      setError('');
      // Redirecionar ou fazer algo após o login bem-sucedido
      console.log("Usuário autenticado:", AuthUser);
      // Aqui você pode redirecionar para outra página, por exemplo:
      // window.location.href = '/dashboard';
    }    
    if(AuthSuccess){
      setIsLoadingPage(false);
      setError('');
      // Redirecionar ou fazer algo após o login bem-sucedido
      console.log("Login bem-sucedido:", AuthSuccess);
      // Aqui você pode redirecionar para outra página, por exemplo:
      window.location.href = '/';
    }
  }, [dispatch, AuthError, AuthUser, AuthLoading, AuthSuccess]);

  useEffect(() => {
    // Messages de loading da página...
    setMessagePage({ msg: 'Realize o login para acessar o sistema', type: 'info' });
    setTimeout(() => {
      setMessagePage(undefined);
    }, 300000);
  }, [])

  return (
    <div className="flex h-screen w-screen">      
      {messagePage && <Message msg={messagePage.msg || ''} type={messagePage.type || 'info'} duration={2000} />}
      
      {isLoadingPage && <Message msg="Carregando..." type="info"/>}
      {AuthSuccess && <Message msg="Login bem-sucedido, redirecionando..." type="success"/>}
      {error && (
        <Message msg={error} type="error" />
      )}
      {/* Lado esquerdo */}
      <div className="w-1/3 flex items-center justify-center bg-amber-800">
        <div className="w-3/4 h-3/4 bg-amber-900 rounded-lg flex items-center justify-center">
          <img
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
            alt="Imagem de login"
            className="w-96 h-96 object-contain"
          />
        </div>
      </div>
      {/* Lado direito */}
      <div className="flex-1 flex items-center justify-center bg-indigo-600">
        <div className="w-full max-w-md p-8 bg-indigo-700 rounded-lg shadow-lg flex flex-col gap-6">
          <h1 className="text-3xl text-white text-center font-bold">Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6 text-gray-100">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              className={`bg-amber-900 hover:bg-amber-700 hover:scale-95 hover:font-bold text-white p-3 rounded font-semibold transition-colors ${isLoadingPage ? "opacity-50 cursor-not-allowed" : ""}`}
              type="submit"
            >
              Entrar
            </button>
          </form>
          {error && <p className="text-red-500 text-center text-semibold text-shadow-2xs text-2xl">{error}</p>}
          <p className="text-white text-center">
            Não tem uma conta?{" "}
            <a
              href={isLoadingPage ? undefined : "/register"}
              className={`text-blue-300 font-[1.5rem] underline hover:text-blue-400${isLoadingPage ? " pointer-events-none opacity-50" : ""}`}
              onClick={isLoadingPage ? (e) => e.preventDefault() : undefined}
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
