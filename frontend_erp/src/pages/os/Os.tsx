import React, { useState, useEffect} from 'react'

// importando icons
// import { BugAntIcon } from '@heroicons/react/24/outline';

// Importando funções úteis
import { formatDateTimeLocal } from '../../utils/config';

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

interface Props {
  setCountOs: (count: number) => void;
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
  const [selectedOs, setSelectedOs] = useState<OsDetailsInterface | null>(null);

  // Funções
  const dispatch = useDispatch<AppDispatch>();
  const {
    total: totalOs,
    totalPages: totalPagesOs,
    currentPage: currentPageOs,
    data: dataOs,
    loading: loadingOs,
    //termId: termIdOs
  } = useSelector((state: RootState) => state.os);

  // Controles da página:
  const handlePreviousPage = () => {
    if(currentPage > 1){
      setcurrentPage(currentPage - 1);
    }
  }
  const handlePageChange = (index: number) => {   
    console.log('Index é: ' + index);
    console.log('Total de páginas é: ' + totalPages);
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
  const handleSearch = () => {
  if (termSearch === '') {
    alert('Por favor, insira um termo de busca');
    return;
  }

  // Verifica se é numérico SEM converter o valor original
  const isNumeric = !isNaN(Number(termSearch)) && !isNaN(parseFloat(termSearch));

  if (isNumeric) {
    console.log('Termo de busca é um número (mas mantido como string), buscando por ID.');
    console.log('Tipo da variável:', typeof termSearch); // "string" (ex: '0001')
    searchById_number(termSearch); // Busca por ID (envia '0001' como string)
  } else {
    console.log('Termo de busca é texto, buscando por texto.');
    searchByText(termSearch); // Busca por texto (não precisa do .toString())
  }
};

  const searchById_number = (id: string) => {
    console.log('Id recebido para busca é: ' + id);
    dispatch(getOsById_number({ searchTerm: id }));
  }
  const searchByText = (text: string) => {
    console.log('Text recebido para busca é: ' + text);
    dispatch(getOsByArgumentsString({ searchTerm: text }));
  }

  // const searchByUUID = (uuid: string) => {
  //   console.log('UUID recebido para busca é: ' + uuid);
  //   dispatch(getOsById({ searchTerm: uuid }));
  // }

  // // Montando o Modal para exibir os detalhes da OS
  // const handleOsDetailsModal = (uuid: string) => {
  //   console.log('UUID recebido para exibir os detalhes da OS é: ' + uuid);
  // }

  // UseEffect
  useEffect(() => {
    dispatch(getAllOsWithLimitAndPage({ page: currentPage, limit: 5 }));
  }, [dispatch, currentPage])

  useEffect(() => {
    if(totalOs && dataOs){
      console.log("o total de os: " + totalOs);
      console.log("o total de páginas é de : " + totalPagesOs);
      setCountOs(totalOs);
      setTotal(totalOs);
      setTotalPages(totalPagesOs);
      setcurrentPage(currentPageOs);
      // Criando um Array mesmo quando for 1 objeto.      
      setAllOs(Array.isArray(dataOs) ? dataOs : [dataOs]);
    }
  }, [total, totalOs, totalPagesOs, currentPageOs, dataOs, setCountOs]);

  return (
    <div>
      {/* Seção de Pesquisa e Botão de Criar OS */}
        <div className="flex tems-center mb-6 justify-between gap-4 w-full">
          <div className="flex flex-1 w-1/2">
            <input
              type="text"
              placeholder="Pesquisar Ordens de Serviço..."
              className="border border-gray-300 rounded-lg p-2 w-1/2 flex"
              onChange={(e) => setTermSearch(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 mx-5 w-1/6"
              onClick={handleSearch}
            >
              Pesquisar
            </button>
          </div>
          <button className="bg-blue-500 text-white rounded-lg px-4 py-2 ml-4 hover:bg-blue-600">
            Criar Nova OS
          </button>
        </div>

        {/* Tabela de Ordens de Serviço */}
        {loadingOs && allOs && allOs?.length >= 0 ? (
          <div className="flex justify-center items-center h-[30rem] rounded-2xl bg-gray-800">
            <div className="flex flex-col justify-center items-center h-[10rem] w-[32rem] bg-amber-100 rounded-2xl shadow-xl">
              <div className="font-semibold text-white bg-gray-700 p-2 shadow-xl rounded mb-10 text-shadow-lg mx-10">
                Carregando, aguarde...
              </div>
              <div className="animate-spin rounded-full h-10 w-10 border-t-15 border-b-15 text-indigo-800"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg p-4 text-gray-950 overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Lista de Ordens de Serviço</h2>
              <table className="min-w-full ">
                <thead>
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
                    <th className="py-2 px-4 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody className='bg-gray-100'>
                  {allOs && allOs.length > 0 ? (
                    allOs.map((os, index) => (
                      // Criando um link para poder analisar a OS detalhadamente
                      <tr key={index} className='items-center align-middle'>
                        <td className="py-2 px-4 border-b" title={`UUID: ${os.osId}`}>{os.os_number}</td>
                        <td className="py-2 px-4 border-b">
                          {os.title.split(' ').slice(0, 3).join(' ')}...
                        </td>
                        <td className="py-2 px-4 border-b">
                          {os.description.split(' ').slice(0, 3).join(' ')}...
                        </td>
                        <td className="py-2 px-4 border-b" title={os.status}>{os.status.split(' ').slice(0, 1).join(' ')}...</td>
                        <td className="py-2 px-4 border-b">{os.priority}</td>
                        <td className="py-2 px-4 border-b">{os.clientAssigned?.name || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">R$: {os.budget}</td>
                        <td className="py-2 px-4 border-b">
                          <input type="datetime-local" value={formatDateTimeLocal(os.createdAt)} disabled />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input type="datetime-local" value={formatDateTimeLocal(os.updatedAt)} disabled />
                        </td>
                        <td className="py-3 border-b flex">
                          <button
                            className="text-white  hover:underline ml-2"
                            onClick={() => {
                              setSelectedOs(os);
                              setModalOsDetails(true);
                            }}
                            >
                            Editar
                          </button>
                          <button className="text-red-500 hover:underline ml-2">Excluir</button>
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
                </tbody>            
              </table>
            </div>
            <div className="flex justify-center items-center mt-4">
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50'
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
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages} // Desabilita se estiver na última página
                  >
                  Próxima
                </button>
            </div>
          </>
        )}
        
    </div>
  )
}

export default Os