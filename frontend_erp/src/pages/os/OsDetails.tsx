import React, { useState, useEffect } from 'react'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { /*UserCircleIcon, ChevronDownIcon,*/ PhotoIcon } from '@heroicons/react/24/outline';
import { formatDateTimeLocal } from '../../utils/config';
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { OsDetailsInterface } from '../../interfaces/OsDetailsInterface';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { 
  updateOsDetails
} from '../../slices/osSlice';
// Importando a API para linkar as imagens
import { uploadsOs } from '../../utils/config';
// Pages
import DetailsImage from './DetailsImage';

// Interface de atualização
interface UpdateOsDetailsInterface {
  osId: string;
  description?: string;
  status?: string;
  priority?: string;
  budget?: string;
  discount?: string;
  updatedAt?: string;
  // Montando uma coluna que carregará arquivos de imagens
  image?: FileList[];
}

interface OsFiles {
  fileName: string;
  fileUrl: string;
}

// Interfaces
interface props {
  os: OsDetailsInterface | null;
  isOpen: boolean;
  onClose: () => void;
}

const OsDetails = ({os, isOpen, onClose}: props) => {
  // useStates
  // const [modalOsDetails, setModalOsDetails] = useState<boolean>(false);

  // Variáveis da Os
  const [descriptionOs, setDescriptionOs] = useState<string>('');
  const [statusOs, setStatusOs] = useState<string>('');  
  const [priorityOs, setPriorityOs] = useState<string>('');
  const [budgetOs, setBudgetOs] = useState<string>('0')
  const [discountOsNow, setDiscountOsNow] = useState<string>('0');
  const [priceOsFinal, setPriceOsFinal] = useState<string>('0')
  const [createdDateAt, setCreatedDateAt] = useState<string>('2020-01-01T00:00:00.000Z');
  const [updatedDateAt, setUpdatedDateAt] = useState<string>('2020-01-01T00:00:00.000Z');
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  // montando um usestate para receber uma lista de arquivos de imagens
  const [image, setImage] = useState<FileList | null>(null);
  const [imageUrls, setImageUrls] = useState<{ fileName: string; fileUrl: string }[]>({} as { fileName: string; fileUrl: string }[]);
  const [imageHover, setImageHover] = useState<number | null>(null);
  const [ImageSelected, setImageSelected] = useState<string | null>(null)
  const [imageModalDetails, setImageModalDetails] = useState<boolean>(false)

  console.log('ImageHoverIndex: ' + imageHover);
  console.log('Seleteced', ImageSelected);
  // Uso do dispatch
  const dispatch: AppDispatch = useDispatch();
  console.log("ID da OS: " + os?.osId);
  console.log("O valor de isOp: " + imageModalDetails);
  // funções
  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Verificando se o ID da OS existe
    if(!os?.osId) {
      console.error('ID da OS não encontrado.');
      return;
    }
    // Ativando a opção de atualizando...
    setIsUpdating(true)
    // Montando o objeto com os dados da OS
    const osDataUpdate: UpdateOsDetailsInterface = {
      osId: os.osId,
      description: os?.description !== descriptionOs ? descriptionOs : os?.description,
      status: os?.status !== statusOs ? statusOs : os?.status,
      priority: os?.priority !== priorityOs ? priorityOs : os?.priority,
      budget: os?.budget !== budgetOs ? budgetOs : os?.budget,
      discount: os?.discount !== discountOsNow ? discountOsNow : os?.discount,
      updatedAt: new Date().toISOString(),
    }

    try{
      await dispatch(updateOsDetails(osDataUpdate)).unwrap();
      onClose();
    } finally {
      setIsUpdating(false)
    }
    console.log('Dados montados para atualização da OS:', osDataUpdate);
    // console.log('Tentativa de atualização da OS:', tentativa);
  }
  const [clientName, setClientName] = useState('');
  const handleAddNewClient = () => {
    // Lógica para abrir um modal/formulário de criação de cliente
    console.log('Abrir modal para criar novo cliente');
  };
  // UseEffetcs
  useEffect(() => {
    if(os){
      //setDescriptionOs(prev => prev || os.description || '');
      setDescriptionOs(os.description || '');
      setStatusOs(os.status || '');
      setPriorityOs(os.priority || '0');
      setBudgetOs(os.budget || '0');
      setDiscountOsNow(os.discount || '0');
      setCreatedDateAt(formatDateTimeLocal(os.createdAt));
      setUpdatedDateAt(formatDateTimeLocal(os.updatedAt));
      // adicioando a lista de imagens
      if(os?.files){
        setImageUrls(
          os.files.map((i: OsFiles) => {
            return {
              fileName: i.fileName,
              fileUrl: i.fileUrl
            }
          })
        )
      }
    }
  }, [os])
  // Calculando o valor final da OS
  useEffect(() => {
    if(budgetOs && discountOsNow !== undefined){
      const priceFinal = (Number(budgetOs) - (Number(budgetOs) * Number(discountOsNow) / 100));
      setPriceOsFinal(priceFinal.toFixed(2));
    }
  }, [budgetOs, discountOsNow]);
  return (
    <>
      <Dialog open={isOpen} onClose={() => {}} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-black/30"
          transition
        />
        <div className="fixed inset-0 z-10 w-screen h-screen overflow-y-auto flex items-center justify-center">
          <DialogPanel className="bg-white p-6 rounded shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-xl font-semibold mb-4">
              Detalhes da OS {os?.os_number}
              <span className="text-black"> Situação Principal - <span className="text-red-400">{os?.title}</span></span>
              <span className="text-black">
                UUID: <span className="text-red-400">{os?.osId}</span>
              </span>
            </DialogTitle>
            <div className="form">
              <form onSubmit={handleForm}>
                <div className="space-y-1">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Detalhes</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                      Preencha as informações abaixo para atualizar os detalhes da OS.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="osTitle" className="block text-sm/6 font-medium text-gray-900">
                          Título da OS
                        </label>
                        <div className="mt-2">
                          <input
                            id="osTitle"
                            name="osTitle"
                            type="text"
                            autoComplete="Titulo da OS"
                            disabled={os?.title ? true : false}
                            title={os?.title ? 'O título não pode ser alterado' : 'Defina um título para a OS.'}
                            value={os?.title || ''}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label htmlFor="osDescription" className="block text-sm/6 font-medium text-gray-900">
                          Descrição
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="osDescription"
                            name="osDescription"
                            rows={3}
                            title={os?.description ? '' : 'Defina uma descrição para a OS.'}
                            value={descriptionOs}
                            onChange={(e) => setDescriptionOs(e.target.value)}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>                        
                      </div>
                      <div className="sm-col-span-1">
                        <label htmlFor="createdAt" className='block text-sm/6 font-medium text-gray-900'>
                          Data de abertura
                        </label>
                        <div className="mt-2">
                          <input
                            type="datetime-local"
                            id="createdAt"
                            name="createdAt"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={createdDateAt}
                            disabled
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <label htmlFor="updatedAt" className='block text-sm/6 font-medium text-gray-900'>
                          Última Atualização
                        </label>
                        <div className="mt-2">
                          <input
                            type="datetime-local"
                            id="updatedAt"
                            name="updatedAt"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={updatedDateAt}
                            readOnly
                            disabled
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="statusOs"
                          className="block text-sm/6 font-medium text-gray-900"
                          
                          >
                          Status Atual
                        </label>
                        <div className="mt-2">
                          <select
                            id="statusOs"
                            name="statusOs"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={(e) => setStatusOs(e.target.value)}
                            value={statusOs}
                            >
                            <option value="Aberto">Aberto</option>
                            <option value="Em fila de atendimento">Em fila de atendimento</option>
                            <option value="Em análise">Em análise</option>
                            <option value="Aguardando">Aguardando</option>
                            <option value="Análise concluida">Análise concluída</option>
                            <option value="Situação Inicial">Situação Inicial</option>
                            <option value="Listagem de peças">Listagem de peças</option>
                            <option value="Orçando mão de Obra">Orçando mão de Obra</option>
                            <option value="Pendente aprovação cliente">Pendente aprovação cliente</option>
                            <option value="Autorizado por Cliente">Autorizado por Cliente</option>
                            <option value="Rejeitado Os por Cliente">Rejeitado Os por Cliente</option>
                            <option value="Realizando trabalho">Realizando trabalho</option>
                            <option value="Trabalho em pausa">Trabalho em pausa</option>
                            <option value="Trabalho cancelado">Trabalho cancelado</option>
                            <option value="Trabalho Concluido">Trabalho Concluído</option>
                            <option value="Pendente aviso Cliente">Pendente aviso Cliente</option>
                            <option value="Aviso de conclusão realizado">Aviso de conclusão realizado</option>
                            <option value="Pendente Pagamento">Pendente Pagamento</option>
                            <option value="Pagamento realizado">Pagamento realizado</option>
                            <option value="Concluido">Concluído</option>
                            <option value="Aparelho Retirado">Aparelho Retirado</option>
                            <option value="Retorno Garantia">Retorno Garantia</option>
                          
                          </select>
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="priorityOs"
                          className="block text-sm/6 font-medium text-gray-900">
                          Prioridade
                        </label>
                        <div className="mt-2">
                          <select
                            name="priorityOs"
                            id="priorityOs"
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                            onChange={(e) => setPriorityOs(e.target.value)}
                          >
                            <option value="Normal">Normal</option>
                            <option value="Baixa">Baixa</option>
                            <option value="Média">Média</option>
                            <option value="Alta">Alta</option>
                            <option value="Urgente">Urgente</option>
                          </select>
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <label htmlFor="userOwner">
                          <span className="block text-sm/6 font-medium text-gray-900">
                            Usuário Responsável
                          </span>
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 capitalize'
                            id="userOwner"
                            name="userOwner"
                            readOnly
                            value={os?.user?.name || ''}
                            disabled={os?.user ? true : false}
                            placeholder="Usuário Responsável"
                            />
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="priceOrcOs"
                          className="block text-sm/6 font-medium text-gray-900"
                          >
                          Preço orçado
                        </label>
                        <div className="mt-2">
                          <input
                            id="priceOrcOs"
                            name="priceOrcOs"
                            type="string"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            value={budgetOs}
                            onChange={(e) => setBudgetOs(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="discountOs"
                          className="block text-sm/6 font-medium text-gray-900"
                          >
                          Desconto
                        </label>
                        <div className="mt-2 relative w-full">
                          <input
                            id="discountOs"
                            name="discountOs"
                            type="text"
                            placeholder={discountOsNow === '0' ? '0%' : discountOsNow + '%'}
                            value={discountOsNow + '%'}
                            onChange={(e) => setDiscountOsNow(e.target.value.replace('%', ''))}
                            className="block w-full rounded-md bg-white px-3 py-1.5 pr-10 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                          />
                          {discountOsNow && (
                            <button
                              type="button"
                              onClick={() => (
                                setDiscountOsNow('0'),
                                setDiscountOsNow('')
                              )}
                              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black text-white text-sm w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-700"
                              tabIndex={-1}
                              aria-label="Limpar desconto"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                      <br />
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="priceFinalOs"
                          className="block text-sm/6 font-medium text-gray-900"
                          >
                          Valor Final
                        </label>
                        <input
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          id="priceFinalOs"
                          name="priceFinalOs"
                          type="string"
                          disabled={true}
                          value={priceOsFinal && priceOsFinal !== 'NaN' ? `R$ ${priceOsFinal}` : 'R$ 0,00'}
                        >

                        </input>
                      </div>
                      <div className="col-span-3">
                        <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                          Atualizar Foto do produto
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-2 py-2">
                          <div className="text-center">
                            <PhotoIcon aria-hidden="true" className="mx-auto size-5 text-gray-300" />
                            <div className="mt-4 flex text-sm/6 text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                              >
                                <span>Faça o upload</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                              </label>
                              <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF de no máximo 10MB</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-">
                        <label
                          htmlFor="allignClient"
                          className="block text-sm/6 font-medium text-gray-900"
                          >
                            Cliente Vinculado
                        </label>
                        <button
                            onClick={handleAddNewClient}
                            className="inset-y-0 right-0 flex items-center justify-center px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Adicionar novo cliente"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        <div className="mt-2">
                          <input
                            id="client-input"
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Digite o nome do cliente..."
                            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-gray-900/10 pb-12 mt-4">
                    <div className="mt-2 col-span-full text-center">
                      <span className="text-gray-900">
                        Fotos do equipamento quando foi entregue...
                      </span>
                      <div className="mt-3 flex justify-center itens-center ">
                        {imageUrls && imageUrls.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {imageUrls.map((url, index) => (
                            <img
                              key={index}
                              src={`${uploadsOs}/${url.fileUrl}`}
                              alt={`Foto ${index + 1}`}
                              className="h-24 w-24 object-cover cursor-pointer hover:scale-150 transition-transform duration-300 ease-in-out"
                              onClick={() => {
                                setImageSelected(url.fileUrl);
                                setImageModalDetails(true);
                              }}
                            />
                          ))}
                        </div>
                      ): (
                        <span className="text-gray-600">Nenhuma foto disponível.</span>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    className="text-sm/6 font-semibold text-white bg-red-500 py-2 px-4 rounded hover:bg-red-700 hover:scale-105 transition ease-in-out duration-300"
                    onClick={onClose}
                    >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="text-sm/6 font-semibold text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition ease-in-out duration-300"
                  >
                    {isUpdating ? 'Atualizando...' : 'Atualizar'}
                  </button>
                </div>
                
              </form>
            </div>
          </DialogPanel>
        </div>        
      </Dialog>
      {/* modals */}
      {ImageSelected && ImageSelected.length > 0 && (
        <DetailsImage isOpen={imageModalDetails} onClose={() => {
          setImageModalDetails(false)
        }} name={ImageSelected} url={`${uploadsOs}/${ImageSelected}`} />
      )}
    </>
    
  )
}

export default OsDetails