// import React from 'react'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

type PropsDetails = {
  name?: string;
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const DetailsImage = (props: PropsDetails) => {
  return (
    <div>
      <Dialog open={props.isOpen} onClose={() => {}} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 z-10 bg-black/70 w-screen h-screen flex items-center justify-center" />
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <DialogPanel className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col items-center p-6">
        <DialogTitle className="text-2xl font-bold mb-4 text-center w-full">{props.name || 'Foto do Equipamento'}</DialogTitle>
        <div className="flex-1 flex items-center justify-center w-full mb-6">
          <img
            src={props.url}
            alt={props.name || 'Foto do Equipamento'}
            className="object-contain max-h-[60vh] w-auto rounded border"
          />
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

export default DetailsImage