import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import type {
  ClientDataUnique
} from "../../interfaces/ClientsInterface";
import { updateDataUser } from "../../slices/authSlice";
import { searchClientById } from "../../slices/clientesSlice";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";

type propsClientData = {
  clientId: number;
}

type PropsEditUser = {
  isOpen: boolean;
  onClose: () => void;
  // Specifics Variables
  clientData: propsClientData;
  permission?: number;
};

const ViewClient = (props: PropsEditUser) => {
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  // Store
  // const { /*user,*/ message: messageUser, error: errorUser } = useSelector((state: RootState) => state.auth);
  const { targetClient } = useSelector((state: RootState) => state.client);
  // useStates
  const [clientView, setClientView] = useState<ClientDataUnique>();
  //  const [statusNewPassword, setStatusNewPassword] = useState<boolean>(true);
  // const [anyChange, setAnyChange] = useState<string>('As modificações só terão efeito após salvar.');
  const [messagePage, setMessagePage] = useState<string>("");

  // UseEffects
  useEffect(() => {
    dispatch(searchClientById(props.clientData.clientId));
  }, [dispatch])

  useEffect(() => {
    if(targetClient){
      setClientView(targetClient);
    }
  }, [targetClient])

  console.log('targetClient: ', targetClient);

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
                <div className="title font-edu-titles-bold">Cliente</div>
              </div>
            </DialogTitle>
            {/* Formulário de edição do usuário! */}
            <form>
              <div className="flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold text-gray-800 my-6 font-edu-titles">
                  Dados pessoais
                </h1>
                <p className="text-gray-950 my-1 montserrat pb-5 text-justify">
                  Alterando os dados pessoais do usuário{" "}
                  {clientView?.name ?? ''}
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
                      />
                      <label
                        htmlFor="name"
                        className={`absolute left-1 "top-2"
                          text-gray-500 bg-amber-50 px-1 transition-all duration-300 pointer-events-none
                          peer-placeholder-show:top-2 peer-place holder-shown:text-base
                          peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                          text-sm
                        `}
                      >
                        Nome
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
                      />
                      <label
                        htmlFor="lastname"
                        className={`absolute left-1 top-2
                          text-gray-500 bg-amber-50 px-1 transition-all duration-300 pointer-events-none
                          peer-placeholder-show:top-2 peer-place holder-shown:text-base
                          peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                          text-sm
                        `}
                      >
                        Sobrenome
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
                      />
                      <label
                        htmlFor="email"
                        className={`absolute left-1 top-2
                          text-gray-500 bg-amber-50 px-1 transition-all duration-300 pointer-events-none
                          peer-placeholder-show:top-2 peer-place holder-shown:text-base
                          peer-focus:-top-4 peer-focus:text-sm peer-focus:text-blue-600
                          text-sm
                        `}
                      >
                        email
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
                      // value={
                      //   passwordHash.length >= 7 ? passwordHash : "Não resetada"
                      // }
                      // onChange={(e) => setPasswordHash(e.target.value)}
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
                      <button
                        type="button"
                        disabled={true}
                        className="mt-auto px-6 py-2 bg-green-600 text-gray-200 font-semibold rounded hover:bg-red-800 hover:scale-100 transition transform-cpu ease-in-out duration-300 cursor-progress"
                      >
                        Criando...
                      </button>
                    </label>
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
                              />
                              <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 "></div>
                              <span className="ms-3 text-sm font-medium text-blue-950 inline-flex items-center justify-center"></span>
                              <span className="text-gray-600">Ativo</span>
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
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                        >
                          <option value="0">Selecione um Cargo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Coluna 2: outros campos */}
                  <div className="flex items-center justify-center montserrat-bold">
                    {messagePage ? (
                      <>
                        {messagePage.includes("não tem permissão") ? (
                          <>
                            <p className="animate-pulse text-[1rem] text-gray-950 bg-red-200 rounded-4xl items-center justify-center px-10 py-3 shadow-sm hover:shadow-md hover:scale-110 hover:bg-red-600 hover:text-gray-950 transition-all duration-300 ease-in-out">
                              {messagePage}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="animate-bounce text-[1rem] text-gray-950 bg-green-200 rounded-4xl items-center justify-center px-10 py-3 shadow-sm hover:shadow-md hover:scale-110 hover:bg-green-300 hover:text-gray-950 transition-all duration-300 ease-in-out">
                              {messagePage}
                            </p>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500">
                          As modificações só terão efeito após serem{" "}
                          <span className="text-red-500">salvas</span>.
                        </span>
                      </>
                    )}
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
                    ) : (
                      <>
                        <button
                          type="submit"
                          disabled={
                            messagePage.includes("sucesso") ? true : false
                          }
                          className="mt-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-800 hover:scale-105 transition transform-cpu ease-in-out duration-300"
                        >
                          Salvar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </DialogPanel>
        </DialogBackdrop>
      </Dialog>
    </section>
  );
};

export default ViewClient;
