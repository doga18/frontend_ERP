import React, { useEffect, useState } from "react";

// Importando interfaces
import type { AuthUserInterface, userDataEdit } from "../../interfaces/AuthUserInterface";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";

// Redux
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { getUserById, updateDataUserSelf } from "../../slices/authSlice";

// Importando a API para linkar as imagens
import { uploads, formatDateTimeLocal } from "../../utils/config";

// Importando page de mensagens
import Message from "../../components/Message";

interface Props {
  onClose?(): void | undefined;
  isOpen?: boolean | undefined;
  userData?: number | undefined;
}

const UserProfile = (props: Props) => {
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, userSelected, message, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Usestates
  // Basic Data
  const [statusUser, setStatusUser] = useState<boolean>(false);
  const [nameUser, setNameUser] = useState<string>("");
  const [lastNameUser, setLastNameUser] = useState<string>("");
  const [emailUser, setEmailUser] = useState<string>("");
  // disponibilidade, permissão do usuário, data de criação, senha atual e novas senhas
  const [roleUser, setRoleUser] = useState<number>(2);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [passwordActual, setPasswordActual] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
  const [perfilImage, setPerfilImage] = useState<File | null>(null);
  const [imageActualUrl, setImageActualUrl] = useState<string | null>("");
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const [msgPage, setMsgPage] = useState<string[]>([]);
  const [passwordActualVisible, setPasswordActualVisible] = useState<boolean>(false);
  const [passwordNewVisible, setPasswordNewVisible] = useState<boolean>(false);
  const [passwordNewConfirmVisible, setPasswordNewConfirmVisible] = useState<boolean>(false);
  const [passwordActualMsg, setPasswordActualMsg] = useState<string | null>(null)
  const [newPasswordMsg, setNewPasswordMsg] = useState<string | null>(null)
  const [newPasswordConfirmMsg, setNewPasswordConfirmMsg] = useState<string | null>(null)
  const [notifyPage, setNotifyPage] = useState<{ msg: string, type: 'success' | 'error' | 'info' } | null>(null);
  // Montando um usestate porém como dicionario com chave e valor
  // Funções
  const handleWithErrorsInPage = (error: string, clear: boolean = false) => {
    // Limpa a lista de erros
    if (clear) setErrorsList([]);
    // Adicionando erros na lista
    setErrorsList([...errorsList, error]);
  };
  const handleWithMsgInPage = (msg: string, clear: boolean = false) => {
    // Limpa a lista de erros
    if (clear) setMsgPage([]);
    // Adicionando erros na lista
    setMsgPage([...msgPage, msg]);
  };
const validatePasswords = () => {
  const errors: string[] = [];

  if (newPassword && newPassword.length < 6) {
    errors.push("A nova senha deve ter pelo menos 6 caracteres.");
  }

  if (newPassword && !/[A-Z]/.test(newPassword)) {
    errors.push("A nova senha deve conter ao menos uma letra maiúscula.");
  }

  if (newPassword && !/[0-9]/.test(newPassword)) {
    errors.push("A nova senha deve conter ao menos um número.");
  }

  if (newPassword && newPassword !== newPasswordConfirm) {
    errors.push("As senhas não coincidem.");
  }

  return errors;
};
  const handleEditData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Verificando os dados!
    const newName = userSelected?.name !== nameUser ? nameUser : userSelected?.name;
    const newLastName = userSelected?.lastname !== lastNameUser ? lastNameUser : userSelected?.lastname;
    const newEmail = userSelected?.email !== emailUser ? emailUser : userSelected?.email;
    const validNewPassword = newPassword;
    const newRoleId = userSelected?.roleId !== 1 ? userSelected?.roleId : roleUser;
    
    // Montando o formData
    const newEditData = new FormData();
    newEditData.append("userId", String(userSelected?.userId));
    newEditData.append("name", newName);
    newEditData.append("lastname", newLastName);
    newEditData.append("email", newEmail);
    if(validatePasswords()){
      newEditData.append("password", validNewPassword);
    }else{
      console.log("A senha não atende os requisitos mínimos: " + newPassword);
    }
    if(userSelected?.roleId !== 1) newEditData.append("roleId", String(newRoleId));
    if(perfilImage !== null){
      newEditData.append("imagePerfil", perfilImage);
    }
    // Enviando os dados para a API
    console.log("Veja a formData montada:   ", newEditData);
    dispatch(updateDataUserSelf(newEditData));
  };
  // UseEffects
  // Verificação das senhas
  useEffect(() => {
    const idUser = localStorage.getItem("user");
    const items = JSON.parse(idUser!);
    dispatch(getUserById(Number(items.userId)));
  }, []);
  // Preenchendo os dados
  useEffect(() => {
    if (userSelected && userSelected.userId) {
      setStatusUser(userSelected.avaiable);
      const dataFormat = userSelected.createdAt
        ? formatDateTimeLocal(userSelected.createdAt.toString())
        : "Não informado";
      setCreatedAt(dataFormat);
      setNameUser(userSelected.name);
      setLastNameUser(userSelected.lastname);
      setEmailUser(userSelected.email);
      setRoleUser(userSelected.roleId);
      if (userSelected.files && userSelected.files.length > 0) {
        setImageActualUrl(userSelected.files[0].fileUrl);
      }
    }
  }, [userSelected]);
  // Validação da senha
  useEffect(() => {
    if(newPassword.length >= 3){
      if(validatePasswords()){
        setNewPasswordMsg(validatePasswords()[0]);
      }
      else{
        setNewPasswordMsg(null);
      }
    }
  }, [newPassword])
  // Reposta da tentativa da API
  useEffect(() => {
    if(error){
      console.log("O resultado da atualização foi: " + message);
      // Setando a msg da API para o usuário
      if(error.message){
        setNotifyPage({
          msg: error.message,
          type: "error",
        });
        setTimeout(() => {
          setNotifyPage(null);
        }, 8000);
      }
    }
    if(message){
      setNotifyPage({
        msg: message,
        type: "success",
      });
      setTimeout(() => {
        setNotifyPage(null);
      }, 8000);
    }
  }, [message, error])
  // Debug
  // console.log("Status do usuário!: " + statusUser);

  return (
    <section id="administrative" className="p-6 xl:max-w-6xl xl:mx-auto">
      {notifyPage && (
        <Message msg={notifyPage.msg} type={notifyPage.type} duration={5000} />
      )}
      <section className="mb-6 flex items-center justify-center">
        <div className="flex items-center justify-start">
          <span className="inline-flex justify-center items-center w-120 h-12 rounded-full bg-white text-black mr-3">
            <h2 className="text-3xl font-extralight items-center justify-center text-shadow-2xs transition ease-in-out duration-300 hover:text-amber-800">
              Perfil do Usuário
            </h2>
          </span>
        </div>
      </section>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center my-5 gap-5">
          <div className="animate-pulse font-semibold text-gray-900 text-2xl">
            <span className="text-gray-900">Carregando</span>
          </div>
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="">
          <div className="bg-white flex mb-6 rounded-2xl flex-col">
            <div className="flex-1 p-6">
              <div className="flex flex-col lg:flex-row items-center justify-around lg:justify-center">
                <div className="mb-6 lg:mb-0 lg:mx-12 transition duration-500 ease-in-out hover:scale-120 cursor-pointer">
                  {imageActualUrl ? (
                    <>
                      <img
                        alt="doe.doe.doe@example.com"
                        className="rounded-full block h-auto w-50 max-w-80 bg-gray-100 dark:bg-slate-800 hover:scale-110"
                        src={`${uploads}/${imageActualUrl}`}
                      ></img>
                    </>
                  ) : (
                    <>
                      <img
                        alt="doe.doe.doe@example.com"
                        className="rounded-full block h-auto w-50 max-w-80 bg-gray-100 dark:bg-slate-800 hover:scale-110"
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=doe-doe-doe-example-com"
                      ></img>
                    </>
                  )}
                </div>
                <div className="space-y-3 text-center md:text-left lg:max-12">
                  <div className="flex justify-center md:block">
                    <label
                      htmlFor="notificationActivity"
                      className="inline-flex items-center cursor-pointer"
                    >
                      <input
                        id="notificationActivity"
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 "></div>
                      <span className="ms-3 text-sm font-medium text-blue-900 inline-flex items-center justify-center">
                        Notificações
                      </span>
                    </label>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {nameUser ? nameUser + " " + lastNameUser : "Não informado"}
                  </h1>
                  <p className="text-sm">
                    Último login: {createdAt ? createdAt : "Não informado"}
                  </p>
                  <div className="flex justify-center md:block">
                    <div
                      className={`inline-flex items-center capitalize leading-none text-sm border rounded-full py-1.5 px-4 ${
                        statusUser
                          ? "bg-blue-500 border-blue-600 text-white"
                          : "bg-red-500 border-red-600 text-white"
                      } `}
                    >
                      <span className="inline-flex justify-center items-center w-4 h-4 mr-2">
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          className="inline-block"
                        >
                          <path
                            fill="currentColor"
                            d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"
                          ></path>
                        </svg>
                      </span>
                      <span>{statusUser ? "Ativo" : "Inativo"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleEditData}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <div className="bg-amber-50 flex mb-6 rounded-2xl flex-col">
                  <div className="flex-1 p-6 undefined inline-flex items-center justify-center">
                    <div
                      className={`mb-6 last:mb-0 items-center justify-center`}
                    >
                      <label
                        htmlFor="perfilImage"
                        className="block mb-2 font-semibold"
                      >
                        <span className="line-clamp-1">Imagem de Perfil</span>
                      </label>
                      <div className="relative">
                        <div className="flex items-stretch justify-start relative">
                          <label htmlFor="perfilImage" className="inline-flex">
                            <a
                              className="inline-flex justify-center items-center whitespace-nowrap focus:outline-hidden transition-colors focus:ring-3 duration-150 border cursor-pointer rounded-sm border-blue-600 dark:border-blue-500 ring-blue-300 dark:ring-blue-700 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 hover:border-blue-700 dark:hover:bg-blue-600 dark:hover:border-blue-600   py-2 px-3"
                              type="button"
                            >
                              <span className="inline-flex justify-center items-center w-6 h-6 ">
                                <svg
                                  viewBox="0 0 24 24"
                                  width="16"
                                  height="16"
                                  className="inline-block"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"
                                  ></path>
                                </svg>
                              </span>
                              <span className="px-2">Upload</span>
                              <input
                                type="file"
                                name="perfilImage"
                                id="perfilImage"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files) {
                                    setPerfilImage(e.target.files[0]);
                                  }
                                }}
                              ></input>
                            </a>
                          </label>
                        </div>
                      </div>
                      <div className="text-xs text-gray-900 text-shadow-blue-300 mt-1">
                        Tamanho máximo 5MB
                      </div>
                    </div>
                    {perfilImage && (
                      <div
                        className="w-full flex flex-col items-center justify-center 
                    transition duration-500 ease-in-out hover:scale-130"
                      >
                        <img
                          alt="doe.doe.doe@example.com"
                          className="rounded-full block h-auto w-30 max-w-full bg-gray-100 dark:bg-slate-800 hover:shadow-lg hover:shadow-gray-400/50"
                          src={URL.createObjectURL(perfilImage)}
                        ></img>
                        <p className="mt-1">
                          <span className="text-xs text-gray-900 text-shadow-blue-300 capitalize">
                            {perfilImage.name}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-amber-50 flex mb-6 rounded-2xl flex-col">
                  <div className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold text-gray-800 my-1">
                      Dados Pessoais
                    </h1>
                    <div className="mt-10 mb-6 last:mb-0">
                      <label
                        htmlFor="avaialability"
                        className="block mb-2 font-semibold"
                      >
                        {/* <span className="line-clamp-1">Status da conta</span> */}
                        <div className="relative">
                          <input
                            id="avaialability"
                            type="checkbox"
                            //disabled={statusUser ? false : true}
                            defaultChecked={statusUser}
                            onClick={() => setStatusUser(!statusUser)}
                            className="sr-only peer"
                          />
                          <div className="inline-flex items-center justify-center">
                            <span className="me-3 text-sm font-medium text-gray-950 inline-flex items-center justify-center line-clamp-1">
                              Status da conta
                            </span>
                            <div
                              className={`relative w-11 h-6 ${
                                statusUser ? "bg-cyan-400" : "bg-red-500"
                              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer 
                          peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] 
                          after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}
                            ></div>
                          </div>
                          {/* <input
                    id="notificationActivity"
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 "></div>
                  <span className="ms-3 text-sm font-medium text-blue-900 inline-flex items-center justify-center">
                    Notificações
                  </span> */}
                        </div>
                      </label>
                    </div>
                    {/* Floating label input */}
                    <div className="mt-10 mb-6 last:mb-0">
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          placeholder=" "
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 peer"
                          required
                          value={nameUser ?? ""}
                          onChange={(e) => setNameUser(e.target.value)}
                        />
                        <label
                          htmlFor="name"
                          className={`absolute left-3 ${
                            nameUser ? "-top-2" : "top-2"
                          } text-gray-500 bg-amber-50 px-1 transition-all duration-200 pointer-events-none
                      peer-placeholder-shown:top-2 peer-place holder-shown:text-base
                      peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                      text-sm`}
                        >
                          Nome
                        </label>
                      </div>
                    </div>
                    <div className="mt-10 mb-6 last:mb-0">
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          placeholder=" "
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 peer"
                          required
                          value={emailUser ?? ""}
                          onChange={(e) => setEmailUser(e.target.value)}
                        />
                        <label
                          htmlFor="email"
                          className={`absolute left-3 ${
                            emailUser ? "-top-2" : "top-2"
                          } text-gray-500 bg-amber-50 px-1 transition-all duration-200 pointer-events-none
                      peer-placeholder-shown:top-2 peer-place holder-shown:text-base
                      peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                      text-sm`}
                        >
                          Email
                        </label>
                      </div>
                    </div>
                    <div className="mt-10 mb-6 last:mb-0">
                      <div className="relative">
                        <input
                          type="text"
                          name="lastname"
                          id="lastname"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 peer"
                          value={lastNameUser ?? ""}
                          onChange={(e) => setLastNameUser(e.target.value)}
                        />
                        <label
                          htmlFor="lastname"
                          className={`absolute left-3 ${
                            lastNameUser ? "-top-2" : "top-2"
                          } text-gray-500 bg-amber-50 px-1 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-2 peer-place holder-shown:text-base peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600 text-sm`}
                        >
                          Sobrenome
                        </label>
                      </div>
                    </div>
                    <div className="mt-10 mb-6 last:mb-0">
                      <div className="relative">
                        <select
                          name="roleId"
                          id="roleId"
                          disabled={roleUser === 1 ? true : false}
                          className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                            roleUser === 1 ? "bg-red-200" : ""
                          }`}
                          value={roleUser}
                          onChange={(e) => setRoleUser(Number(e.target.value))}
                        >
                          {roleUser === 1 && (
                            <option value={1}>Administrador</option>
                          )}
                          <option value={2}>Proprietário</option>
                          <option value={3}>Gerente</option>
                          <option value={4}>Funcionario</option>
                        </select>
                        <small className="text-sm text-gray-600 text-shadow-3xl font-light">
                          {roleUser === 1 && (
                            <span className="">
                              Não é possível alterar a permissão do
                              administrador
                            </span>
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="justify-start flex-1">
                  <div className="bg-amber-50 flex mb-6 rounded-2xl flex-col -pt-1">
                    <div className="flex-1 p-6 undefined">
                      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        Lembretes sobre segurança
                      </h1>
                      <small className="text-sm font-light items-center">
                        Preencha os dados para atualizar seus dados pessoais
                      </small>
                      <p className="mt-2 text-1xl">
                        A senha precisa seguir critérios de segurança mínima
                        para ser aceita, pode conter no mínimo 8 caracteres,
                        sendo eles: letras, numeros e simbolos. Caso a senha não
                        tenha esses critérios, ela nao será aceita
                        <span className="text-red-500 font-semibold">
                          {" "}
                          entenda
                        </span>{" "}
                        que isso é controlado para garantir a segurança dos
                        dados pessoais do usuário.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="justify-end flex-1">
                  <div className="bg-amber-50 flex mb-2 rounded-2xl flex-col pt-1">

                    <div className="flex-1 p-6 undefined">
                      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        Dados de Segurança
                      </h1>
                      <small className="text-sm font-light items-center">
                        Preencha os dados para atualizar sua senha
                      </small>
                      <small className="text-xs">
                        {passwordActual.length >= 0 && (
                          <p className="text-gray-800">
                            Caso a senha não seja informada ela
                            <span className="text-red-500 text-shadow-amber-200 ms-1">
                              não será atualizada!
                            </span>
                          </p>
                        )}
                      </small>
                      <div className="mt-8 mb-6 last:mb-0">
                        <div className="relative">
                          <input
                            type={passwordActualVisible ? "text" : "password"}
                            id="passwordActual"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 peer pr-10"
                            
                            value={passwordActual}
                            onChange={(e) => setPasswordActual(e.target.value)}
                          />
                          <label
                            htmlFor="passwordActual"
                            className={`absolute left-3 ${
                              passwordActual.length > 1 ? "-top-2" : "top-2"
                            }
                      } text-gray-500 bg-amber-50 px-1 transition-all duration-200 pointer-events-none
                        peer-placeholder-shown:top-2 peer-place holder-shown:text-base
                        peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                        text-sm`}
                          >
                            Senha Atual
                          </label>
                          <button
                            type="button"
                            className="absolute right-6 top-1/3 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                            onClick={() => setPasswordActualVisible((v) => !v)}
                            tabIndex={-1}
                          >
                            <div className="text-gray-950">
                              {passwordActualVisible ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </div>
                          </button>
                          <small className="text-xs text-gray-600 font-extralight ">
                            <div className="flex items-center justify-between">
                              <div className="status mt-2">
                                <span className="font-semibold me-1"></span>
                                {!passwordActual
                                  ? "Aguardando preenchimento"
                                  : passwordActual.length >= 3
                                  ? "Senha preenchida ✅"
                                  : "Preenchimento incompleto ❌"}
                              </div>
                              {passwordActual.length === 0 ? (
                                ""
                              ) : (
                                <div
                                  className="btnCleanup mt-2 cursor-pointer"
                                  onClick={() => setPasswordActual("")}
                                >
                                  <span className="ms-1 font-semibold text-gray-950">
                                    Limpar{" "}
                                    <span className="text-red-700">❌</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </small>
                        </div>
                      </div>
                      <div className="mb-6 last:mb-0 mt-2">
                        <div className="relative">
                          <input
                            type={passwordNewVisible ? "text" : "password"}
                            name="newPassword"
                            id="newPassword"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 peer"
                            required={passwordActual.length > 0 ? true : false}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <label
                            htmlFor="newPassword"
                            className={`absolute left-3 ${
                              newPassword.length > 1 ? "-top-2" : "top-2"
                            }
                      } text-gray-500 bg-amber-50 px-1 transition-all duration-200 pointer-events-none
                        peer-placeholder-shown:top-2 peer-place holder-shown:text-base
                        peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                        text-sm`}
                          >
                            Nova Senha
                          </label>
                          <button
                            type="button"
                            className="absolute right-6 top-1/3 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                            onClick={() => setPasswordNewVisible((v) => !v)}
                            tabIndex={-1}
                          >
                            <div className="text-gray-950">
                              {passwordNewVisible ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </div>
                          </button>
                          <small className="text-xs text-gray-600 font-extralight ">
                            <div className="flex items-center justify-between">
                              <div className="status mt-2">
                                <span className="font-semibold me-1"></span>
                                {!newPassword
                                  ? "Aguardando preenchimento"
                                  : newPassword.length >= 3
                                  ? newPasswordMsg || "Senha preenchida ✅"
                                  : "Preenchimento incompleto ❌"}
                              </div>
                              {newPassword.length === 0 ? (
                                ""
                              ) : (
                                <div
                                  className="btnCleanup mt-2 cursor-pointer"
                                  onClick={() => setNewPassword("")}
                                >
                                  <span className="ms-1 font-semibold text-gray-950">
                                    Limpar{" "}
                                    <span className="text-red-700">❌</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </small>
                        </div>
                      </div>
                      <div className="mb-6 last:mb-0 mt-2">
                        <div className="relative">
                          <input
                            type={
                              passwordNewConfirmVisible ? "text" : "password"
                            }
                            name="confirmPassword"
                            id="confirmPassword"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 peer"
                            required={passwordActual.length > 0 ? true : false}
                            value={newPasswordConfirm}
                            onChange={(e) =>
                              setNewPasswordConfirm(e.target.value)
                            }
                          />
                          <label
                            htmlFor="confirmPassword"
                            className={`absolute left-3 ${
                              newPasswordConfirm.length > 1 ? "-top-2" : "top-2"
                            }
                      } text-gray-500 bg-amber-50 px-1 transition-all duration-200 pointer-events-none
                        peer-placeholder-shown:top-2 peer-place holder-shown:text-base
                        peer-focus:-top-4 peer-fo3cus:text-sm peer-focus:text-blue-600
                        text-sm`}
                          >
                            Confirmação de Senha
                          </label>
                          <button
                            type="button"
                            className="absolute right-6 top-1/3 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                            onClick={() =>
                              setPasswordNewConfirmVisible((v) => !v)
                            }
                            tabIndex={-1}
                          >
                            <div className="text-gray-950">
                              {passwordNewConfirmVisible ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </div>
                          </button>
                          <small className="text-xs text-gray-600 font-extralight ">
                            <div className="flex items-center justify-between">
                              <div className="status mt-2">
                                <span className="font-semibold me-1"></span>
                                {!newPasswordConfirm
                                  ? "Aguardando preenchimento"
                                  : newPasswordConfirm.length >= 3
                                  ? newPasswordConfirm === newPassword
                                    ? "Senha conferida ✅"
                                    : "As senhas não são idênticas ❌"
                                  : "❌"}
                              </div>
                              {newPasswordConfirm.length === 0 ? (
                                ""
                              ) : (
                                <div
                                  className="btnCleanup mt-2 cursor-pointer"
                                  onClick={() => setNewPasswordConfirm("")}
                                >
                                  <span className="ms-1 font-semibold text-gray-950">
                                    Limpar{" "}
                                    <span className="text-red-700">❌</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
          {errorsList && errorsList.length > 0 && (
            <div className="flex flex-col items-center align-center">
              <div className="bg-gray-200 border rounded-lg border-gray-300 p-6 my-3">
                <span className="text-gray-600 inline-flex items-center">
                  <span className="text-red-600 me-1">
                    {errorsList && errorsList.length > 1 ? "Erros:" : "Erro"}
                  </span>{" "}
                  {errorsList && errorsList.length > 0
                    ? errorsList.map((error, index) => (
                        <p className="me-1" key={index}>
                          {" "}
                          {error}
                        </p>
                      ))
                    : "Nenhum erro"}
                </span>
              </div>
            </div>
          )}

          <div className="bg-amber-50 flex mb-6 rounded-2xl flex-col items-center ">
            <div className="inline-flex items-center justify-center gap-4 py-6">
              <a
                href="/"
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-800 hover:scale-105 transition transform-cpu ease-in-out duration-300"
              >
                Cancelar
              </a>
              {isLoading ? (
                <>
                  <button
                    type="button"
                    disabled
                    className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded hover:bg-cyan-800 hover:scale-105 transition transform-cpu ease-in-out duration-300"
                    >
                    Aguarde
                  </button>
                </>
              ): (
                <>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-800 hover:scale-105 transition transform-cpu ease-in-out duration-300"
                    >
                    Salvar
                  </button>
                </>
              )}
              
            </div>
          </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default UserProfile;
