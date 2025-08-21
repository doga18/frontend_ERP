import { /*React,*/ useEffect, useState } from "react";

// Imports Icons
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { UserPlusIcon, PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/solid";

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
import EditClient from "./EditClient";

// hooks
import { useAuth } from "../../hooks/useAuth";

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
  const [modalEditClient, setModalEditClient] = useState<boolean>(false);
  const [ClientSelected, setClientSelected] = useState<number | null>(null);

  // Page Controle
  const [totalPageComponent, setTotalPageComponent] = useState<number>(0);
  const [currentPageComponent, setCurrentPageComponent] = useState<number>(1);
  const [clientPerPage, setClientPerPage] = useState<number>(10);
  const [totalClientsCount, setTotalClientsCount] = useState<number>(0);

  // Redux
  const { user } = useAuth();

  // Functions
  // const mountTitleEstilized = (image: string) => {
  //   return (
  //     <div className="flex items-center">
  //       <figure className="max-w-lg">
  //         <img className="h-auto max-w-full rounded-lg" src={image} alt=""/>
  //         <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">Image caption</figcaption>
  //       </figure>
  //     </div>
  //   )
  // }
  const handleNextPage = () => {
    if (currentPageComponent < totalPageComponent) {
      setCurrentPageComponent(currentPageComponent + 1);
    }
  };
  const handlePageChange = (index: number) => {
    console.log("Recebido é: " + index);
    if (index <= totalPageComponent) {
      setCurrentPageComponent(index);
    }
  };
  const handlePreviousPage = () => {
    console.log('Tentando voltar a página...')
    if (currentPageComponent > 1) {
      setCurrentPageComponent(currentPageComponent - 1);
    }
  };
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
    total: countClients,
    totalPages,
    rows: clientsRows,
    loading: clientsLoading,
    errors: clientsErrors,
  } = useSelector((state: RootState) => state.client);

  // UseEffect's
  useEffect(() => {
    if (countClients > 0) {
      // setListClients(clientsRows);
      setLoading(clientsLoading);
      setTotalClientsCount(countClients);
      setTotalPageComponent(Number(totalPages));
    }
    if (clientsErrors) {
      setErrorsPage(clientsErrors);
    }
  }, [
    countClients,
    clientsRows,
    clientsLoading,
    clientsErrors,
    totalPages
  ]);

  useEffect(() => {
    dispatch(
      getAllClientCount({ limit: clientPerPage, page: currentPageComponent })
    );
  }, [dispatch, currentPageComponent, clientPerPage]);

  useEffect(() => {
    if (user?.name) {
      setNameAtendente(user.name);
    }
  }, [user]);

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
          <div className="shadow-lg bg-transparent w-full p-3 flex flex-col min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-4 text-gray-950 overflow-auto flex-1">
              <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
              <table className="w-full text-sm text-left rtl:text-right text-gray-900">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr className="bg-gray-200">
                    <th className="py-3 px-6 text-left rounded-s-lg">Nome</th>
                    <th className="py-2 px-4 text-left">Sobrenome</th>
                    <th className="py-2 px-4 text-left" title='Contato Telefônico'>Whatsapp</th>
                    <th className="py-2 px-4 text-left">Cidade</th>
                    <th className="py-2 px-4 text-left">Rua</th>
                    <th className="py-2 px-4 text-center">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {clientsRows &&
                    clientsRows.map((client, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out"
                        onClick={() => {
                          console.log("Cliente selecionado:", client);
                        }}
                        onMouseOver={() => {
                          setClientSelected(Number(client.clientId));
                        }}
                        title={`Id do cliente: ${client.clientId}`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-3 font-medium text-gray-600 whitespace-nowrap"
                        >
                          {client.name ? client.name : "Não informado"}
                        </th>
                        <td className="py-2 px-4">
                          {client.lastname ? client.lastname : "Não informado"}
                        </td>
                        <td className="py-2 px-4">
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
                            <div className="flex justify-between items-center">
                              <span className="mr-2">{client.contact}</span>
                              <SiWhatsapp size={20} color="#25D366" />
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          {client.city ? client.city : "Nao informado"}
                        </td>
                        <td className="py-2 px-4">{client.email}</td>
                        <td className="py-2 px-4">
                          <div className="flex justify-center align-center">
                            <button
                              onClick={() => {
                                setModalEditClient(true);
                              }}
                              className="mr-2 flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                              >
                              <PencilSquareIcon className='w-5 h-5 mr-1 '/>Editar
                            </button>
                            <div className="group-btn">
                              <button className="mr-2 bg-red-400 flex items-center hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                <XCircleIcon className="w-5 h-5 mr-1 text-red-100 group-hover:text-white" />
                                Excluir
                              </button>
                            </div>
                          </div>
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
              <div className="flex justify-start">
                <div className="inline-flex items-center justify-center">
                  <div className="span">
                    <span className="text-gray-600 pr-2">
                      Clientes por Página:
                    </span>
                  </div>
                  <select
                    name="clientPerPage"
                    id="clientPerPage"
                    className="ml-2 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={clientPerPage}
                    onChange={(e) => setClientPerPage(Number(e.target.value))}
                    title="Selecione a quantidade de clientes por página"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={totalClientsCount ? totalClientsCount : 999}>
                      Total: {totalClientsCount ? totalClientsCount : 0}
                    </option>
                  </select>
                </div>
                <div className="ms-2 inline-flex items-center justify-center">
                  <span className="text-sm">
                    Página {currentPageComponent} de {totalPageComponent}
                  </span>
                </div>
              </div>
              <div className="pagination flex gap-2">
                <button
                  className="bg-blue-500  text-gray-200 mx-2 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-75"
                  onClick={() => {
                    handlePreviousPage();
                    console.log("Clicou em anterior");
                  }}
                  disabled={currentPageComponent === 1} // Desabilita se estiver na primeira página
                >
                  Anterior
                </button>
                <div className="flex space-x-2 ">
                  {Array.from({ length: totalPageComponent }, (_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded ${
                        currentPageComponent === index + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => handlePageChange(index + 1)} // Função para mudar a página
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="bg-blue-500 mx-2 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  onClick={handleNextPage}
                  disabled={currentPageComponent === totalPageComponent} // Desabilita se estiver na última página
                >
                  Próxima
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
      {modalEditClient && (
        <EditClient
          isOpen={modalEditClient}
          onClose={() => (setModalEditClient(false), setClientSelected(null))}
          clientId={ClientSelected}
        />
      )}
    </>
  );
};

export default Clients;
