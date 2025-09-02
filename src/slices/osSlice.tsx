import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import type { OsDetailsInterface } from '../interfaces/OsDetailsInterface';

import osService from "../services/osService";

interface ResponseCreateOs {
  message: string;
  os: OsDetailsInterface
}
interface getResponseOs {
  success: boolean;
  error?: { message: string } | null;
  loading: boolean;
  message: string | null
  total: number;
  totalPages: number;
  currentPage: number;
  data: OsDetailsInterface[];
  termId: boolean;
}
interface getResponseWithOsNumberDataIn {
  searchTerm: string;
  message?: string;
  page?: number;
  limit?: number;
}
interface OsUpdateInterface {
  osId: string;
  description?: string;
  status?: string;
  priority?: string;
  budget?: string;
  discount?: string;
  updatedAt?: string;
}

interface OsUpdateInterfaceResponse {
  message: string;
  os: OsDetailsInterface;
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
  termId: false
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
// Slice de Os with Limite and page current
export const getAllOsWithLimitAndPage = createAsyncThunk<
  getResponseOs,
  { page: number, limit: number },
  { rejectValue: { errors: string[] } }
>("os/getAllOsWithLimitAndPage", async ({page, limit}, thunkAPI) => {
  try {
    const response = await osService.getAllOsWithLimitAndPage(page, limit);
    return response;
  } catch (error: unknown) {
    console.error(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
})
// Slice de busca de OS por UUID.
export const getOsById = createAsyncThunk<
  OsDetailsInterface,
  getResponseWithOsNumberDataIn
  , { rejectValue: { errors: string[] } }
>("os/getOsById", async ({searchTerm}, thunkAPI) => {
  try {
    const response = await osService.getOsById(searchTerm);
    return response;
  } catch (error: unknown) {
    console.error(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
})
// Slice de busca de OS por os_number
export const getOsById_number = createAsyncThunk<
  OsDetailsInterface,
  getResponseWithOsNumberDataIn
  , { rejectValue: { errors: string[] } }
>("os/getOsById_number", async ({searchTerm}, thunkAPI) => {
  try {
    const response = await osService.getOsById_number(searchTerm);
    return response;
  } catch (error: unknown) {
    console.error(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
})
// Slice de busca de OS's por string, podendo ser, por title, description, assignedTo.
export const getOsByArgumentsString = createAsyncThunk<
  getResponseOs,
  getResponseWithOsNumberDataIn
  , { rejectValue: { errors: string[] } }
  >("os/getOsByArgumentsString", async ({searchTerm}, thunkAPI) => {
  try {
    const response = await osService.getOsByArgumentsString(searchTerm);
    return response;
  } catch (error: unknown) {
    console.error(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
  })
// Slice de criação de nova OS
export const createOs = createAsyncThunk<
ResponseCreateOs,
FormData,
{ rejectValue: { errors: string[] } }
>("os/createOs", async (FormData, thunkAPI) => {
  // Verificando oque chega no slice...
  console.log('Dados que chegaram no slice: ');
  console.log(FormData);
  for (const [key, value] of FormData.entries()) {
    console.log(`${key}: ${value}`);
  }
  try {
    const response = await osService.newOs(FormData);
    return response;
  } catch (error: unknown) {
    console.error(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
})
// Slice de atualização de OS.
export const updateOsDetails = createAsyncThunk<
  OsUpdateInterfaceResponse,
  OsUpdateInterface,
  { rejectValue: { errors: string[] } }
>("os/updateOsDetails", async (data: OsUpdateInterface, thunkAPI) => {
  try {
    const response = await osService.updateOsDetails(data);
    return response;
  } catch (error: unknown) {
    console.error(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
})
  // OsUpdateInterface
// Criando o Slice.
const osSlice = createSlice({
  name: "os",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all Os default
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
        //console.log("Resposta do payload:", action.payload);
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
      // Get all Os with limit and Page limitation.
      .addCase(getAllOsWithLimitAndPage.pending, (state) => {
        state.success = false;
        state.error = null;
        state.loading = true;
        state.message = null;
        state.total = 0;
        state.totalPages = 0;
        state.currentPage = 0;
        state.data = [];
      })
      .addCase(getAllOsWithLimitAndPage.fulfilled, (state, action) => {
        state.success = true;
        state.error = null;
        state.loading = false;
        state.message = action.payload.message;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        //console.log("Resposta da API: ", action.payload.data)
        state.data = action.payload.data;
      })
      .addCase(getAllOsWithLimitAndPage.rejected, (state, action) => {
        state.success = false;
        state.error = { message: action.payload?.errors[0] || "Erro Desconhecido." };
        state.loading = false;
        state.message = null;
        state.total = 0;
        state.totalPages = 0;
        state.currentPage = 0;
        state.data = [];
      })
      .addCase(getOsById_number.pending, (state) => {
        state.success = false;
        state.error = null;
        state.loading = true;
        state.message = null;
      })
      .addCase(getOsById_number.fulfilled, (state, action) => {
        state.success = true;
        state.error = null;
        state.loading = false;
        state.message = "OS encontrada com sucesso.";
        // Aqui você pode adicionar a lógica para atualizar o estado com os dados da OS encontrada
        console.log("OS encontrada:", action.payload);
        const foundOs = action.payload;
        // Exemplo: Adicionar a OS encontrada ao estado
        state.data = [foundOs]; // ou qualquer outra lógica que você precise
      })
      .addCase(getOsById_number.rejected, (state, action) => {
        state.success = false;
        state.data = [];
        state.totalPages = 1;
        console.log("Erro ao buscar OS:", action.payload?.errors[0] || "Erro Desconhecido.");
        state.error = { message: action.payload?.errors[0] || "Erro Desconhecido." };
        state.loading = false;
        state.message = null;
        state.termId = true;
      })
      .addCase(getOsByArgumentsString.pending, (state) => {
        state.success = false;
        state.error = null;
        state.loading = true;
        state.message = null;
        state.data = [];
      })
      .addCase(getOsByArgumentsString.fulfilled, (state, action) => {
        state.success = true;
        state.error = null;
        state.loading = false;
        state.message = "OS's encontradas com sucesso.";
        // Aqui você pode adicionar a lógica para atualizar o estado com os dados das OS's encontradas
        console.log("OS's encontradas:", action.payload);
        state.data = action.payload.data; // Atualiza o estado com as OS's encontradas
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      // Create new OS
      .addCase(createOs.pending, (state) => {
        state.success = false;
        state.error = null;
        state.loading = true;
        state.message = null;
      })
      .addCase(createOs.fulfilled, (state, action) => {
        //console.log("A resposta da API veio com sucesso!")
        state.success = true;
        state.error = null;
        state.loading = false;
        state.message = action.payload.message;
        if(action.payload.os){
          console.log("Resultado da OS:", action.payload.os);
          console.log("Resultado message: ", action.payload.message);
          state.data.push(action.payload.os);
        }
        if(action.payload.message){
          state.error = { message: action.payload.message };
        }
      })
      .addCase(createOs.rejected, (state, action) => {
        console.log("A resposta da API veio com erro!")
        state.success = false;
        state.error = { message: action.payload?.errors[0] || "Erro Desconhecido." };
        
        state.loading = false;
        state.message = null;
      })
      // Update data about OS.
      .addCase(updateOsDetails.pending, (state) => {
        state.success = false;
        state.error = null;
        state.loading = true;
        state.message = null;
      })
      .addCase(updateOsDetails.fulfilled, (state, action) => {
        state.success = true;
        state.error = null;
        state.loading = false;
        state.message = action.payload.message;
        // Aqui você pode adicionar a lógica para atualizar o estado com os dados da OS atualizada
        console.log("OS atualizada:", action.payload.os);
        const updatedOs = action.payload.os;
        // Exemplo: Atualizar a OS no estado
        const index = state.data.findIndex(os => os.osId === updatedOs.osId);
        if (index !== -1) {
          state.data[index] = updatedOs; // Atualiza a OS existente
        } else {
          state.data.push(updatedOs); // Ou adiciona como nova se não existir
        }
      })
      .addCase(updateOsDetails.rejected, (state, action) => {
        state.success = false;
        state.error = { message: action.payload?.errors[0] || "Erro Desconhecido." };
        state.loading = false;
        state.message = null;
      });
  },
});

export default osSlice.reducer;
