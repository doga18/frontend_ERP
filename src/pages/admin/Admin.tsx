import React, { useState, useEffect} from 'react'

// Redux
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
// import { validUserLogged } from '../../slices/authSlice';

// Importando páginas
import Users from '../user/Users';

const Admin = () => {
  return (
    <section id="administrative" className="p-6 xl:max-w-6xl xl:mx-auto">
      <section className="mb-6 flex items-center justify-center">
        <div className="flex items-center justify-start">
          <span className="inline-flex justify-center items-center w-120 h-12 rounded-full bg-white text-black mr-3">
            <h1 className="leading-tight text-3xl">Administração</h1>
          </span>
        </div>
      </section>
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
                  className="inline-flex items-center cursor-pointer"
                >
                  <input
                    id="notificationActivity"
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-red-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 "></div>
                  <span className="ms-3 text-sm font-medium text-blue-900 inline-flex items-center justify-center">
                    Notificações
                  </span>
                </label>
              </div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Douglas Israel
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
      <Users />
    </section>
  );
};

export default Admin;
