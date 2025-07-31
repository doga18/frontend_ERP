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
// import {
//   newOs
// } from '../../slices/osSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NewOs = ({ isOpen, onClose }: Props) => {
  // Instanciando variáveis
  const dispatch = useDispatch<AppDispatch>();
  const { rows: rowsClients, loading: loadingSearch } = useSelector(
    (state: RootState) => state.client
  );
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

  // Funções
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
    // Aidicioando os arquivos ao formData, se for informado...
    if(filesInit.length > 0){
      filesInit.forEach((file) => {
        formData.append("images", file);
      })
    }
    // Mostando o formadata montado!
    console.log('Dados do form: ');
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
    dispatch(getAllClientCount());
  }, [dispatch]);

  useEffect(() => {
    if (rowsClients) setclientDataForm(rowsClients);
  }, [rowsClients]);

  useEffect(() => {
    if (clientNameSearch.length >= 2) {
      const filtered = clientDataForm.filter((client) => {
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
    if(loadingSearch){
      setLoadingPage(true);
    }else{
      setLoadingPage(false);
    }
  }, [loadingSearch])
  

  return (
    <>
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
                <div className="flex items-center justify-center">
                  <p className="text-gray-900">Buscando clientes...</p>
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
                            <option value="open">Aberta</option>
                            <option value="closed">Fechada</option>
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
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                            <option value="urgente">Urgente</option>
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
                                if (e.target.value.length >= 1) {
                                  setclientNameSearch(e.target.value);
                                }
                              }}
                              onFocus={() => setShowDropdown(true)}
                            ></input>
                            {clientIdForm && (
                              <XMarkIcon
                                className="relative right-15 top-5 -translate-y-1/2 w-6 h-6 text-red-700 rounded-md hover:text-gray-900 hover:bg-red-200 transition cursor-pointer"
                                aria-hidden="true"
                                onClick={() => {
                                  cleanUpNameSearch();
                                }}
                                title="Limpar Seleção"
                              />
                            )}
                            <PlusIcon
                              className="relative right-10 top-4 -translate-y-1/2 w-6 h-6 text-black cursor-pointer"
                              aria-hidden="true"
                              onClick={() => {
                                setModalNewClient(true);
                              }}
                            />
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
                                Não existe cliente com o nome buscado, clique no
                                + para criar um novo cliente...
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
                    onClick={onClose}
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
