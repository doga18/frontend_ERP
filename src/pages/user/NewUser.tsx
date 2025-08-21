import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import type { newUserByAnother } from "../../interfaces/AuthUserInterface";
import { registerUserByAnotherUser } from '../../slices/authSlice';

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";

type PropsNewUser = {
  isOpen: boolean;
  onClose: () => void;
  // Specifics Variables
  permission: number;
};

const NewUser = (props: PropsNewUser) => {
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  // Store
  const { /*user,*/ message: messageUser, error: errorUser } = useSelector((state: RootState) => state.auth);
  // useStates
  const [name, setName] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [passwordHash, setPasswordHash] = useState<string>("");
  const [avaiable, setAvaiable] = useState<boolean>(false);
  const [role, setRole] = useState<number | null>(null);
  //  const [statusNewPassword, setStatusNewPassword] = useState<boolean>(true);
  // const [anyChange, setAnyChange] = useState<string>('As modificações só terão efeito após salvar.');
  const [messagePage, setMessagePage] = useState<string>('')
  // Funções
  const handleNewPassword = () => {
    // Criando senha temporária para o usuário alvo.
    const baseString = name + Date.now().toString();
    const senhaArray = baseString.split("");
    console.log(senhaArray);
    for (let i = senhaArray.length - 1; i > 0; i--) {
      console.log("Tamanho da senha array:", senhaArray.length);
      const j = Math.floor(Math.random() * (i + 1));
      [senhaArray[i], senhaArray[j]] = [senhaArray[j], senhaArray[i]];
    }
    // Pega os primeiros 8 dígitos
    const newPassword = senhaArray.join("").substring(0, 8).replace(" ", "");
    setPasswordHash(newPassword);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Verificando se tudo foi informado
    if(name === '' || lastname === '' || email === '' || role === null){
      setMessagePage('Todos os campos devem ser preenchidos.');
      return;
    }
    // Montando o Objeto
    const newData: newUserByAnother = {
      name: name,
      lastname: lastname,
      email: email,
      avaiable: avaiable,
      password: passwordHash,
      roleId: Number(role)
    }
  // Enviando para o redux com a senha
    dispatch(registerUserByAnotherUser(newData));
  };
  // UseEffects
  useEffect(() => {
    // Limpando as mensagens de página
    setMessagePage('');
    if(messageUser){
      setMessagePage(messageUser);
    }
    if(errorUser){
      setMessagePage(errorUser.message);
    }
  }, [errorUser, messageUser])

  // useEffect(() => {
  //   if(messagePage.includes("sucesso")){
  //     setTimeout(() => {
  //       setMessagePage('');
  //       props.onClose();
  //     }, 3000);
  //   }
  // }, [messagePage])
  
  const optionsRole = (roleActualUser: number) => {
    // Admin 1 Owner 2 manager 3 employee 4 supplier 5
    if (roleActualUser === 1) {
      return {
        1: "Administrador",
        2: "Proprietário",
        3: "Gerente",
        4: "Funcionário",
        5: "Fornecedor",
      };
    }
    if (roleActualUser === 2) {
      return {
        2: "Proprietário",
        3: "Gerente",
        4: "Funcionário",
        5: "Fornecedor",
      };
    }
    if (roleActualUser === 3) {
      return {
        3: "Gerente",
        4: "Funcionário",
        5: "Fornecedor",
      };
    }
    if (roleActualUser === 4) {
      return {
        4: "Funcionário",
        5: "Fornecedor",
      };
    }
    if (roleActualUser === 5) {
      return {
        5: "Fornecedor",
      };
    }
  };

  return (
    <section className="editUser">
      <Dialog open={props.isOpen} onClose={() => {}}>
        <DialogBackdrop className="fixed inset-0 z-10 bg-black/70 w-screen h-screen flex items-center justify-center">
          <DialogPanel className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col items-center p-6">
            <button
              type="button"
              onClick={props.onClose}
              className="absolute top-1 right-1 px-2 shadow-md border-s-fuchsia-950 rounded-md bg-red-500 text-gray-700 hover:text-gray-950 hover:bg-red-600 transition duration-300 text-2xl font-bold focus:outline-none cursor-pointer"
              aria-label="Fechar"
            >
              &times;
            </button>
            <DialogTitle className="text-2xl font-bold mb-4 text-center w-full ">
              <div className="flex-1/2">
                <div className="title font-edu-titles-bold">
                  Novo usuário!
                </div>
              </div>
              
            </DialogTitle>
            {/* Formulário de edição do usuário! */}
            <form onSubmit={handleSubmit}>
              <div className="flex-row items-center justify-center">
                <h1 className="text-2xl font-semibold text-gray-800 my-6 font-edu-titles">
                  Dados pessoais
                </h1>
                <p className="text-gray-950 my-1 montserrat pb-5 text-center">
                  A senha será temporária, ao usuário logar será necessário atualizar a <span className="bg-green-100 px-1 py-1 rounded-xl">Senha</span>.
                  
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-5">
                {/* Coluna 1: Nome e Sobrenome lado a lado */}
                <div className="flex flex-row gap-4">
                  {/* Nome */}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent peer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <label
                        htmlFor="name"
                        className={`absolute left-1 ${name ? "-top-2" : "top-2"}
                          text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none
                          peer-placeholder-show:top-2 peer-place holder-shown:text-base
                          peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                          text-sm
                        `}
                      >
                        <span className="text-gray-500">Nome</span>
                      </label>
                    </div>
                  </div>
                  {/* Sobrenome */}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent peer"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                      <label
                        htmlFor="lastname"
                        className={`absolute left-1 ${
                          lastname ? "-top-2" : "top-2"
                        }
                          text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none
                          peer-placeholder-show:top-2 peer-place holder-shown:text-base
                          peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                          text-sm
                        `}
                      >
                        <span className="text-gray-500">Sobrenome</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent peer"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label
                        htmlFor="email"
                        className={`absolute left-1 ${
                          email ? "-top-2" : "top-2"
                        }
                          text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none
                          peer-placeholder-show:top-2 peer-place holder-shown:text-base
                          peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                          text-sm
                        `}
                      >
                        <span className="text-gray-500">Email</span>
                      </label>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="hashpassword"
                      id="hashpassword"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent peer"
                      disabled
                      value={
                        passwordHash.length >= 7 ? passwordHash : "Não resetada"
                      }
                      onChange={(e) => setPasswordHash(e.target.value)}
                    />
                    <label
                      htmlFor="hashpassword"
                      className={`absolute left-1 -top-2
                        text-gray-500 bg-amber-50 px-1 transition-all duration-300 pointer-events-none
                        peer-placeholder-show:top-2 peer-place holder-shown:text-base
                        peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                        text-sm
                      `}
                    >
                      {passwordHash.length > 6 ? (
                        <>
                          <span className="text-gray-950">Senha Criada</span>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-500">
                            Senha Temporária
                          </span>
                          <span className="text-red-600 capitalize"></span>
                        </>
                      )}
                    </label>
                  </div>
                  {passwordHash === "" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => (
                          handleNewPassword()
                        )}
                        className="mt-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-800 hover:scale-105 transition transform-cpu ease-in-out duration-300 cursor-pointer"
                      >
                        Criar senha
                      </button>
                    </>
                  ) : passwordHash.length > 2 && passwordHash.length < 6 ? (
                    <>
                      <button
                        type="button"
                        disabled={true}
                        className="mt-auto px-6 py-2 bg-green-600 text-gray-200 font-semibold rounded hover:bg-red-800 hover:scale-100 transition transform-cpu ease-in-out duration-300 cursor-progress"
                      >
                        Criando...
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={true}
                        className="mt-auto px-6 py-2 bg-orange-600 text-gray-200 font-semibold rounded hover:bg-orange-800 hover:scale-100 transition transform-cpu ease-in-out duration-300 cursor-not-allowed"
                      >
                        Senha Criada
                      </button>
                    </>
                  )}
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="space-y-3 text-center md:text-left lg:max-12">
                        <div className="flex-start">
                          <label
                            htmlFor="statusActive"
                            className="inline-flex items-center cursor-pointer"
                          >
                            <span className="font-extralight me-3">
                              Disponibilidade{" "}
                            </span>
                            <input
                              type="checkbox"
                              name="statusActive"
                              id="statusActive"
                              className="sr-only peer"
                              checked={avaiable ? true : false}
                              onChange={(e) =>
                                setAvaiable(e.target.checked)
                              }
                            />
                            <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 "></div>
                            <span className="ms-3 text-sm font-medium text-blue-950 inline-flex items-center justify-center"></span>
                            <span className="text-gray-600">
                              {avaiable ? "Ativo" : "Inativo"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <label
                        htmlFor="role"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      ></label>
                      <select
                        name="role"
                        id="role"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                        onChange={(e) => setRole(Number(e.target.value))}
                      >
                        <option value="0">Selecione um Cargo</option>
                        {props.permission &&
                          Object.entries(
                            optionsRole(props.permission) || {}
                          ).map(([key, value]) => (
                            <>
                              <option key={key} value={key} className='text-gray-950'>
                                {value}
                              </option>
                            </>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Coluna 2: outros campos */}
                <div className="flex items-center justify-center montserrat-bold">
                    {messagePage ? (
                      
                      <>
                        {messagePage.includes("não tem permissão") ?
                        (
                          <>
                            <p className="animate-pulse text-[1rem] text-gray-950 bg-red-200 rounded-4xl items-center justify-center px-10 py-3 shadow-sm hover:shadow-md hover:scale-110 hover:bg-red-600 hover:text-gray-950 transition-all duration-300 ease-in-out">
                              {messagePage}
                            </p>
                          </>
                        ):(
                          <>
                            <p className="animate-bounce text-[1rem] text-gray-950 bg-green-200 rounded-4xl items-center justify-center px-10 py-3 shadow-sm hover:shadow-md hover:scale-110 hover:bg-green-300 hover:text-gray-950 transition-all duration-300 ease-in-out">
                              {messagePage}
                            </p>
                          </>
                        )}
                      </>
                    ) : (<><span className="text-gray-500">As modificações só terão efeito após serem <span className="text-red-500">salvas</span>.</span></>)}
                </div>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <button
                    type="button"
                    onClick={props.onClose}
                    className="mt-auto px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-800 hover:scale-105 transition transform-cpu ease-in-out duration-300"
                  >
                    Fechar
                  </button>
                    {messagePage.includes("sucesso") ? (
                      <>
                      <button
                        type="submit"
                        disabled
                        className="animate-pulse mt-auto px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-800 hover:scale-105 transition transform-cpu ease-in-out duration-300"
                      >
                        Salvo!
                      </button>
                      </>
                  ):(
                    <>
                    <button
                      type="submit"
                      disabled={messagePage.includes("sucesso") ? true : false}
                      className="mt-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-800 hover:scale-105 transition transform-cpu ease-in-out duration-300"
                    >
                      Salvar
                    </button>  
                    </>
                  )}
                </div>
              </div>
            </form>
          </DialogPanel>
        </DialogBackdrop>
      </Dialog>
    </section>
  );
};

export default NewUser;
