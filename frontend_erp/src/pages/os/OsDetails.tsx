import React, { useState, useEffect } from 'react'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { OsDetailsInterface } from '../../interfaces/OsDetailsInterface';

// Interfaces
interface props {
  os: OsDetailsInterface | null;
  isOpen: boolean;
  onClose: () => void;
}

const OsDetails = ({os, isOpen, onClose}: props) => {
  // useStates
  const [modalOsDetails, setModalOsDetails] = useState<boolean>(false);

  console.log("ID da OS: " + os);
  return (
    <>
      <button
        onClick={isOpen ? onClose : () => setModalOsDetails(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Editar
      </button>
      <Dialog open={isOpen} onClose={onClose} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center">
          <DialogPanel className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <DialogTitle className="text-xl font-semibold mb-4">
              Detalhes da OS {os?.os_number}
            </DialogTitle>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Título:</strong> {os?.title}</p>
              <p><strong>Descrição:</strong> {os?.description}</p>
              <p><strong>Status:</strong> {os?.status}</p>
              <p><strong>Usuário:</strong> {os?.user?.name}</p>
              <p><strong>Orçamento:</strong> R$ {os?.budget}</p>
              {/* e por aí vai... */}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Fechar
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
    
  )
}

export default OsDetails