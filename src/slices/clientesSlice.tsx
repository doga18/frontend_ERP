import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import clientsService from '../services/clientesService';
import type { newClientData, ClientDataUnique } from '../interfaces/ClientsInterface';
// import type { toFormData } from '../utils/config';

interface ResponseClientsCount {
  total: number
  totalPages: number
  currentPage: number
  rows: ClientDataUnique[]
  loading: boolean
  errors?: string[] | null
  updated: boolean
  searchClients: ClientDataUnique[]
  targetClient?: ClientDataUnique | null
}
interface ResponseErrorClientsCount {
  errors: string[]
}
// interface ResponseEditClient {
//   message: string,
//   user: ClientDataUnique,
//   error?: string | null,
// }

interface ResponseClientByName {
  rows: ClientDataUnique[],
  error?: string,
  message?: string,

}

const initialState: ResponseClientsCount = {
  total: 0,
  totalPages: 1,
  currentPage: 1,
  rows: [],
  loading: false,
  errors: null,
  updated: false,
  searchClients: [],
  targetClient: null
};

// Slices de Clients
// Get all Clients and count
export const getAllClientCount = createAsyncThunk<
  ResponseClientsCount,
  { page: number | string, limit: number },
  { rejectValue: ResponseErrorClientsCount }
>(
  "clients/getAllClientCount",
  async ({limit, page}, thunkAPI) => {
    try {
      const response = await clientsService.countAllClients(limit, page);
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
  ResponseClientByName,
  string,
  { rejectValue: ResponseErrorClientsCount }
>(
  "clients/searchClientByName",
  async(name: string, thunkAPI) => {
    try {
      console.log("valor para pesquisa: " + name);
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
// Get client by ID
export const searchClientById = createAsyncThunk<
  ClientDataUnique,
  number,
  { rejectValue: ResponseErrorClientsCount }
  >(
  "clients/searchClientById",
  async (id: number, thunkAPI) => {
    try {
      const response = await clientsService.searchClientById(id);
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
        state.total = 0;
        state.rows = [];
        state.totalPages = 1;
        state.currentPage = 1;
        state.errors = null;
        state.updated = false;
        state.searchClients = [];
        state.targetClient = null;
      })
      .addCase(getAllClientCount.fulfilled, (state, action) => {
        state.total = action.payload.total;
        state.rows = action.payload.rows;
        state.loading = false;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.errors = null;
        state.updated = false;
      })
      .addCase(getAllClientCount.rejected, (state, action) => {
        if(!action.payload) return;
        if(action.payload.errors) state.errors = action.payload.errors;
        state.total = 0;
        state.rows = [];
        state.loading = false;
        state.totalPages = 1;
        state.currentPage = 1;
        state.updated = false;
        state.searchClients = [];
        state.targetClient = null;
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
        if(action.payload.message?.includes("Nenhum cliente encontrado")){
          state.searchClients = [];
          state.errors = [action.payload.message];
        }
        state.searchClients = action.payload.rows;
      })
      .addCase(searchClientByName.rejected, (state, action) => {
        if(!action.payload) return;
        if(action.payload.errors) state.errors = action.payload.errors;
        state.loading = false;
      })
      .addCase(searchClientById.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.targetClient = null;
      })
      .addCase(searchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.targetClient = action.payload;
      })
      .addCase(searchClientById.rejected, (state, action) => {
        if(!action.payload) return;
        if(action.payload.errors) state.errors = action.payload.errors;
        state.loading = false;
      })
  }
}))

export default clientsSlice.reducer