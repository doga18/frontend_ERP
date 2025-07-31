import React from 'react'

interface Props {
  title?: string;
  value?: string | number;
}

const DashboardCard = ({title, value}: Props) => {


  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transistion">
      <h2 className="text-lg font-medium text-gray-600">
        {title}
      </h2>
      <p className="text-3xl font-bold text-gray-800">
        {value}
      </p>
    </div>
  )
}

export default DashboardCard