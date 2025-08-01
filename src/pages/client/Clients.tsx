import { /*React,*/ useEffect, useState } from "react";

// Imports Icons
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { UserPlusIcon } from "@heroicons/react/24/solid";

// Importando as configurações de api
// import { uploads } from '../../utils/config'

// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Typography,
//   Button,
// } from "@material-tailwind/react";

// Imports about redux and slices
import { useSelector, useDispatch } from "react-redux";
import { getAllClientCount } from "../../slices/clientesSlice";

// Imports about interfaces
// import type { listAllClients, ClientDataUnique } from '../../interfaces/ClientsInterface';

// Imports trataments of dispatch
import type { AppDispatch, RootState } from "../../store";

// Import Pages
import NewClient from "./NewClient";

// hooks
import { useAuth } from "../../hooks/useAuthBACKUP";

const Clients = () => {
  // Instances and initilizations
  const dispatch = useDispatch<AppDispatch>();

  // UseStates
  //const [listClients, setListClients] = useState<ClientDataUnique[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [errorsPage, setErrorsPage] = useState<string[] | null>([""]);
  const [nameAtendente, setNameAtendente] = useState<string>("");

  // Modal controller
  const [modalNewClient, setModalNewClient] = useState<boolean>(false);
  const { user } = useAuth();

  // Functions
  // Build msg to WhatsApp
  const openWhatsApp = (
    numero: string,
    nomeAtendente: string,
    nameCliente: string
  ) => {
    const nomeAtendenteCapitalized =
      nomeAtendente.charAt(0).toUpperCase() + nomeAtendente.slice(1);
    const nomeClienteCapitalized =
      nameCliente.charAt(0).toUpperCase() + nameCliente.slice(1);
    const mensagem = `Olá, ${nomeClienteCapitalized}, tudo bem? \nSou da empresa IssueSolved, meu nome é ${nomeAtendenteCapitalized}! \nComo posso ajudar?`;
    const url = `https://api.whatsapp.com/send?phone=55${numero}&text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(url, "_blank");
  };
  const {
    count: countClients,
    rows: clientsRows,
    loading: clientsLoading,
    errors: clientsErrors,
  } = useSelector((state: RootState) => state.client);

  // UseEffect's
  useEffect(() => {
    if (countClients > 0) {
      // setListClients(clientsRows);
      setLoading(clientsLoading);
    }
    if (clientsErrors) {
      setErrorsPage(clientsErrors);
    }
  }, [countClients, clientsRows, clientsLoading, clientsErrors]);

  useEffect(() => {
    dispatch(getAllClientCount());
  }, [dispatch]);

  useEffect(() => {
    if (user?.name) {
      setNameAtendente(user.name);
    }
  }, [user]);

  console.log("clientsRows", clientsRows);

  return (
    <>
      <section className="mt-10">
        {loading ? (
          <div className="bg-amber-900 w-full min-h-screen p-3 flex flex-col">
            <div className="bg-white shadow-md rounded-lg p-4 text-gray-950 overflow-auto flex-1">
              <h2 className="text-xl font-semibold mb-4">Carregando...</h2>
            </div>
          </div>
        ) : (
          <div className="shadow-lg bg-transparent w-full min-h-screen p-3 flex flex-col">
            <div className="bg-white shadow-md rounded-lg p-4 text-gray-950 overflow-auto flex-1">
              <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 text-left">Nome</th>
                    <th className="py-2 px-4 text-left">Sobrenome</th>
                    <th className="py-2 px-4 text-left">Contato (whatsapp)</th>
                    <th className="py-2 px-4 text-left">Cidade</th>
                    <th className="py-2 px-4 text-left">Rua</th>
                    <th className="py-2 px-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {clientsRows &&
                    clientsRows.map((client) => (
                      <tr
                        key={client.clientId}
                        className="hover:bg-gray-200 cursor-pointer"
                      >
                        <td className="py-2 px-4 border-b">
                          <div className="flex flex-row items-center justify-center">
                            <span className="mr-2">{client.name}</span>
                            {/* {client.files && client.files.length > 0 && client.files[0].fileName ? (
                          <img
                            src={`${uploads}/${client.files[0].fileName}`}
                            alt={`Imagem do cliente de nome ${client.name}`}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <img
                            src={`${uploads}/default.png`}
                            alt="Imagem padrão"
                            className="w-8 h-8 rounded-full"
                          />
                        )} */}
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b">
                          {client.lastname ? client.lastname : "Não informado"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <div
                            className="inline-flex items-center cursor-pointer"
                            onClick={() =>
                              openWhatsApp(
                                client.contact,
                                nameAtendente,
                                client.name
                              )
                            }
                            title="Clique para enviar uma mensagem no whatsApp do cliente..."
                          >
                            <span className="mr-2">{client.contact}</span>
                            <SiWhatsapp size={20} color="#25D366" />
                          </div>
                        </td>
                        <td className="py-2 px-4 border-b">
                          {client.city ? client.city : "Nao informado"}
                        </td>
                        <td className="py-2 px-4 border-b">{client.email}</td>
                        <td className="py-2 px-4 border-b">
                          <a
                            href={`https://wa.me/${client.contact}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 decoration-none bg-green-700 hover:bg-green-400 hover:text-black hover:font-bold text-white font-semibold py-2 px-4 rounded transition-colors duration-500"
                            title="Enviar mensagem pelo WhatsApp"
                          >
                            <SiWhatsapp size={20} color="#fff" />
                            <span className="text-white">Contatar</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="new_client">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setModalNewClient(true)}
                >
                  Novo Cliente
                  <UserPlusIcon className="w-5 h-5 inline-block ml-2" />
                </button>
              </div>
              <div className="pagination flex gap-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  1
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  2
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  3
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  4
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  5
                </button>
              </div>
              <div className="search flex items-center">
                <input
                  type="text"
                  placeholder="Procurar cliente..."
                  className="border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
                />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r mx-4">
                  Procurar
                </button>
              </div>
            </div>
          </div>
        )}
        {errorsPage && <p>{errorsPage}</p>}
      </section>
      {modalNewClient && (
        <NewClient
          isOpen={modalNewClient}
          onClose={() => setModalNewClient(false)}
        />
      )}
    </>
  );
};

export default Clients;
