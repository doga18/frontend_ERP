import { useState, useEffect } from "react";

// Importando o tratamento do dispatch.
import { useSelector, useDispatch } from 'react-redux';
import { getAllClientCount } from '../../slices/clientesSlice';
import { getAllOs } from '../../slices/osSlice';
import { getDataResume, getResumeUsers } from '../../slices/dataResumeSlice';

// Importando o tratamento do dispath.
import type { AppDispatch, RootState } from '../../store';
import type { resumeStatusResponse } from '../../interfaces/summaryInterface';

// Importando Recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Rectangle, ResponsiveContainer/*, CartesianGrid*/ } from 'recharts';

// Import de Pages
// import Os from '../os/Os';
// import Clients from "../client/Clients";
import DashboardCard from '../Dashboard/DashboardCard';
import GraphicPizza from '../Recharts/GraphicPizza';

const Home = () => {
  // Verificando os dados das Os para criação dos gráficos

const data2 = [
  { name: 'Televisores', notReady: 5, ready: 2 },
  { name: 'Módulos', notReady: 2, ready: 6 },
  { name: 'Microoondas', notReady: 7, ready: 42 },
];

// const data3 = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];
const quickOsList = [
  { title: 'OS 0023', status: 'Aberta', notified: true },
  { title: 'OS 0024', status: 'Finalizada', notified: false },
  { title: 'OS 0025', status: 'Cancelada', notified: false },
  { title: 'OS 0026', status: 'Aberta', notified: true },
  { title: 'OS 0027', status: 'Aberta', notified: true },
  { title: 'OS 0028', status: 'Aberta', notified: true },
];

interface resumeStatus {
  name: string;
  value: number
  status?: string
  count?: number
  index?: number
}

  // Variaveis
  const [countClients, setCountClients] = useState<number | string>("Aguarde");
  const [countUsers, setCountUsers] = useState<number | string>("Aguarde");
  const [countOs, setCountOs] = useState<number | string>('Aguarde');
  // Criando um dicionário para casar a chave com o valor.
  const [resumeByStatus, setResumeByStatus] = useState<resumeStatus[]>([]);
  const [listColors, setlistColors] = useState<string[]>([])

  // Funções
  const dispatch = useDispatch<AppDispatch>();
  // Criando cores dos gráficos dinamicamente
  const generateColores = (count: number) => {
    const colors: string[] = [];
    const saturation = 70;
    const lightness = 50;
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${i * 360 / count}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }
  // Selectors
    const {
      dataResume,
      dataResume1,
      error,
      message,
      loading,
    } = useSelector((state: RootState) => state.summaryResume);
  // Detalhadamento de clientes
  const {
    count: countClientsResponse,
    // loading: loadingClients,
    // rows: clients
  } = useSelector((state: RootState) => state.client);
  // Detalhamento de Os.
  const {
    total: totalOs,
    // loading: loadingOs,
    // rows: os
  } = useSelector((state: RootState) => state.os);

  // UseEffect
  useEffect(() => {
    dispatch(getAllClientCount())
    dispatch(getDataResume());
    dispatch(getAllOs());
    dispatch(getDataResume());
    dispatch(getResumeUsers());
  }, [])

  // Tratando as variaveis após o evento.
  useEffect(() => {
    if(countClientsResponse) setCountClients(countClientsResponse);
  }, [countClientsResponse])

  // Verificando a quantidade de Os após o carregamento do filho Os
  useEffect(() => {
    if(totalOs > 0) setCountOs(totalOs);
  }, [totalOs])

  useEffect(() => {
    if (!loading && dataResume) {
      // Criando as cores com base na quantidade de status
      const colors = generateColores(dataResume.data.length)
      setlistColors(colors);
      // console.log('Cores geradas', colors);
      const mappedData = (dataResume.data as resumeStatusResponse[]).map((item) => ({
        name: item.status ?? '',
        value: Number(item.count),
      }))
      setResumeByStatus(mappedData);
    }
    if(!loading && dataResume1) {
      // console.log('Dados dos usuários', dataResume1);
      const count = dataResume1.count;
      setCountUsers(count);
    }
}, [loading, error, message, dataResume, dataResume1]);


  console.log(resumeByStatus)
  // console.log(data);

  return (
    <section className='items-center justify-center px-4'>
      <div className="min-h-screen w-full ">
        <h1 className="text-3xl mb-6 font-extralight">Dashboard - Visão Geral</h1>
        <section id="visionSystem">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <DashboardCard title="Clientes Cadastrados" value={countClients ? countClients : 0} />
            <DashboardCard title="Usuários Cadastrados" value={countUsers ? countUsers : 0} />
            <DashboardCard title="Ordens de Serviço" value={countOs ? countOs : 0} />
          </div>
        </section>
        <section id="recharts pizza BarChart" className='mb-3'>
          <div className="grid grid-cols-1 md:grid-cols-2 text-center items-center justify-center gap-6">

            <div className="bg-cyan-50 rounded-2xl shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Distribuição de OSs</h3>
              <GraphicPizza resumeByStatus={resumeByStatus} listColors={listColors} />
            </div>

            <div className="bg-cyan-50 rounded-2xl shadow-md p-4 ">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Equipamentos mais atendidos e status</h3>
              <ResponsiveContainer
                width={"100%"}
                height={460}
              >
                <BarChart
                  data={data2}
                  margin={{
                    top: 10,
                    right: 5,
                    left: 5,
                    bottom: 10,
                  }}
                  barSize={50}
                  barGap={10}
                  >
                  <XAxis dataKey="name" />
                  <YAxis dataKey="ready" allowDecimals={false}/>
                  <Legend 
                    display='status'
                  />
                  <Tooltip />
                  <Bar
                    dataKey="notReady"
                    //key={}
                    activeBar={<Rectangle fill="red" stroke='pink' />}
                    stroke={listColors[15]}
                    fill={listColors[14]} />
                  <Bar
                    dataKey="ready"
                    //key={}
                    activeBar={<Rectangle fill="green" stroke='gold' />}
                    stroke={listColors[5]}
                    fill={listColors[6]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>        
        <section id="graphic" className='mb-3'>
          
        </section>
        <section id="notify">
          <div className="bg-amber-700 rounded-2xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Últimas OSs</h3>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2">Título</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Notificado</th>
                </tr>
              </thead>
              <tbody>
                {quickOsList.map((os, index) => (
                  <tr key={index}>
                    <td className="py-1">{os.title}</td>
                    <td className="py-1 text-sm">{os.status}</td>
                    <td className="py-1 text-sm">
                      {os.notified ? (
                        <span className="text-green-600 font-medium">Sim</span>
                      ) : (
                        <span className="text-red-600 font-medium">Não</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* <section id="ordensService">
          <Os setCountOs={setCountOs}/>
        </section>
        <section id="clients">
          <Clients />
        </section> */}
        
      </div>
    </section>
  );
};

export default Home;
