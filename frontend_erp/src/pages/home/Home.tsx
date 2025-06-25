import { useState, useEffect } from "react";

// Importando o tratamento do dispatch.
import { useSelector, useDispatch } from 'react-redux';
import { getAllClientCount } from '../../slices/clientesSlice';

// Importando o tratamento do dispath.
import type { AppDispatch, RootState } from '../../store';

// Importando interfaces



// Import de Pages
import Os from '../os/Os'; 

const Home = () => {
  // Variaveis
  const [countUsers, setCountUsers] = useState<number>(0);
  const [countOs, setCountOs] = useState<number | string>('Aguarde');

  // Funções
  const dispatch = useDispatch<AppDispatch>();
  const {
    count: countClients,
    // rows: clients
  } = useSelector((state: RootState) => state.client);

  // UseEffect

  useEffect(() => {
    dispatch(getAllClientCount())
  }, [dispatch]);

  // Tratando as variaveis após o evento.
  useEffect(() => {
    if(countClients) setCountUsers(countClients);
  }, [countClients])
  
  // Verificando a quantidade de Os após o carregamento do filho Os
  useEffect(() => {
    if(typeof countOs === 'number') setCountOs(countOs);
  }, [countOs])
  
  return (
    <section className='items-center justify-center px-40'>
      <div className="min-h-screen p-6 ">
        <h1 className="text-3xl mb-6 font-extralight">Dashboard - Visão Geral</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-gray-950">
          {/* Card de Clientes Cadastrados */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">Clientes Cadastrados</h2>
            <p className="text-2xl font-bold">{countUsers ? countUsers : 0}</p>
          </div>

          {/* Card de Usuários Cadastrados */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">Usuários Cadastrados</h2>
            <p className="text-2xl font-semibold">Sem dados</p>
          </div>

          {/* Card de Ordens de Serviço */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">Ordens de Serviço</h2>
            <p className="text-2xl font-bold">{countOs}</p>
          </div>
        </div>
        <Os setCountOs={setCountOs}/>
      </div>
    </section>
  );
};

export default Home;
