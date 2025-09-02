import /* React, */ { useState, useEffect} from 'react'
//import { Tooltip } from '@headlessui/react'

// importando icons
// import { BugAntIcon } from '@heroicons/react/24/outline';

// Importando funções úteis
// import { formatDateTimeLocal } from '../../utils/config';

// Importando o tratamento do dispath.
import { useSelector, useDispatch } from 'react-redux';
import { 
  getAllOsWithLimitAndPage,
  getOsById_number,
  /*getOsById,*/
  getOsByArgumentsString,
  //updateOsDetails
} from '../../slices/osSlice';

// Importando o tratamento do dispath.
import type { AppDispatch, RootState } from '../../store';

// Importando interfaces
import type { OsDetailsInterface } from '../../interfaces/OsDetailsInterface';

// Pages
import OsDetails from './OsDetails';
import NewOs from './NewOs';
import Message from '../../components/Message';
// import ViewClient from '../client/ViewClient';

interface Props {
  setCountOs?: (count: number) => void;
}

const Os = ({ setCountOs } : Props) => {
  // Variáveis de Estado e Funções
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [allOs, setAllOs] = useState<OsDetailsInterface[] | undefined>([]);
  // Search
  const [termSearch, setTermSearch] = useState<string>('');
  // Modal control
  const [modalOsDetails, setModalOsDetails] = useState<boolean>(false)
  const [modalOsNew, setModalOsNew] = useState<boolean>(false)
  //const [modalViewClient, setModalViewClient] = useState<boolean>(false)
  const [selectedOs, setSelectedOs] = useState<OsDetailsInterface | null>(null);
  //const [hoveredClientId, setHoveredClientId] = useState<number | null>(null);
  // Página
  const [pageMessage, setPageMessage] = useState<string>("")

  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const {
    total: totalOs,
    totalPages: totalPagesOs,
    currentPage: currentPageOs,
    data: dataOs,
    loading: loadingOs,
    //termId: termIdOs
  } = useSelector((state: RootState) => state.os);
  // Funçãoes
  // const constructTitleLink = (clientId: number) => (
  //   <div className="abosolute bg-white p-2 border border-gray-300 rounded shadow-lg z-15">
  //     <span className="text-indigo-600">Clique para ver detalhes do cliente #{clientId}</span>
  //   </div>
  // );
  // Controles da página:
  const handlePreviousPage = () => {
    if(currentPage > 1){
      setcurrentPage(currentPage - 1);
    }
  }
  const handlePageChange = (index: number) => {   
    if(index <= totalPages){
      setcurrentPage(index);
    }
  }
  const handleNextPage = () => {
    if(currentPage < totalPages){
      setcurrentPage(currentPage + 1);
    }
  }
  // Controles de pesquisa
  const searchFactory = (term: string) => {
    const isNumeric  = !isNaN(Number(term));
    return isNumeric ? searchById_number(term) : searchByText(term);
  }
  const handleSearch = () => {
    if(!termSearch) return alert('Por favor, insira um termo de busca');
    searchFactory(termSearch);
};

  const searchById_number = (id: string) => {
    //console.log('Id recebido para busca é: ' + id);
    dispatch(getOsById_number({ searchTerm: id }));
  }
  const searchByText = (text: string) => {
    //console.log('Text recebido para busca é: ' + text);
    dispatch(getOsByArgumentsString({ searchTerm: text }));
  }
  useEffect(() => {
    dispatch(getAllOsWithLimitAndPage({ page: currentPage, limit: 15 }));
  }, [dispatch, currentPage])

  useEffect(() => {
    if(totalOs && dataOs){
      //console.log("o total de os: " + totalOs);
      //console.log("o total de páginas é de : " + totalPagesOs);
      setCountOs?.(totalOs);
      setTotal(totalOs);
      setTotalPages(totalPagesOs);
      setcurrentPage(currentPageOs);
      // Criando um Array mesmo quando for 1 objeto.      
      setAllOs(Array.isArray(dataOs) ? dataOs : [dataOs]);
    }
  }, [total, dataOs]);

  useEffect(() => {
    if(pageMessage.length > 5){
      setTimeout(() => {
        setPageMessage('');
      }, 6000);
    }
  }, [pageMessage])

  //console.log('Os: ', allOs);

  return (
    <div className='mt-6 px-5 '>
      {/* Seção de Pesquisa e Botão de Criar OS */}
      {pageMessage && pageMessage.length > 3 && (
        <Message msg={pageMessage} type={`${pageMessage.includes('sucess') ? 'success' : 'error'}`} duration={5000} />
      )}
        <div className="flex tems-center mb-6 justify-between gap-4 w-full">
          <div className="flex flex-1 w-1/2">
            <input
              type="text"
              placeholder="Pesquisar Ordens de Serviço..."
              className="border border-gray-300 rounded-lg p-2 w-1/2 flex text-gray-900 bg-amber-50 font-[18px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setTermSearch(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 mx-5 w-1/6"
              onClick={handleSearch}
            >
              Pesquisar
            </button>
          </div>
          <button className="bg-blue-500 text-white rounded-lg px-4 py-2 ml-4 hover:bg-blue-600"
            onClick={() => {
              setModalOsNew(true)

            }}>
            Criar Nova OS
          </button>
        </div>

        {/* Tabela de Ordens de Serviço */}
        {loadingOs && allOs && allOs?.length >= 0 ? (
          <div className="flex justify-center items-center h-[30rem] rounded-2xl bg-gray-800 min-h-screen">
            <div className="flex flex-col justify-center items-center h-[10rem] w-[32rem] bg-amber-100 rounded-2xl shadow-xl">
              <div className="font-semibold text-white bg-gray-700 p-2 shadow-xl rounded mb-10 text-shadow-lg mx-10">
                Carregando, aguarde...
              </div>
              <div className="animate-spin rounded-full h-10 w-10 border-t-15 border-b-15 text-indigo-800"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg p-4 text-gray-950 overflow-auto min-h-screen">
              <h2 className="text-xl font-semibold mb-4 text-indigo-700">Lista de Ordens de Serviço</h2>
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 text-left">OS</th>
                    <th className="py-2 px-4 text-left">Título</th>
                    <th className="py-2 px-4 text-left">Descrição</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Prioridade</th>
                    <th className="py-2 px-4 text-left">Cliente</th>
                    <th className="py-2 px-4 text-left">Orçamento</th>
                    <th className="py-2 px-4 text-left">Abertura</th>
                    <th className="py-2 px-4 text-left">Última Atualização</th>
                  </tr>
                </thead>

                <tbody>
                  {allOs && allOs.length > 0 ? (
                    allOs.map((os, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0 ? "bg-indigo-50" : "bg-white"} hover:bg-indigo-100 transition cursor-pointer`}
                        onClick={() => {
                          setSelectedOs(os);
                          setModalOsDetails(true);
                        }} 
                      >
                        <td className="py-2 px-4 text-left">{os.os_number}</td>
                        <td className="py-2 px-4 text-left" title={`${os.title}`}>
                          {os.title.split(' ').slice(0, 2).join(' ')}...
                        </td>
                        <td className="py-2 px-4 text-left" title={`${os.description}`}>
                          {os.description.split(' ').slice(0, 3).join(' ')}...
                        </td>
                        <td className="py-2 px-4 text-left" title={os.status}>{os.status.split(' ')[0]}...</td>
                        <td className="py-2 px-4 text-left">{os.priority}</td>
                        <td className="py-2 px-4 text-left relative group">
                          <span className="">
                            {os.client ? os.client.name : 'N/A'}
                          </span>
                          {os.client && os.client.clientId && (
                            <div className="absolute hover:animate-none left-1/2 -translate-x-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                              Detalhes do cliente
                              {/* Seta do tooltip */}
                              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-gray-800 border-l-transparent border-r-transparent"></div>
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-4">R$: {os.budget}</td>
                        <td className="py-2 px-4">
                          {new Date(os.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-2 px-4 text-center ">
                          {new Date(os.updatedAt).toLocaleDateString("pt-BR") + ' ' + new Date(os.updatedAt).toLocaleTimeString("pt-BR")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-4 text-gray-500">
                        Nenhuma Ordem de Serviço encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center mt-4 text-[24px] font-extralight">
              <button
                className='bg-blue-500  text-gray-200 mx-2 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-75'
                onClick={handlePreviousPage}
                disabled={currentPage === 1} // Desabilita se estiver na primeira página
                >
                  Anterior
              </button>
                <div className="flex space-x-2 ">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      onClick={() => handlePageChange(index + 1)} // Função para mudar a página
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  className="bg-blue-500 mx-2 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages} // Desabilita se estiver na última página
                  >
                  Próxima
                </button>
            </div>
            {selectedOs && (
                    <OsDetails
                      os={selectedOs}
                      isOpen={modalOsDetails}
                      onClose={() => {
                        setModalOsDetails(false);
                        dispatch(getAllOsWithLimitAndPage({ page: currentPage, limit: 10 }));
                      }}
                    />
                  )}
            {modalOsNew && <NewOs isOpen={modalOsNew} onClose={() => {
              setModalOsNew(false)
            }} notify={(msg: string) => setPageMessage(msg)} />}
          </>
        )}
        
    </div>
  )
}

export default Os