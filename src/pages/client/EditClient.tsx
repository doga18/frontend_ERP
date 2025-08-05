import React, { useState, useEffect } from 'react'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { /*PhotoIcon, UserCircleIcon,*/ PencilSquareIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import type { newClientData } from '../../interfaces/ClientsInterface';

// Importando a função para consulta do CEP
import { getCep } from '../../utils/config';

// Importando Slice para disparar o dispatch
// Criar o EditClient
import { newClient, searchClientById } from '../../slices/clientesSlice';

// Importando o tratamento do dispath.
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';

// Importando a interface de resposta do cliente
// import type { ClientDataUnique } from '../../interfaces/ClientsInterface';


// Interfaces
interface Props {
  clientId: number | null
  isOpen: boolean
  onClose: () => void
}

interface responseCep {
  cep: string
  logradouro: string
  complemento: string
  unidade: string  
  bairro: string
  localidade: string
  uf: string
  estado: string
  erro?: boolean
}

interface ErrorsType {
  name?: string
  lastname?: string
  email?: string
  contact?: string
  cep?: string
  address?: string
  city?: string
  state?: string
}

// interface ResponseEditClient {
//   message: string,
//   user: ClientDataUnique,
//   error?: string | null,
// }

const EditClient = ( { clientId, isOpen, onClose }: Props) => {
  // Usestates
  const [nameForm, setNameForm] = useState<string>('')
  const [lastnameForm, setLastnameForm] = useState<string>('')
  const [emailForm, setEmailForm] = useState<string>('')
  const [contactForm, setContactForm] = useState<string>('')
  const [contactForm_2, setContactForm_2] = useState<string>('')  
  const [addressForm, setAddressForm] = useState<string>('')
  const [cityForm, setCityForm] = useState<string>('')
  const [stateForm, setStateForm] = useState<string>('')  
  const [countryForm, setCountryForm] = useState<string>('Brasil')
  const [cepForm, setCepForm] = useState<string>('')
  const [complementForm, setComplementForm] = useState<string>('')
  const [autorizationContactPhone, setAutorizationContactPhone] = useState<boolean>(false)
  const [autorizationContactEmail, setAutorizationContactEmail] = useState<boolean>(false)
  const [dataResponseCep, setDataResponseCep] = useState<responseCep>({} as responseCep)
  const [errorsForm, setErrorsForm] = useState<ErrorsType>({} as ErrorsType)
  // const [ImagePerfil, setImagePerfil] = useState<string>('');

  // Controllers of page
  const [lockOfCountry, setLockOfCountry] = useState<boolean>(true)

  // Redux
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const { targetClient, loading, /*errors: errorsClient,*/ updated: updatedClient } = useSelector((state: RootState) => state.client);

  // Functions

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Verificando se as variáveis estão preenchidas
    // Montando um objeto temporário para armazenar os erros
    const newErrors: ErrorsType = {};

    if(!nameForm) newErrors.name = 'O nome deve ser preenchido';
    if(!lastnameForm) newErrors.lastname = 'O sobrenome deve ser preenchido';
    if(!emailForm) newErrors.email = 'O email deve ser preenchido';
    if(!contactForm) newErrors.contact = 'O contato deve ser preenchido';
    if(!cepForm) newErrors.cep = 'O cep deve ser preenchido';
    if(!addressForm) newErrors.address = 'O endereço deve ser preenchido';
    if(!cityForm) newErrors.city = 'A cidade deve ser preenchida';
    if(!stateForm) newErrors.state = 'O estado deve ser preenchido';

    setErrorsForm(newErrors);
    // Verificando se existem erros, para prosseguir
    if(Object.keys(newErrors).length === 0){
      // Continuando com o envio do formulário
      const newClientData: newClientData = {
        name: nameForm,
        lastname: lastnameForm,
        email: emailForm,
        contact: contactForm,
        contact_2: contactForm_2 ? contactForm_2 : '',
        zipCode: cepForm,
        address: addressForm,
        city: cityForm,
        state: stateForm,
        country: countryForm ? countryForm : 'Brasil',
        complement: complementForm ? complementForm : '',
        autorizationContactPhone: autorizationContactPhone ? true : false,
        autorizationContactEmail: autorizationContactEmail ? true : false
      }

      // Realizando o dispatch do envio do formulário
      console.log('Dados do formulário: ', newClientData);

      // Disparando a ação de registro.
      dispatch(newClient(newClientData));
    }
  }

  // Pesquisa de dados do CEP
  const resultCep = async (cep: string) => {
    const response = await getCep(cep);
    if(response){
      setDataResponseCep(response);
    }else{
      setDataResponseCep({} as responseCep);
    }
  }

  // UseEffects
  // Verificando o tamanho do CEP para ativar a consulta
  useEffect(() => {
    if(cepForm.length === 8){
      console.log('CEP minimo digitado, consultando...')
      setLockOfCountry(true);
      // Consultando a API dos Correios...
      resultCep(cepForm);
    }
  }, [cepForm])

  useEffect(() => {
    if(!dataResponseCep.erro){
      setAddressForm(dataResponseCep.logradouro);
      setCityForm(dataResponseCep.localidade);
      setStateForm(dataResponseCep.uf);
    }
  }, [dataResponseCep])

  useEffect(() => {
    if(updatedClient){
      onClose();
    }
  }, [updatedClient])

  // Buscando os dados do client pelo ID
  useEffect(() => {
    // ResponseEditClient
    if(clientId){
      dispatch(searchClientById(Number(clientId)));
    }
  }, [clientId, dispatch]);
  // Preenchendo os campos com os dados do cliente
  useEffect(() => {
    if(targetClient){
      setNameForm(targetClient.name);
      setLastnameForm(targetClient.lastname);
      setEmailForm(targetClient.email);
      setContactForm(targetClient.contact);
      setContactForm_2(targetClient.contact_2 ?? '');
      setAddressForm(targetClient.address ?? '');
      setCityForm(targetClient.city ?? '');
      setStateForm(targetClient.state ?? '');
      setCountryForm(targetClient.country ?? 'Brasil');
      setCepForm(targetClient.zipCode ?? '');
      setComplementForm(targetClient.complement ?? '');
      setAutorizationContactPhone(targetClient.autorizationContactPhone ?? false);
      setAutorizationContactEmail(targetClient.autorizationContactEmail ?? false);
      setCountryForm(targetClient.country ?? 'Brasil');
      // if(targetClient.files && targetClient.files.fileUrl){
      //   setImagePerfil(targetClient.files.fileUrl);
      // }
    }
  }, [targetClient]);

  // console.log('Cliente localizado: ', targetClient);

  return (
    <section>
      <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" transition>
          <div className="fixed inset-0 z-10 w-screen h-screen overflow-y-auto items-center justify-center">

            <DialogPanel className="relative max-w-4xl bg-white w-full mx-auto my-6 rounded-lg divide-y divide-gray-100 dark:bg-gray-100 dark:text-gray-100 dark:decorate-none">
              <DialogTitle className="px-4 pt-5 pb-4 text-lg font-semibold">
                {/* Aqui será o formulário */}
                <form onSubmit={handleSubmit}>
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                      <h2 className="text-base/7 font-semibold text-gray-900">Editando cliente: {targetClient?.name ? targetClient.name : 'Não informado'} <PencilSquareIcon className="w-5 h-5 inline-block ml-2"/></h2>
                      <p className="mt-1 text-sm/6 text-gray-600">
                        Preencha as informações do cliente para ser cadastrado.
                      </p>
                      <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
                    </div>
                    <div className="border-b border-gray-900/10 pb-12">
                      <h2 className="text-base/7 font-semibold text-gray-900">Informações Pessoais</h2>
                      <p className="mt-1 text-sm/6 text-gray-600">Os campos que possuírem o <span className="text-red-600">*</span> (asterisco) serão <span className="text-red-600">obrigatórios</span>.</p>

                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                            Nome
                          </label>
                          <div className="mt-2">
                            <input
                              id="name"
                              name="name"
                              type="text"
                              placeholder='Ex: João'
                              value={nameForm}
                              onChange={(e) => setNameForm(e.target.value)}
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                          <small className="text-xs text-gray-600">
                            {!stateForm ? (
                              <div>
                                {errorsForm && (!nameForm || nameForm.length === 0) ? (
                                  <>
                                    <span className="text-red-600">* </span>{errorsForm && errorsForm.name && <span className="text-gray-700">{errorsForm.name}</span> }
                                  </>
                                ) : (
                                  <>
                                    <span className="text-red-600">*</span> Campo obrigatório
                                  </>
                                  
                                )}
                                
                              </div>
                            ) : (
                              <div>
                                <span className="text-green-600">Status</span> Preenchido
                              </div>
                            )}
                          </small>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="sobrenome" className="block text-sm/6 font-medium text-gray-900">
                            Sobrenome
                          </label>
                          <div className="mt-2">
                            <input
                              id="sobrenome"
                              name="sobrenome"
                              type="text"
                              autoComplete="family-name"
                              placeholder='Sobrenome não informado'
                              value={lastnameForm}
                              onChange={(e) => setLastnameForm(e.target.value)}
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                          <small className="text-xs text-gray-600">
                            {!stateForm ? (
                              <div>
                                {errorsForm && !lastnameForm ? (
                                  <>
                                    <span className="text-red-600">* </span>{errorsForm && errorsForm.lastname && <span className="text-gray-700">{errorsForm.lastname}</span> }
                                  </>
                                ) : (
                                  <>
                                    <span className="text-red-600">*</span> Campo obrigatório
                                  </>
                                  
                                )}
                                
                              </div>
                            ) : (
                              <div>
                                <span className="text-green-600">Status</span> Preenchido
                              </div>
                            )}
                          </small>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Endereço de Email
                          </label>
                          <div className="mt-2">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              value={emailForm}
                              onChange={(e) => setEmailForm(e.target.value)}
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                          <small className="text-xs text-gray-600">
                            {!stateForm ? (
                              <div>
                                {errorsForm && !emailForm ? (
                                  <>
                                    <span className="text-red-600">* </span>{errorsForm && errorsForm.email && <span className="text-gray-700">{errorsForm.email}</span> }
                                  </>
                                ) : (
                                  <>
                                    <span className="text-red-600">*</span> Campo obrigatório
                                  </>
                                  
                                )}
                                
                              </div>
                            ) : (
                              <div>
                                <span className="text-green-600">Status</span> Preenchido
                              </div>
                            )}
                          </small>
                        </div>

                        <div className="sm:col-span-3">                          
                          <label htmlFor="contactForm" className="block text-sm/6 font-medium text-gray-900">
                            Telefone (WhatsApp)
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="contactForm"
                              id="contactForm"
                              value={contactForm}
                              onChange={(e) => setContactForm(e.target.value)}
                              className='block w-full bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                              />
                          </div>
                          <small className="text-xs text-gray-600">
                            {!stateForm ? (
                              <div>
                                {errorsForm && !contactForm ? (
                                  <>
                                    <span className="text-red-600">* </span>{errorsForm && errorsForm.contact && <span className="text-gray-700">{errorsForm.contact}</span> }
                                  </>
                                ) : (
                                  <>
                                    <span className="text-red-600">*</span> Campo obrigatório
                                  </>
                                  
                                )}
                                
                              </div>
                            ) : (
                              <div>
                                <span className="text-green-600">Status</span> Preenchido
                              </div>
                            )}
                          </small>
                        </div>

                        <div className="sm:col-span-3">                          
                          <label htmlFor="contactForm_2" className="block text-sm/6 font-medium text-gray-900">
                            Telefone Recado
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="contactForm_2"
                              id="contactForm_2"
                              placeholder={targetClient?.contact_2 ? targetClient?.contact_2 : 'Telefone para recado não informado'}
                              className='block w-full bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                              value={contactForm_2}
                              onChange={(e) => setContactForm_2(e.target.value)}
                              />
                          </div>
                        </div>

                      </div>
                    </div>

                    <section className="address">
                      <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-1">
                              <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                                País
                              </label>

                              <div className="mt-1 relative">
                                {/* Container do select + ícone */}
                                <select
                                  id="country"
                                  name="country"
                                  autoComplete="country-name"
                                  value={countryForm}
                                  onChange={(e) => setCountryForm(e.target.value)}
                                  className="w-full appearance-none rounded-md bg-white py-1.5 pr-10 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  disabled={lockOfCountry}
                                >
                                  <option value={"Brasil"}>Brasil</option>
                                  <option value={"Canada"}>Canada</option>
                                  <option value={"Mexico"}>Mexico</option>
                                </select>
                                {lockOfCountry ? (
                                  <>
                                    <LockClosedIcon className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-black cursor-pointer" onClick={() => setLockOfCountry(false)} />
                                  </>
                                ):(
                                  <>
                                    <LockOpenIcon className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-black cursor-pointer" onClick={() => setLockOfCountry(true)} />
                                  </>
                                )}
                                <ChevronDownIcon
                                  aria-hidden="true"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer"
                                />
                              </div>
                              <small>
                                {!countryForm ? (
                                  <div className='text-gray-600 mt-2'>
                                    <span className="text-red-600">*</span> Campo obrigatório
                                  </div>
                                ) : (
                                  <div className="text-gray-600 mt-2">
                                    Selecionado: <span className="text-green-600">{countryForm}</span>
                                  </div>
                                )}
                              </small>
                            </div>
                            <div className="col-span-1">
                              <label htmlFor="cep" className="block text-sm/6 font-medium text-gray-900">
                                CEP
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="cep"
                                  id="cep"
                                  max={"99999-999"}
                                  autoComplete="postal-code"
                                  placeholder='Ex: 00000-000'
                                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                                  value={cepForm}
                                  onChange={(e) => setCepForm(e.target.value)}
                                />
                              </div>
                              <small>
                                {!cepForm ? (
                                  <div className='text-gray-600 mt-1'>
                                    <span className="text-red-600">*</span> <span className="font-semibold text-gray-600">Não informado</span>
                                  </div>
                                ) : (
                                  <div className="text-gray-600 mt-1">
                                    Selecionado: <span className="text-green-600">{cepForm}</span>
                                  </div>
                                )}
                              </small>

                            </div>
                            <div className="col-span-2">
                              <label htmlFor="street-address" className="block text-sm/6 font-medium text-gray-900 capitalize">
                                Logradouro (rua, avenida, etc)
                              </label>
                              <div className="mt-2">
                                <input
                                  id="street-address"
                                  name="street-address"
                                  type="text"
                                  autoComplete="street-address"
                                  value={addressForm}
                                  onChange={(e) => setAddressForm(e.target.value)}
                                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                              </div>
                              <small className="text-xs text-gray-600">
                                {!addressForm ? (
                                  <div>
                                    {errorsForm && !addressForm ? (
                                      <>
                                        <span className="text-red-600">* </span>{errorsForm && errorsForm.address && <span className="text-gray-700">{errorsForm.address}</span> }
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-red-600">*</span> Campo obrigatório
                                      </>
                                      
                                    )}
                                    
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-green-600">Status</span> Preenchido
                                  </div>
                                )}
                              </small>
                            </div>

                            <div className="sm:col-span-2 sm:col-start-1">
                              <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                                Cidade
                              </label>
                              <div className="mt-2">
                                <input
                                  id="city"
                                  name="city"
                                  type="text"
                                  value={cityForm}
                                  onChange={(e) => setCityForm(e.target.value)}
                                  autoComplete="address-level2"
                                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                              </div>
                              <small className="text-xs text-gray-600">
                                {!cityForm ? (
                                  <div>
                                    {errorsForm && !cityForm ? (
                                      <>
                                        <span className="text-red-600">* </span>{errorsForm && errorsForm.city && <span className="text-gray-700">{errorsForm.city}</span> }
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-red-600">*</span> Campo obrigatório
                                      </>
                                      
                                    )}
                                    
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-green-600">Status</span> Preenchido
                                  </div>
                                )}
                              </small>
                            </div>

                            <div className="sm:col-span-2">
                              <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                                Estado
                              </label>
                              <div className="mt-2">
                                <input
                                  id="region"
                                  name="region"
                                  type="text"
                                  value={stateForm}
                                  onChange={(e) => setStateForm(e.target.value)}
                                  autoComplete="address-level1"
                                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                              </div>
                              <small className="text-xs text-gray-600">
                                {!stateForm ? (
                                  <div>
                                    {errorsForm && !stateForm ? (
                                      <>
                                        <span className="text-red-600">* </span>{errorsForm && errorsForm.state && <span className="text-gray-700">{errorsForm.state}</span> }
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-red-600">*</span> Campo obrigatório
                                      </>
                                      
                                    )}
                                    
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-green-600">Status</span> Preenchido
                                  </div>
                                )}
                              </small>
                            </div>
                            <div className="col-span-full">
                              <label htmlFor="address_complement" className="block text-sm/6 font-medium text-gray-900">
                                Complemento de Endereço e Observações sobre o cliente...
                              </label>
                              <div className="mt-2">
                                <textarea
                                  id="address_complement"
                                  name="address_complement"
                                  rows={3}
                                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                  placeholder={'Ex: Só entrar em contato após as 08:00 AM, etc...'}
                                  value={complementForm}
                                  onChange={(e) => setComplementForm(e.target.value)}
                                />
                              </div>
                              <p className="mt-3 text-sm/6 text-gray-600">Não esqueça e incluir informações importantes e particularidades para lembrança futura...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className="border-b border-gray-900/10 pb-12">
                      <h2 className="text-base/7 font-semibold text-gray-900">Notificações do Sistema</h2>
                      <p className="mt-1 text-sm/6 text-gray-600">
                        Verifique com o cliente se ele autoriza que o sistema entre em contato para envio de notificações e autorizações.
                      </p>

                      <div className="mt-10 space-y-10">
                        <fieldset>
                          <legend className="text-sm/6 font-semibold text-gray-900">Aceita Receber notificações por e-mail?</legend>
                          <div className="mt-6 space-y-6">
                            <div className="flex gap-3">
                              <div className="flex h-6 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    id="autorizationContactEmail"
                                    name="autorizationContactEmail"
                                    type="checkbox"
                                    aria-describedby="autorizationContactEmail-description"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                    checked={autorizationContactEmail}
                                    onChange={(e) => setAutorizationContactEmail(e.target.checked)}
                                  />
                                  <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                  >
                                    <path
                                      d="M3 8L6 11L11 3.5"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-checked:opacity-100"
                                    />
                                    <path
                                      d="M3 7H11"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-indeterminate:opacity-100"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="text-sm/6">
                                <label htmlFor="comments" className="font-medium text-gray-900">
                                  Notificações pelo Email
                                </label>
                                <p id="autorizationContactEmail-description" className="text-gray-500">
                                  O sistema entrará em contato em ocasiões que necessitam de interação e autorização do sistema.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <div className="flex h-6 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    id="autorizationContactPhone"
                                    name="autorizationContactPhone"
                                    type="checkbox"
                                    aria-describedby="autorizationContactPhone-description"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                    checked={autorizationContactPhone}
                                    onChange={(e) => setAutorizationContactPhone(e.target.checked)}
                                  />
                                  <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                  >
                                    <path
                                      d="M3 8L6 11L11 3.5"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-checked:opacity-100"
                                    />
                                    <path
                                      d="M3 7H11"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-indeterminate:opacity-100"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="text-sm/6">
                                <label htmlFor="autorizationContactPhone" className="font-medium text-gray-900">
                                  Notificações pelo WhatsApp
                                </label>
                                <p id="autorizationContactPhone-description" className="text-gray-500">
                                  O sistema usará para autorizações e contato rápido, através do WhatsApp
                                </p>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm/6 font-semibold text-white bg-red-500 py-2 px-4 rounded hover:bg-red-700 hover:scale-105 transition ease-in-out duration-300" onClick={() => onClose()}>
                      Cancel
                    </button>
                    {!loading ? (
                      <>
                        <button
                          type="submit"
                          className="text-sm/6 font-semibold text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition ease-in-out duration-300"
                        >
                          Salvar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="submit"
                          className="text-sm/6 font-semibold text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition ease-in-out duration-300"
                          disabled
                        >
                          Salvando...
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </DialogTitle>
            </DialogPanel>
          </div>
        </DialogBackdrop>
      </Dialog>
    </section>
  )
}

export default EditClient