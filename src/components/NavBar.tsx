import { useLocation } from 'react-router-dom'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { AuthUserInterface } from '../interfaces/AuthUserInterface';

type Props = {
  logout: () => void;
  user?: AuthUserInterface;
}

// const notificationsMsgs = [
//   'Your pipeline is full.',
//   'Something is broken.',
//   'Your team is late.',
// ]

const NavBar = (props: Props) => {
  // Iniciando o componente
  const location = useLocation();

  const navigation = [
  { name: 'Dashboard', href: '/'},
  { name: 'Administração', href: '/admin'},
  { name: 'Clientes', href: '/clients'},
  { name: 'Ordens de Serviço', href: '/os'},
]
function classNames(...classes : string[]) {
  return classes.filter(Boolean).join(' ')
}
//console.log("dados do user", props.user);
  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Menu Suspenso</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <div style={{ width: 32, height: 32 }} className='mr-1' title='IssueSolved'>
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" >
                  <path
                    d="M24 2a6 6 0 0 1 6 6v2h4V8a6 6 0 1 1 12 0v4h4a6 6 0 0 1 6 6v8h-4a6 6 0 1 0 0 12h4v8a6 6 0 0 1-6 6h-4v4a6 6 0 1 1-12 0v-4h-4v2a6 6 0 0 1-12 0v-4h-4a6 6 0 0 1-6-6v-8h4a6 6 0 1 0 0-12h-4v-8a6 6 0 0 1 6-6h4V8a6 6 0 0 1 6-6Z"
                    fill="#00bfa5"
                  />
                </svg>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-amber-500 hover:text-gray-900 hover:font-semibold',
                        'px-3 py-2 rounded-md text-sm font-medium font-edu-titles-light'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Menu as="div" className="relative ml-3">
              <div className="">
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">  
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Notificações</span>
                  <BellIcon aria-hidden="true" className="size-6 text-gray-200" />
                </MenuButton>
                <MenuItems
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  transition
                  >
                  {/* {notificationsMsgs.length > 0 ? (
                    <>
                      {notificationsMsgs.map((not, idx) => (
                        <MenuItem key={idx}>{not}</MenuItem>
                      ))}
                    </>
                  ):(
                    <>
                      <span>Sem notificações NÃO ESTÁ FUNCIONANDO, VERIFICAR DEPOIS.</span>
                    </>
                  )} */}
                </MenuItems>
              </div>
            </Menu>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Menu de usuário</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Perfil
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Configurações
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    onClick={props.logout}
                  >
                    Sair
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                className={classNames(
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block px-3 py-2 rounded-md text-base font-medium'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
              </DisclosureButton>
            )
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

export default NavBar