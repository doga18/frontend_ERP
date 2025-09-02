import React, { useState, useEffect } from "react";

// Importando Dialogs para mondar o modal...
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
// import { formatDateTimeLocal } from '../../utils/config';
// import type { OsDetailsInterface, newOsInterface } from "../../interfaces/OsDetailsInterface";
import type { ClientDataUnique } from "../../interfaces/ClientsInterface";
import { PhotoIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
// Importando Redux and slices
import {
  /*searchClientByName,*/ getAllClientCount,
} from "../../slices/clientesSlice";
import { createOs } from "../../slices/osSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";

// Import Pages
import NewClient from "../client/NewClient";
import Message from "../../components/Message";
// import {
//   newOs
// } from '../../slices/osSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notify?: (msg: string) => void;
}

interface MsgPageInterface {
  type: 'success' | 'error' | 'info';
  msg: string;
}

const NewOs = ({ isOpen, onClose, notify }: Props) => {
  // Instanciando variáveis
  const dispatch = useDispatch<AppDispatch>();
  const { rows: rowsClients, loading: loadingSearch } = useSelector(
    (state: RootState) => state.client
  );
  // Verificando status das OS
  const {
    data: dataOs,
    //loading: loadingOs,
    message: messageOs,
    error: errorOs,
  } = useSelector((state: RootState) => state.os);
  // UseStates
  // Variaveis para armazenar os dados do formulário
  const [titleForm, setTitleForm] = useState<string>("");
  const [descriptionForm, setDescriptionForm] = useState<string>("");
  const [statusForm, setStatusForm] = useState<string>("Aberto");
  const [priorityForm, setPriorityForm] = useState<string>("Normal");
  const [budgetForm, setBudgetForm] = useState<string>("0");
  const [clientDataForm, setclientDataForm] = useState<ClientDataUnique[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientDataUnique[]>(
    []
  );
  const [clientNameSearch, setclientNameSearch] = useState<string>("");
  const [clientIdForm, setClientIdForm] = useState<number | undefined>(0);
  // Arquivos do formulários // file of form
  const [filesInit, setFilesInit] = useState<File[]>([]);
  // Controle de página
  const [modalNewClient, setModalNewClient] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [msgPage, setMsgPage] = useState<MsgPageInterface>({
    type: "success",
    msg: "",
  });

  // Funções
  const fechar = () => {
    notify?.("OS criada com sucesso!");
    onClose();
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clientIdForm) {
      alert("Por favor, selecione um cliente à ser vinculado a OS.");
    }
    setStatusForm("Aberto");
    // Montando o formData
    const formData = new FormData();
    formData.append("title", titleForm);
    formData.append("description", descriptionForm);
    formData.append("status", statusForm);
    formData.append("priority", priorityForm);
    formData.append("budget", budgetForm);
    formData.append("discount", "0");
    // Vinculando o usuário à OS.
    formData.append("clientAssigned", String(clientIdForm));
    // Aidicioando os arquivos ao formData, se for informado...
    if (filesInit.length > 0) {
      filesInit.forEach((file) => {
        formData.append("images", file);
      });
    }
    // Mostando o formadata montado!
    console.log("Dados do form: ");
    // Fazendo um for each para printar
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    // Enviando os dados para a API
    dispatch(createOs(formData));
    // console.log(res);
  };

  const cleanUpNameSearch = () => {
    setclientNameSearch("");
    setClientIdForm(0);
  };

  // Handle with files // Lidando com arquivos
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Listando os arquivos
    if (e.target.files) {
      setFilesInit(Array.from(e.target.files));
    }
    console.log("Dados dos arquivos: \n");
    console.log(filesInit);
  };

  // UseEffect
  useEffect(() => {
    dispatch(getAllClientCount({ limit: 99999, page: "no" }));
  }, [dispatch]);

  useEffect(() => {
    if (rowsClients) setclientDataForm(rowsClients);
  }, [rowsClients]);

  useEffect(() => {
    if (clientNameSearch.length >= 1) {
      console.log("Buscando clientes...");
      const filtered = clientDataForm.filter((client) => {
        console.log("retornando: " + client.name);
        return client.name
          .toLowerCase()
          .startsWith(clientNameSearch.toLowerCase());
      });
      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  }, [clientNameSearch, clientDataForm]);

  useEffect(() => {
    if (loadingSearch) {
      setLoadingPage(true);
    } else {
      setLoadingPage(false);
    }
  }, [loadingSearch]);
  //data: dataOs, loading: loadingOs, message: messageOs
  useEffect(() => {
    if(messageOs?.includes("sucesso")){
      notify?.(messageOs);
    }
    if(!errorOs?.message.includes("sucesso")){
      setMsgPage({
        type: "error",
        msg: errorOs?.message ?? '',
      });
    }
  }, [dataOs, messageOs, errorOs]);

  return (
    <>
      {msgPage && <Message msg={msgPage.msg} type={msgPage.type} duration={5000} />}
      <Dialog open={isOpen} onClose={() => {}} className="relative z-10">
        <DialogBackdrop
          className="fixed inset-0 bg-black/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          transition
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="bg-white p-6 rounded shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-2xl font-semibold mb-4 text-gray-700">
              Detalhes da Nova Ordem de Serviço (OS)
            </DialogTitle>
            {loadingPage ? (
              <>
                <div className="flex justify-center items-center font-extralight">
                  <div className="flex-col">
                    <div className="information">
                      <span className="loader">Buscando Clientes</span>
                    </div>
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-86 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only ">Carregando...</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <div className="border-b border-gray-200 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">
                      Informações básicas
                    </h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                      Informações básicas da Ordem de Serviço
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="osTitle"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Título da OS
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="osTitle"
                            id="osTitle"
                            placeholder="Título da Ordem de Serviço"
                            value={titleForm}
                            onChange={(e) => setTitleForm(e.target.value)}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          ></input>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="osDescription"
                          className="block text-sm/6 font-medium text-gray-900 "
                        >
                          Descrição
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="os'Description"
                            name="osDescription"
                            placeholder="Descrição da Ordem de Serviço..."
                            rows={3}
                            value={descriptionForm}
                            onChange={(e) => setDescriptionForm(e.target.value)}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          ></textarea>
                        </div>
                      </div>

                      <div className="sm:col-span-1">
                        <label
                          htmlFor="statusForm"
                          className="block text-sm/6 font-medium text-gray-900 "
                        >
                          Status
                        </label>
                        <div className="mt-2">
                          <select
                            name="statusForm"
                            id="statusForm"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            disabled
                          >
                            <option value="Aberto">Aberta</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-1">
                        <label
                          htmlFor="priorityForm"
                          className="block text-sm/6 font-medium text-gray-900 "
                        >
                          Prioridade
                        </label>
                        <div className="mt-2">
                          <select
                            name="priorityForm"
                            id="priorityForm"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={priorityForm}
                            onChange={(e) => setPriorityForm(e.target.value)}
                          >
                            <option value="Normal">Normal</option>
                            <option value="Baixa">Baixa</option>
                            <option value="Média">Média</option>
                            <option value="Alta">Alta</option>
                            <option value="Urgente">Urgente</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-1">
                        <label
                          htmlFor="budgetForm"
                          className="block text-sm/6 font-medium text-gray-900 "
                        >
                          Pré-Orcamento
                        </label>
                        <div className="mt-2 text-gray-900">
                          <input
                            type="text"
                            name="budgetForm"
                            id="budgetForm"
                            className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
                            placeholder="R$ 0,00"
                            value={budgetForm ? budgetForm : ""}
                            onChange={(e) => setBudgetForm(e.target.value)}
                          ></input>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="allignclient"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          <div className="flex gap-2">
                            <span className="text-gray-800 text-shadow-2xs font-medium">
                              Cliente Vinculado
                            </span>
                            {!clientIdForm && (
                              <span
                                className="text-red-600 text-shadow-2xs"
                                style={{ fontSize: "12px" }}
                              >
                                Nenhum Cliente Selecionado
                              </span>
                            )}
                          </div>
                        </label>
                        <div className="mt-2">
                          <div className="flex">
                            <input
                              type="text"
                              name="allignclient"
                              id="allignClient"
                              className={` ${
                                clientDataForm.length >= 1
                                  ? "text-gray-900"
                                  : "text-gray-600"
                              } 
                                w-full appearance-none rounded-md bg-white py-1.5 pr-10 pl-3 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6
                                `}
                              value={clientNameSearch}
                              onChange={(e) => {
                                setclientNameSearch(e.target.value);
                              }}
                              onFocus={() => setShowDropdown(true)}
                            ></input>
                            <div className="transition duration-200">
                              {clientIdForm && clientIdForm >= 0 ? (
                                <XMarkIcon
                                  className="relative right-8 top-4 -translate-y-1/2 w-6 h-6 text-red-700 rounded-md hover:text-gray-900 hover:bg-red-200 cursor-pointer transition duration-200"
                                  aria-hidden="true"
                                  onClick={() => {
                                    cleanUpNameSearch();
                                  }}
                                  title="Limpar Seleção"
                                />
                              ) : clientNameSearch.length >= 1 &&
                                filteredClients.length >= 1 ? (
                                <XMarkIcon
                                  className="relative right-8 top-4 -translate-y-1/2 w-6 h-6 text-black hover:text-gray-50 hover:bg-gray-950 rounded-md cursor-pointer transition duration-200"
                                  aria-hidden="true"
                                  title="Limpar Busca"
                                  onClick={() => {
                                    setclientNameSearch("");
                                  }}
                                />
                              ) : clientNameSearch.length >= 1 &&
                                filteredClients.length === 0 ? (
                                <>
                                  <div className="relative right-14 top-4 -translate-y-1/2 flex">
                                    <XMarkIcon
                                      //className="relative right-16 top-4 -translate-y-1/2 w-6 h-6 text-black hover:text-gray-50 hover:bg-gray-950 rounded-md cursor-pointer transition duration-200"
                                      className=" w-6 h-6 text-black hover:text-gray-50 hover:bg-gray-950 rounded-md cursor-pointer transition duration-200"
                                      aria-hidden="true"
                                      title="Limpar Buscaa"
                                      onClick={() => {
                                        setclientNameSearch("");
                                      }}
                                    />
                                    <PlusIcon
                                      //className="relative right-8 top-4 -translate-y-1/2 w-6 h-6 text-black hover:text-gray-50 hover:bg-gray-950 rounded-md cursor-pointer transition duration-200"
                                      className=" w-6 h-6 text-black hover:text-gray-50 hover:bg-gray-950 rounded-md cursor-pointer transition duration-200"
                                      aria-hidden="true"
                                      title="Nenhum Resultado Encontrado"
                                    />
                                  </div>
                                </>
                              ) : (
                                <PlusIcon
                                  className="relative right-8 top-4 -translate-y-1/2 w-6 h-6 text-black hover:text-gray-50 hover:bg-gray-950 rounded-md cursor-pointer transition duration-200"
                                  aria-hidden="true"
                                  onClick={() => {
                                    setModalNewClient(true);
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          {showDropdown && filteredClients.length > 0 && (
                            <ul className="absolute z-10 max-h-60 mt-1 w-1/4 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mouseover:bg-gray-900 mouseover:text-white">
                              {filteredClients.map((client) => (
                                <li
                                  key={client.clientId}
                                  className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900"
                                  onClick={() => {
                                    setClientIdForm(client.clientId);
                                    setclientNameSearch(
                                      client.name +
                                        (client?.lastname
                                          ? " " + client.lastname
                                          : "") +
                                        " ( ID: " +
                                        client.clientId +
                                        " )"
                                    );
                                    setShowDropdown(false);
                                  }}
                                >
                                  {client.name} {client.lastname}
                                </li>
                              ))}
                            </ul>
                          )}
                          {showDropdown &&
                            clientNameSearch.length >= 2 &&
                            filteredClients.length === 0 && (
                              <p className="text-gray-900 font-[2px] font-mono flex justify-center mt-4">
                                Use o botão + para criar um novo cliente...
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="cover-photo"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Fotos do produto
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-1">
                          <div className="text-center">
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer"
                            >
                              <PhotoIcon
                                className="mx-auto h-20 w-100 text-gray-300"
                                aria-hidden="true"
                              />
                            </label>
                            <div className="mt-4 flex text-sm/6 text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span className="text-gray-600">
                                  Faça o upload
                                </span>
                                <input
                                  type="file"
                                  name="file-upload"
                                  id="file-upload"
                                  className="sr-only"
                                  multiple={true}
                                  onChange={(e) => handleFile(e)}
                                />
                              </label>
                              <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs/5 text-gray-600">
                              PNG, JPG, GIF up to 10MB
                            </p>
                            {filesInit && (
                              <>
                                <div className="grid grid-cols-3 gap-1 mt-2">
                                  {filesInit.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex flex-col items-center"
                                    >
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-16 w-full object-contain rounded border"
                                      />
                                      <div className="image-name text-xs mt-2 break-all text-center">
                                        {file.name}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <small
                          className="text-gray-900 font-[2px] font-mono flex justify-center mt-4"
                          style={{ fontSize: "15px", marginBottom: "2px" }}
                        >
                          Fotos de como o equipamento foi entregue...
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex ml-2 mt-3 gap-2 justify-end">
                  <button
                    type="button"
                    className="text-sm/6 font-semibold text-white bg-red-500 py-2 px-4 rounded hover:bg-red-700 hover:scale-105 transition ease-in-out duration-300"
                    onClick={fechar}
                  >
                    Cancelar
                  </button>
                  {loadingPage ? (
                    <>
                      <button
                        type="submit"
                        className="text-sm/6 font-semibold text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700 hover:scale-105 transition ease-in-out duration-300 transition:all cursor-progress"
                        disabled
                      >
                        Criando...
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="text-sm/6 font-semibold text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition ease-in-out duration-300"
                      >
                        Criar
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}

            {modalNewClient && (
              <NewClient
                isOpen={modalNewClient}
                onClose={() => {
                  setModalNewClient(false);
                }}
              />
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default NewOs;
