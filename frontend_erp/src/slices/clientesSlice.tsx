import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

import clientsService from '../services/clientesService';

import type { newClientData } from '../interfaces/ClientsInterface';

interface ClientData {
  clientId: number
  name: string
  lastname: string
  email: string
  password?: string
  contact: string
  contact_2?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  assignedTo: number
  createdAt?: string
  updatedAt?: string
  message?: string
}

interface ResponseClientsCount {
  count: number
  rows: ClientData[]
  loading: boolean
  errors?: string[] | null
  updated: boolean
}

interface ResponseErrorClientsCount {
  errors: string[]
}

const initialState: ResponseClientsCount = {
  count: 0,
  rows: [],
  loading: false,
  errors: null,
  updated: false
};

// Slices de Clients
// Get all Clients and count
export const getAllClientCount = createAsyncThunk<
  ResponseClientsCount,
  void,
  { rejectValue: ResponseErrorClientsCount }
>(
  "clients/getAllClientCount",
  async (_, thunkAPI) => {
    try {
      const response = await clientsService.countAllClients();
      return response;
    } catch (error: unknown) {
      console.log(error);
      return thunkAPI.rejectWithValue({
        errors: ["Erro Desconhecido."],
      });
    }
  }
)
// New Client
export const newClient = createAsyncThunk<
  ClientData,
  newClientData,
  { rejectValue: ResponseErrorClientsCount }
  >(
  "clients/newClient",
  async (data: newClientData, thunkAPI) => {
    try {
      const response = await clientsService.newClient(data);
      return response;
    } catch (error: unknown) {
      console.log(error);
      return thunkAPI.rejectWithValue({
        errors: ["Erro Desconhecido."],
      });
    }
  }
)

// Criando o Slice
const clientsSlice = createSlice(({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClientCount.pending, (state) => {
        state.loading = true;
        state.count = 0;
        state.rows = [];
      })
      .addCase(getAllClientCount.fulfilled, (state, action) => {
        state.count = action.payload.count;
        state.rows = action.payload.rows;
        state.loading = false;
      })
      .addCase(getAllClientCount.rejected, (state, action) => {
        if(!action.payload) return;
        if(action.payload.errors) state.errors = action.payload.errors;
        state.count = 0;
        state.rows = [];
        state.loading = false;
      })
      .addCase(newClient.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.updated = false;
      })
      .addCase(newClient.fulfilled, (state, action) => {
        state.loading = false;
        if(!action.payload.message){
          state.errors = [`${action.payload.message}`];
          return
        }
        state.errors = null;
        state.rows.push(action.payload);
        state.updated = true;
        setTimeout(() => {
          state.updated = false;
        }, 5000);
      })
      .addCase(newClient.rejected, (state, action) => {
        if(!action.payload) return;
        if(action.payload.errors) state.errors = action.payload.errors;
        state.loading = false;
      })
  }
}))

export default clientsSlice.reducer