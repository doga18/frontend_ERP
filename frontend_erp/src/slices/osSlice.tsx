import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

import osService from "../services/osService";

// Interfaces
interface UserDataOnOs {
  userId: number;
  name: string;
  email: string;
}
interface ResponseDataUniqueInAll {
  osId: string;
  os_number: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: number;
  budget: string;
  discount: string;
  createdAt: string;
  updatedAt: string;
  user: UserDataOnOs;
}
interface getResponseOs {
  success: boolean;
  error?: { message: string } | null;
  loading: boolean;
  message: string | null
  total: number;
  totalPages: number;
  currentPage: number;
  data: ResponseDataUniqueInAll[];
}

// Iniciando os estados.
const initialState: getResponseOs = {
  success: false,
  error: null,
  loading: false,
  message: null,
  total: 0,
  totalPages: 0,
  currentPage: 0,
  data: [],
};

// Slice de OS
export const getAllOs = createAsyncThunk<
  getResponseOs,
  void,
  { rejectValue: { errors: string[] } }
>("os/getAllOs", async (_, thunkAPI) => {
  try {
    const response = await osService.getAllOs();
    return response;
  } catch (error: unknown) {
    console.error(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
});

// Criando o Slice.
const osSlice = createSlice({
  name: "os",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOs.pending, (state) => {
        state.success = false;
        state.error = null;
        state.loading = true;
        state.message = null;
        state.total = 0;
        state.totalPages = 0;
        state.currentPage = 0;
        state.data = [];
      })
      .addCase(getAllOs.fulfilled, (state, action) => {
        state.success = true;
        state.error = null;
        state.loading = false;
        state.message = action.payload.message;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.data = action.payload.data;
      })
      .addCase(getAllOs.rejected, (state, action) => {
        state.success = false;
        state.error = { message: action.payload?.errors[0] || "Erro Desconhecido." };
        state.loading = false;
        state.message = null;
        state.total = 0;
        state.totalPages = 0;
        state.currentPage = 0;
        state.data = [];
      })
  },
});

export default osSlice.reducer;
