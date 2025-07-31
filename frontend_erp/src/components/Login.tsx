import './register.css'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

// usando icones do bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../slices/authSlice';

import Message from '../components/Message';

// Importando o tratamento do dispath.

import type { AppDispatch, RootState } from '../store';

//type Props = {}

const Register = () => {
  // Criando as useStates
  const [info_login, setInfo_login] = useState('');
  const [password, setPassword] = useState('');
  

  // Status da page
  const [errors, setErrors] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState('');

  // 
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { 
    error: AuthError, user: AuthUser, /* isLoading: AuthLoading, */ success: AuthSuccess 
  } = useSelector((state: RootState) => state.auth);

  // Funções!
  // Verificação se a senha cumpre os requisitos mínimos.
  const validatePassword = (password: string) => {
    // Zerando as mensagens e Erros
    setErrors('');
    setMensagens('');
    if(password.length < 6) {
      setErrors('A senha precisa ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  }
  // Lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log('tentativa de envio de formulário'  );

    // Declarando objeto à ser montado.
    interface newUser {
      email: string;
      password: string;
      
    }

    // Validando a senha
    const isPasswordValid = validatePassword(password);
    if(!isPasswordValid) {
      setErrors('Um erro ocorreu no campo da Senha.');
      return;
    }
    
    // Montando o objeto
    const newUser: newUser = {
      email: info_login,
      password
    };

    // Disparando a ação de registro.
    dispatch(loginUser(newUser));

  }

  // Alterando informações com use Effect
  useEffect(() => {
    // Printando caso aja modificação, apagar depois.
    console.log('mensagem de erro: '+ AuthError);
    console.log('mensagem de mensagem: '+ mensagens);
    // Zerando as mensagens;
    setErrors('');
    setMensagens('');
    if(AuthUser) {
      console.log('o authuser foi modificado.');
      console.log(AuthUser);
    }
    if(AuthSuccess) {
      setMensagens(
        'Cadastro efetuado com sucesso! Redirecionando para a página de login...'
      );
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      // navigate('/login', { replace: true });
    }
    if(AuthError) {
      setErrors(AuthError.message || 'Erro desconhecido ao tentar efetuar o login.');
    }
  }, [AuthSuccess, AuthError, AuthUser, navigate]);

  console.log('o authuser foi modificado', AuthUser);

  return (
    <main>
      <div className="container-xl px-1">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8 col-sm 11">
            <div className="card my-5 ">
              <div className="card-body p-5 text-center ">
                <div className="h3 fw-light mb-3">
                    Entrar
                  </div>
                  <div className=" mb-2">
                    Facilite a entrada usando sua rede social preferida.
                  </div>
                  <Link to={`/`} className='btn btn-icon btn-facebook mx-1'><i className="bi bi-facebook"></i></Link>
                  <Link to={`/`} className='btn btn-icon btn-twitter mx-1'><i className="bi bi-twitter-x"></i></Link>
                  <Link to={`/`} className='btn btn-icon btn-google mx-1'><i className="bi bi-google"></i></Link>
                  <Link to={`/`} className='btn btn-icon btn-github mx-1'><i className="bi bi-github"></i></Link>
              </div>
              <hr className="my-2 " />
              <div className="card-body px-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="info_login" className="form-label">E-mail ou Usuário</label>
                    <div className="form-floating">
                      <input
                        type="text"
                        name="info_login"
                        id="info_login"
                        placeholder='Insira seu e-mail ou usuário'
                        className="form-control"
                        value={info_login}
                        onChange={(e) => setInfo_login(e.target.value)}
                        />
                        <label htmlFor="info_login">
                          Insira seu e-mail ou usuário
                        </label>
                    </div>                    
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <div className="form-floating">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder='Insira sua senha'
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password">
                          Insira sua senha
                        </label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center justify-content-between mb-0">
                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        id="remember_me"
                        className="form-check-input"
                        />
                      <label
                        htmlFor="remember_me"
                        className="form-check-label mx-2"
                      >
                        Lembrar-me de mim
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary-pallete">Entrar</button>
                  </div>
                </form>
              </div>
              <hr className="my-0" />
              <div className="card-body px-5 py-3">
                <div className="text-center fw-bolder">
                  Já possui uma conta, 
                  <Link to={`/register`} className=" mx-2 text-decoration-none ">entre aqui!</Link>
                </div>
                {errors && <Message type="error" msg={errors} />}
                {mensagens && <Message type="success" msg={mensagens} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register