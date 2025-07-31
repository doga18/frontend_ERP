import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import clientsService from '../services/clientesService';
import type { newClientData, ClientDataUnique } from '../interfaces/ClientsInterface';
// import type { toFormData } from '../utils/config';

interface ResponseClientsCount {
  count: number
  rows: ClientDataUnique[]
  loading: boolean
  errors?: string[] | null
  updated: boolean
  searchClients: ClientDataUnique[]
}

interface ResponseErrorClientsCount {
  errors: string[]
}

const initialState: ResponseClientsCount = {
  count: 0,
  rows: [],
  loading: false,
  errors: null,
  updated: false,
  searchClients: [],
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
// Get client byname
export const searchClientByName = createAsyncThunk<
  ClientDataUnique[],
  string,
  { rejectValue: ResponseErrorClientsCount }
>(
  "clients/searchClientByName",
  async(name: string, thunkAPI) => {
    try {
      const response = await clientsService.searchClientByName(name);
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
  ClientDataUnique,
  newClientData,
  { rejectValue: ResponseErrorClientsCount }
  >(
  "clients/newClient",
  async (data: newClientData, thunkAPI) => {
    // Convertando a data para um form data para ser enviado...
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
      .addCase(searchClientByName.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.searchClients = [];
      })
      .addCase(searchClientByName.fulfilled, (state, action) => {
        state.loading = false;
        state.searchClients = action.payload;
      })
      .addCase(searchClientByName.rejected, (state, action) => {
        if(!action.payload) return;
        if(action.payload.errors) state.errors = action.payload.errors;
        state.loading = false;
      })
  }
}))

export default clientsSlice.reducer