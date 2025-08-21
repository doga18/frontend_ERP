import /*React,*/ { useEffect, useState } from "react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { getAllUsersAndCount } from "../../slices/authSlice";
// Importando interfaces
import type { userDataList } from "../../interfaces/AuthUserInterface";
// Importando a formação de data
// import { formatDateTimeLocal } from '../../utils/config'
import { uploads } from "../../utils/config";

import imageNotFound from "/images/userNotFound.jpg";
// Pages
import Warning from './Warning';
import EditUser from "./EditUser";
import NewUser from "./NewUser";

interface Props {
  permission?: string;
}

const Users = (props: Props) => {
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const { user, usersList, totalUsers } = useSelector(
    (state: RootState) => state.auth
  );
  // UseStates  
  const [pageListUsers, setPageListUsers] = useState<userDataList[]>([]);
  const [modalWarning, setModalWarning] = useState<boolean>(false)
  const [modalEditUser, setModalEditUser] = useState<boolean>(false)
  const [modalNewUser, setModalNewUser] = useState<boolean>(false)
  const [userEditSelected, setUserEditSelected] = useState<userDataList>()
  // Funções

  // UseEffects
  useEffect(() => {
    if (totalUsers > 0 && usersList !== null) {
      setPageListUsers(usersList);
    }
  }, [usersList, totalUsers]);

  useEffect(() => {
    dispatch(getAllUsersAndCount());
  }, [dispatch]);

  // console.log(pageListUsers);

  return (
    <section id="users">
      <Warning isOpen={modalWarning} onClose={() => setModalWarning(false)}/>
      {userEditSelected && (
        <EditUser
          isOpen={modalEditUser}
          onClose={() => setModalEditUser(false)}
          userData={userEditSelected}
          permission={Number(user?.roleId)}
        />
      )}
      <NewUser isOpen={modalNewUser} onClose={() => setModalNewUser(false)} permission={Number(user?.roleId)}/>
      <div className="bg-white mb-6 rounded-2xl relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-col flex-wrap md:flex-row space-y-4 md:space-y-0 pb-0 bg-white dark:bg-gray-900">
          <div className="flex items-center">
            <div className="title">
              <h1 className="text-2xl font-light ms-2 text-gray-900 dark:text-white">
                Lista de usuários,
              </h1>
            </div>
            <div className="type_role">
              <h2 className="text-2xl font-extralight ms-2 text-gray-900 dark:text-white">
                Sua permissão é de{" "} 
                <span className="text-white">
                  {props.permission !== null ? (
                    props.permission === "Admin" ? (
                      <>
                        <span
                          className="animate-pulse text-red-200 bg-red-600 px-2 rounded-md shadow text-shadow-amber-300 hover:bg-red-200 hover:text-red-600 transition duration-300 cursor-pointer"
                          onClick={() => setModalWarning(true)}
                          >
                            Administrador!
                        </span>
                      </>
                    ) : props.permission === "Owner" ? (
                      <>Proprietário</>
                    ) : props.permission === "Manager" ? (
                      <>Gerente</>
                    ) : props.permission === "Employee" ? (
                      <>Funcionario</>
                    ) : props.permission === "Client" ? (
                      <>Cliente</>
                    ) : props.permission === "Vendor" ? (
                      <>Fornecedor</>
                    ) : (
                      ""
                    )
                  ) : (
                    "Nenhuma"
                  )}
                </span>
              </h2>
            </div>
          </div>
          <label htmlFor="table-search" className="sr-only">
            Pesquisar
          </label>
          <div className="relative my-2 me-2">
            <div className="absolute inset-y-0 rtl:left-r-0 flex items-center p-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  // stroke-linecap="round"
                  // stroke-linejoin="round"
                  // stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="table-search-users"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Pesquisar..."
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 border-1 border-gray-300 hover:bg-gray-300 transition duration-300 ">
            <tr>
              <th className="p-4" scope={`col`}>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="checkbox-all-search"
                    id="checkbox-all-search"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  focus:ring-2 "
                  />
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
              {/* <th className="p-4" scope={`col`}>
                Ações
              </th> */}
            </tr>
          </thead>
          <tbody>
            {pageListUsers &&
              pageListUsers.map((user, index) => (
                
                  <tr
                    className="bg-white border-b border-gray-200 hover:bg-gray-200 transition duration-300  cursor-pointer"
                    key={index}
                    onClick={() => (
                      setUserEditSelected(user),
                      setModalEditUser(true)
                    )}
                    >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name={`checkbox-table-search-${user.userId}`}
                          id={`checkbox-table-search-${user.userId}`}
                        />
                        <label
                          htmlFor={`checkbox-table-search-${1}`}
                          className="sr-only"
                        >
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
                            alt={`${user.name}`}
                            title={`${user.name}`}
                          />
                        </>
                      ) : (
                        <>
                          <img
                            className="w-10 h-10 rounded-full"
                            src={`${imageNotFound}`}
                            alt="Usuario sem imagem"
                            title="Usuário não possui imagem"
                          />
                        </>
                      )}
                      <div className="ps-3 items-center">
                        <div className="font-medium text-gray-900 text-base">
                          {user.name}
                        </div>
                        <div className="font-normal text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4 hover:text-gray-900 transition duration-300 ease-in">
                      {user?.role && user.role.name === "Admin" ? (
                        <>
                          <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
                            Admin
                          </span>
                        </>
                      ) : user?.role && user.role.name === "Owner" ? (
                        <>
                          <span className="bg-cyan-200 text-orange-400 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
                            Proprietário
                          </span>
                        </>
                      ) : user?.role && user.role.name === "Manager" ? (
                        <>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
                            Gerente
                          </span>
                        </>
                      ) : user?.role && user.role.name === "Employee" ? (
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
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center hover:scale-150 transition duration-300">
                        {user && user.avaiable === true ? (
                          <>
                            <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-1 hover:bg-green-800"></div>
                            <span>Ativo</span>
                          </>
                        ) : (
                          <>
                            <div className="h-2.5 w-2.5 rounded-full bg-red-400 mr-1 hover:bg-red-800"></div>
                            <span className="">Inativo</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.createdAt &&
                        new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                
              ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="flex items-center justify-center mt-6 text-sm font-semibold leading-6 text-white py-2 px-4 rounded-md bg-blue-500 hover:bg-cyan-600 hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="ml-2" onClick={() => setModalNewUser(true)}>Novo Usuário</span>
      </button>
    </section>
  );
};

export default Users;
