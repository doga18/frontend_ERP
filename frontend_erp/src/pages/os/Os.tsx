import React, { useState, useEffect} from 'react'

// Importando o tratamento do dispath.
import { useSelector, useDispatch } from 'react-redux';
import { getAllOs } from '../../slices/osSlice';

// Importando o tratamento do dispath.
import type { AppDispatch, RootState } from '../../store';

// Importando interfaces
import type { OsDetailsInterface } from '../../interfaces/OsDetailsInterface';

interface Props {
  setCountOs: (count: number) => void;
}

const Os = ({ setCountOs } : Props) => {
  // Variáveis de Estado e Funções
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setcurrentPage] = useState<number>(0)
  const [allOs, setAllOs] = useState<OsDetailsInterface[] | undefined>([]);

  // Funções
  const dispatch = useDispatch<AppDispatch>();
  const {
    total: totalOs,
    totalPages: totalPagesOs,
    currentPage: currentPageOs,
    data: dataOs
  } = useSelector((state: RootState) => state.os);

  // UseEffect
  useEffect(() => {
    // Disparando a ação de listagem de OS.
    dispatch(getAllOs());
  }, [dispatch]);
  useEffect(() => {
    if(totalOs && dataOs){
      setCountOs(totalOs);
      setTotal(totalOs);
      setTotalPages(totalPagesOs);
      setcurrentPage(currentPageOs);
      setAllOs(dataOs);
    }
  }, [totalOs, totalPagesOs, currentPageOs, dataOs, setCountOs]);

  return (
    <div>
      {/* Seção de Pesquisa e Botão de Criar OS */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Pesquisar Ordens de Serviço..."
            className="border border-gray-300 rounded-lg p-2 w-1/2"
          />
          <button className="bg-blue-500 text-white rounded-lg px-4 py-2 ml-4 hover:bg-blue-600">
            Criar Nova OS
          </button>
        </div>

        {/* Tabela de Ordens de Serviço */}
        <div className="bg-white shadow-md rounded-lg p-4 text-gray-950">
          <h2 className="text-xl font-semibold mb-4">Lista de Ordens de Serviço</h2>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">OS</th>
                <th className="py-2 px-4 text-left">Título</th>
                <th className="py-2 px-4 text-left">Descrição</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Prioridade</th>
                <th className="py-2 px-4 text-left">Em nome de</th>
                <th className="py-2 px-4 text-left">Orçamento</th>
                <th className="py-2 px-4 text-left">Data de Abertura</th>
                <th className="py-2 px-4 text-left">Última Atualização</th>
                <th className="py-2 px-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Exemplo de dados, você pode substituir por dados reais */}
              {allOs && allOs.length > 1 ? allOs.map((os, index) => (
                <tr key={index} className='items-center align-middle'>
                  <td className="py-2 px-4 border-b" title={`UUID: ${os.osId}`}>{os.os_number}</td>
                  <td className="py-2 px-4 border-b">{os.title}</td>
                  <td className="py-2 px-4 border-b">{os.description}</td>
                  <td className="py-2 px-4 border-b">{os.status}</td>
                  <td className="py-2 px-4 border-b">{os.priority}</td>
                  <td className="py-2 px-4 border-b">{os.user.name}</td>
                  <td className="py-2 px-4 border-b">{os.budget}</td>
                  <td className="py-2 px-4 border-b">{os.createdAt}</td>
                  <td className="py-2 px-4 border-b">{os.updatedAt}</td>
                  <td className="py-3 border-b flex">
                    <button className="btn-primary text-blue-500 hover:underline">Editar</button>
                    <button className="text-red-500 hover:underline ml-2">Excluir</button>
                  </td>
                </tr>
              )) : (<tr><td colSpan={4}>Nenhuma OS encontrada</td></tr>)}
            </tbody>            
          </table>
        </div>
        <div className="flex">
          <div className="bg-amber-600 w-20 flex">
            1
          </div>
          <div className="bg-cyan-500  flex-auto">
            Números da página
          </div>
          <div className="bg-green-400 flex">
            Final da página
          </div>
        </div>
    </div>
  )
}

export default Os