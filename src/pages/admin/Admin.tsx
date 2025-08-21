import React, { useState, useEffect} from 'react'

// Redux
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { /*validUserLogged,*/ getUserById } from '../../slices/authSlice';
// Importando páginas
import Users from '../user/Users';
// intefaces
interface userData {
  userId: number;
  name: string;
  lastname: string;
  email: string;
  avaiable: boolean;
  hash_recover_password?: string;
  roleId: number;
  role?: {
    name: string
  }
  token: string;
  createdAt?: string;
  updatedAt?: string;
  files: [
    {
      fileName: string;
      fileUrl: string;
    }
  ]
}

const Admin = () => {
  const userLocal = localStorage.getItem('user');
  const id = JSON.parse(userLocal as string).userId;
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const { userSelected } = useSelector((state: RootState) => state.auth);
  // UseStates
  const [userLogged, setUserLogged] = useState<userData | null>(null);
  // UseEffects
  useEffect(() => {
    // Pegando o ID do usuário logado...
      dispatch(getUserById(Number(id)));
    
  }, [dispatch]);
  useEffect(() => {
    if(userSelected){
      setUserLogged(userSelected);
    }
  }, [userSelected])

  console.log('userLogged: ', userLogged);

  return (
    <section id="administrative" className="p-6 xl:max-w-6xl xl:mx-auto">
      <section className="mb-6 flex items-center justify-center">
        <div className="flex items-center justify-start">
          <span className="inline-flex justify-center items-center w-120 h-12 rounded-full bg-white text-black mr-3">
            <h1 className="leading-tight text-3xl">Administração</h1>
          </span>
        </div>
      </section>
      {userLogged === null ? (
        <>
          <div className="flex justify-center items-center font-extralight">
            <div className="flex">
                <div role="status">
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Carregando...</span>
              </div>
            </div>
          </div>
        </>
      ):(
        <>
          <div className="bg-white mb-6 rounded-2xl">
            <div className="flex-1 p-6">
              <div className="flex flex-1/2 lg:flex-row items-center justify-around lg:justify-center">
                <div className=" mb-6 lg:mb-0 lg:mx-12 ">
                  <img
                    alt="doe.doe.doe@example.com"
                    className="rounded-full block h-40 w-full max-w-full bg-gray-100 dark:bg-slate-800"
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=doe-doe-doe-example-com"
                  ></img>
                </div>
                <div className="space-y-3 text-center md:text-left lg:max-12">
                  <div className="flex justify-center md:block">
                    <label
                      htmlFor="notificationActivity"
                      className="inline-flex items-center"
                    >
                      <input
                        id="notificationActivity"
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                        disabled
                      />
                      <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-200 "></div>
                      <span className="ms-3 text-sm font-medium text-blue-900 inline-flex items-center justify-center">
                        Notificações
                      </span>
                    </label>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {userSelected?.name} {userSelected?.lastname}
                  </h1>
                  <p className="text-sm">Último login: 01/01/2023</p>
                  <div className="flex justify-center md:block">
                    <div className="inline-flex items-center capitalize leading-none text-sm border rounded-full py-1.5 px-4 bg-blue-500 border-blue-600 text-white">
                      <span className="inline-flex justify-center items-center w-4 h-4 mr-2">
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          className="inline-block"
                        >
                          <path
                            fill="currentColor"
                            d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"
                          ></path>
                        </svg>
                      </span>
                      <span>Verificado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Users permission={userSelected ? userSelected?.role?.name : "Não informado"}/>
        </>
      )}
    </section>
  );
};

export default Admin;
