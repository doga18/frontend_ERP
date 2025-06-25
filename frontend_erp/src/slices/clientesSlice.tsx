import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

import clientsService from '../services/clientesService';

interface ClientData {
  clientId: number
  name: string
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
}

interface ResponseClientsCount {
  count: number
  rows: ClientData[]
  loading: boolean
  errors?: string[] | null
}

interface ResponseErrorClientsCount {
  errors: string[]
}

const initialState: ResponseClientsCount = {
  count: 0,
  rows: [],
  loading: false,
  errors: null
};

// Slices de Clients
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

// Criando o Slice
const clientsSlice = createSlice(({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClientCount.pending, (state) => {
        state.count = 0;
        state.rows = [];
      })
      .addCase(getAllClientCount.fulfilled, (state, action) => {
        state.count = action.payload.count;
        state.rows = action.payload.rows;
      })
      .addCase(getAllClientCount.rejected, (state, action) => {
        if(!action.payload) return;
        if(action.payload.errors) state.errors = action.payload.errors;
        state.count = 0;
        state.rows = [];
      });
  }
}))

export default clientsSlice.reducer