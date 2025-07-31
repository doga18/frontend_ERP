// Importando Recharts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, /*BarChart, Bar, XAxis, YAxis,*/ } from 'recharts';

interface Data {
  name: string;
  value: number;
}

interface Props {
  resumeByStatus: Data[];
  listColors: string[];
}

const GraphicPizza = ({ resumeByStatus, listColors }: Props) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={460}>
        <PieChart width={450} height={450} className="mb-2">
          <Pie
            data={resumeByStatus}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {resumeByStatus.map((_, index) => (
              <Cell
                key={`cell-${resumeByStatus.length - index}`}
                fill={listColors[index % listColors.length]}
                stroke={listColors[index % listColors.length]}
                className={'cursor-pointer hover:scale-x-99 transition ease-in-out duration-300'}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphicPizza;
