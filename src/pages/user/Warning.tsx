// import React from 'react'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

type PropsWarning = {
  // Control of modal
  isOpen: boolean,
  onClose: () => void;
  // Specifics variables
  
}

const Warning = (props: PropsWarning) => {
  return (
    <div>
      <Dialog open={props.isOpen} onClose={() => {}} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 z-10 bg-black/70 w-screen h-screen flex items-center justify-center" />
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <DialogPanel className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col items-center p-6">
            <DialogTitle className="text-2xl font-bold mb-4 text-center w-full">Aviso!</DialogTitle>
            <div className="flex-col flex items-center justify-center w-full mb-6 gap-2">
              <img
                src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                alt="Foto do Equipamento"
                className="object-contain max-h-[60vh] w-auto rounded border"
              />
              <p className="text-md font-medium text-gray-600 justify-center hover:text-gray-900 transition duration-500">
                Atenção, você tem a permissão de usuário nesta conta, lembre-se com grandes poderes vem grandes responsabilidades.
              </p>
            </div>
            <button
              onClick={props.onClose}
              className="mt-auto px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-800 hover:scale-105 transition transform-cpu ease-in-out duration-300"
            >
              Fechar
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default Warning