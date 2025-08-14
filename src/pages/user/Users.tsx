import React, { useEffect, useState } from 'react'
// Redux
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { getAllUsersAndCount } from '../../slices/authSlice';
// Importando interfaces
import type { userDataList } from '../../interfaces/AuthUserInterface';
// Importando a formação de data
import { formatDateTimeLocal } from '../../utils/config'
import { uploads } from '../../utils/config'

import imageNotFound from '/images/userNotFound.jpg'

const Users = () => {
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const { usersList, totalUsers } = useSelector((state: RootState) => state.auth);
  
  // UseStates
  const [pageListUsers, setPageListUsers] = useState<userDataList[]>([]);
  // Funções

  // UseEffects
  useEffect(() => {
    if(totalUsers > 0 && usersList !== null){ 
      setPageListUsers(usersList);
    }
  }, [usersList, totalUsers])

  useEffect(() => {
    dispatch(getAllUsersAndCount());
  }, [dispatch])


  return (
    <section id='users'>
      <h1>Usuários do sistema</h1>
      <div className="bg-white mb-6 rounded-2xl relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-col flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <div className="">
            <button type="button" id='dropdownActionButton' className='inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
              <span className="sr-only">
                Ação
              </span>
              <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>
            <div id="dropdownAction" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reward</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Promote</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Activate account</a>
                    </li>
                </ul>
                <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete User</a>
                </div>
            </div>
          </div>
          <label htmlFor="table-search" className="sr-only">
            Pesquisar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="text" name="table-search-users" id="table-search-users"
              className='block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder="Pesquisar..."
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className='text-xs text-gray-700 uppercase bg-gray-200 border-1 border-gray-300 hover:bg-gray-300 transition duration-300 '>
            <tr>
              <th className="p-4" scope={`col`}>
                <div className="flex items-center">
                  <input type="checkbox" name="checkbox-all-search" id="checkbox-all-search" className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 ' />
                </div>
              </th>
              <th className="p-4" scope={`col`}>
                Email
              </th>
              <th className="p-4" scope={`col`}>
                Tipo de conta
              </th>
              <th className="p-4" scope={`col`}>
                Status
              </th>
              <th className="p-4" scope={`col`}>
                Data de cadastro
              </th>
              <th className="p-4" scope={`col`}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {pageListUsers && pageListUsers.map((user) => (
              <>
                <tr className='bg-white border-b border-gray-200 hover:bg-gray-200 transition duration-300  cursor-pointer'>
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name={`checkbox-table-search-${user.userId}`}
                        id={`checkbox-table-search-${user.userId}`}
                      />
                      <label htmlFor={`checkbox-table-search-${1}`} className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </td>
                  <th className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                    {user.files && user.files[0] ? (
                      <>
                        <img
                          className="w-10 h-10 rounded-full"
                          src={`${uploads}/${user.files[0].fileUrl}`}
                          alt="Jese Leos"
                        />
                        
                      </>
                    ):(
                      <>
                      <img
                        className="w-10 h-10 rounded-full"
                        src={`${imageNotFound}`}
                        alt="Jese Leos"
                      />
                      </>
                    )}
                    <div className="ps-3 items-center">
                      <div className="font-medium text-gray-900 text-base">{user.name}</div>
                      <div className="font-normal text-gray-500">{user.email}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4 hover:text-gray-900 transition duration-300 ease-in">
                    {user?.role && user.role.name === 'Admin' ?  (
                      <>
                        <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
                          Admin
                        </span>
                      </>
                    ) : user?.role && user.role.name === 'Manager' ? (
                      <>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
                          Gerente
                        </span>
                      </>
                    ): user?.role && user.role.name === 'Employee' ? (
                      <>
                        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded 0">
                          Funcionario
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
                          Desconhecido
                        </span>
                      </>
                    )
                  } 
                  </td>
                  <td className='px-6 py-4'>
                    <div className="inline-flex items-center hover:scale-150 transition duration-300">
                      {user && user.avaiable === true ? (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-1 hover:bg-green-800">
                          </div>
                          <span>
                            Ativo
                          </span>
                        </>
                      ):(
                        <>
                        <div className="h-2.5 w-2.5 rounded-full bg-red-400 mr-1 hover:bg-red-800">
                        </div>
                        <span className="">
                          Inativo
                        </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.createdAt && new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    {/* {user.createdAt && formatDateTimeLocal(user.createdAt)} */}
                  </td>
                  <td className="px-6 py-4 items-center">
                    <a href="#" className="font-medium text-cyan-50 px-2 py-2 me-1 bg-blue-400 rounded-md hover:underline hover:bg-blue-500 transition duration-500 ease-in-out" >Editar</a>
                    <a href="#" className="font-medium text-cyan-50 px-2 py-2 bg-red-400 rounded-md hover:underline hover:bg-red-500 transition duration-500 ease-in-out">Excluir</a>
                  </td>
                </tr>
              </>
            ))}
            
          </tbody>
        </table>
      </div>
      
    </section>
  )
}

export default Users