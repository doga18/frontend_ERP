//import React from 'react'

const Footer = () => {
  return (
    <section>
      <footer className="bg-white rounded-lg shadow-sm dark:bg-gray-900 m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="https://issuesolved.com/" className="flex items-center mb-4 sm:mb-0 space-x-0 rtl:space-x-reverse">
              <div style={{ width: 64, height: 64 }} className='mr-1'>
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="64">
                  <path
                    d="M24 2a6 6 0 0 1 6 6v2h4V8a6 6 0 1 1 12 0v4h4a6 6 0 0 1 6 6v8h-4a6 6 0 1 0 0 12h4v8a6 6 0 0 1-6 6h-4v4a6 6 0 1 1-12 0v-4h-4v2a6 6 0 0 1-12 0v-4h-4a6 6 0 0 1-6-6v-8h4a6 6 0 1 0 0-12h-4v-8a6 6 0 0 1 6-6h4V8a6 6 0 0 1 6-6Z"
                    fill="#00bfa5"
                  />
                </svg>
                
              </div>
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">IssueSolved</span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm text-white sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025 <a href="https://IssueSolved.com/" className="hover:underline">IssueSolved</a>. Todos os direitos reservados.
          </span>
        </div>
      </footer>
    </section>
  )
}

export default Footer