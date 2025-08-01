import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { registerUser } from '../../slices/authSlice';

import Message from '../../components/Message';

// import { useAuth } from '../../hooks/useAuth';

// Importando o tratamento do dispath.
import type { AppDispatch, RootState } from '../../store';


const Register = () => {
  // Verificando se o usuário já está logado
  // const { user } = useAuth();
  // Variaveis
  const [name, setName] = useState<string>('');
  const [lastname, setLastname] = useState<string>('')
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoadingPage, setisLoadingPage] = useState<boolean>(false);
  const [msgPage, setMsgPage] = useState<string>('')
  const [errors, setErrors] = useState<string[] | null>(null);
  const [messagePage, setMessagePage] = useState<{msg: string, type: 'success' | 'error' | 'info'} | undefined>(undefined);

  // Preparando o dispatch para usar o Redux
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const {
    error: AuthError,
    user: AuthUser,
    message: AuthMessage,
    isLoading: AuthLoading,
    success: AuthSuccess,
    // message: AuthMessage
  } = useSelector((state: RootState) => state.auth);
  

  // Funções da página
  const validatePassword = (password: string) => {
    if(password.length < 6){
      return false;
    }
    return true;
  }
  // Registrar Usuário
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Limpando os erros
    setErrors(null);
    // Verificando se todas as varíaveis foram preenchidas.
    if(!name || !lastname || !email || !password){
      setErrors(['Todos os campos devem ser preenchidos.']);
      return;
    }
    // Verificando se as senhas são iguais e se atendem os requisitos mínimos.
    if(password !== confirmPassword){
      setErrors(['A senha e a confirmação de senha devem ser idênticas.']);
      return;
    }
    if(!validatePassword(password)){
      setErrors(['A senha precisa ter pelo menos 6 caracteres.']);
      return;
    }
    // Solicitando ao usuário que aguarde.
    setisLoadingPage(true);
    const newUser = {
      name,
      lastname,
      email,
      password
    };
    console.log('Tentativa de envido do objeto:', newUser);
    // Tentando registrar o usuário no backend.
    const response = await dispatch(registerUser(newUser));
    // Verificando se a resposta foi bem sucedida.
    console.log(response);
  }

  useEffect(() => {
    // Messages de loading da página...
    setMessagePage({ msg: 'Insira seus dados para se cadastrar', type: 'info' });
    setTimeout(() => {
      setMessagePage(undefined);
    }, 300000);
  }, [])


  // Use Effects da página
  useEffect(() => {
    if(AuthError){
      const messageError = JSON.stringify(AuthError.message);
      setErrors([messageError]);
    }
    if(AuthLoading){
      setisLoadingPage(true);
    }
    if(AuthMessage){
      console.log("O AuthMessage:", AuthMessage);
      setisLoadingPage(false);
      if(AuthMessage.includes("Usuário criado com sucesso.")){
        setMsgPage(AuthMessage);
      }else if(AuthMessage.includes("Usuário já existe")){
        setMsgPage(AuthMessage);        
      }
    }
    if (AuthSuccess && AuthMessage?.includes("Usuário criado com sucesso")) {
      setisLoadingPage(false);
      setMsgPage("Usuário criado com sucesso, redirecionando...");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    if(AuthUser){
      //navigate('/');
    }
  }, [AuthError, AuthLoading, AuthSuccess, AuthMessage, AuthUser]);

  return (
    <div className='flex h-screen w-screen'>
      {messagePage && <Message msg={messagePage.msg || ''} type={messagePage.type || 'info'} duration={5000} />}
      {isLoadingPage && <Message type='info' msg="Aguarde..." />}
      {errors && <Message type='error' msg="Falha ao registrar, tente novamente." />}
      {msgPage && <Message type="success" msg={msgPage} duration={5000} /> }
      <div className="w-1/3 flex items-center justify-center bg-amber-800">
        <div className="w-3/4 h-3/4 bg-amber-900 rounded-lg flex items-center justify-center p-1">
          <img
            src='https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?semt=ais_items_boosted&w=740'
            alt='Imagem de Registro'
            className='w-96 h-96 object-contain'
            >
          </img>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-indigo-600">
        <div className="w-full max-w-md p-8 bg-indigo-700 rounded-lg shadow-lg flex flex-col gag-6">
          <h1 className='text-3xl font-semibold text-white font-center'>Cadastre-se</h1>
          <form onSubmit={handleRegister} className='flex flex-col gap-6 mt-10 font-semibold'>
            <input
              type="text"
              placeholder='Nome'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='p-3 rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500'
            />
            <input
              type="text"
              placeholder='Sobrenome'
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className='p-3 rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500'
            />
            <input
              type="text"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='p-3 rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500'
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="password"
              placeholder="Confirme sua Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              className={`bg-amber-900 hover:bg-amber-700 hover:scale-95 hover:font-bold text-white p-3 rounded font-semibold transition-colors ${isLoadingPage ? "opacity-50 cursor-not-allowed" : ""}`}
              type="submit"
            >
              {isLoadingPage ? "Enviando..." : "Registrar"}
            </button>
          </form>
          {errors && errors.length > 0 && (
            <p className="bg-indigo-700 text-red-500 mt-2 font-semibold text-center justify-around shadow-lg rounded-2xl p-2">
              {errors}
            </p>
          )}
          {msgPage && msgPage.length > 0 && (
            <p className="bg-indigo-700 text-white mt-2 font-semibold text-center justify-around shadow-lg rounded-2xl p-2">
              {msgPage}
            </p>
          )}
          <p className="text-white text-center mt-7">
            Já possui uma conta?{" "}
            <a
              href={isLoadingPage ? undefined : "/login"}
              className={`text-blue-300 underline hover:text-blue-400${isLoadingPage ? " pointer-events-none opacity-50" : ""}`}
              onClick={isLoadingPage ? (e) => e.preventDefault() : undefined}
            >
              Efetue seu login!
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register