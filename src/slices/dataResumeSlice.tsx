import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import resumeService from "../services/dataResumeService";
import {
  type resumeStatusResponse
} from "../interfaces/summaryInterface";

interface ResumeStatus {
  data: resumeStatusResponse[];
}

interface resumeUsersResponse {
  userId: number;
  name: string;
  lastname: string;
  avaiable: boolean;
  roleId: 1;
  createdAt: string;
  updatedAt: string;
  email: string;
  role?: {
    name: string;
  };
}

interface ResumeUsers {
  count: number;
  rows: resumeUsersResponse[];
}

// Interface de inicialização
interface summaryResume {
  dataResume: ResumeStatus;
  dataResume1: ResumeUsers;
  dataResume2?: string;
  success: boolean;
  loading: boolean;
  message: string | null;
  error?: { message: string } | null;
}

const initialState: summaryResume = {
  dataResume: { data: [] as resumeStatusResponse[] },
  dataResume1: { count: 0, rows: [] as resumeUsersResponse[] },
  dataResume2: "",
  success: false,
  loading: false,
  message: null,
  error: null,
};

// Construção do Slice
export const getDataResume = createAsyncThunk<
  ResumeStatus,
  void,
  { rejectValue: { errors: string[] } }
>("os/summaryResume", async (_, thunkAPI) => {
  try {
    const response = await resumeService.getResumeStatus();
    return response;
  } catch (error: unknown) {
    console.log(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
});
export const getResumeUsers = createAsyncThunk<
  ResumeUsers,
  void,
  { rejectValue: { errors: string[] } }
>("users/summaryResume", async (_, thunkAPI) => {
  try {
    const response = await resumeService.getResumeUsers();
    return response;
  } catch (error: unknown) {
    console.log(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
});

// Criando o Slice
const dataResumeSlice = createSlice({
  name: "dataResume",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Actions to obtain the summary of Os
      .addCase(getDataResume.pending, (state) => {
        state.dataResume = { data: [] };
        state.success = false;
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getDataResume.fulfilled, (state, action) => {
        state.dataResume = action.payload;
        state.success = true;
        state.loading = false;
        state.error = null;
        state.message = null;
      })
      .addCase(getDataResume.rejected, (state, action) => {
        state.dataResume = { data: [] };
        state.success = false;
        state.loading = false;
        state.error = {
          message: action.payload?.errors[0] || "Erro Desconhecido.",
        };
        state.message = null;
      })
      // Actions to obtain the summary of Users
      .addCase(getResumeUsers.pending, (state) => {
        state.dataResume1 = { count: 0, rows: [] };
        state.success = false;
        state.loading = true;
        state.message = null;
      })
      .addCase(getResumeUsers.fulfilled, (state, action) => {
        if(action.payload.rows &&action.payload.rows.length <= 0) {
          console.log('Nenhum usuário encontrado.');
          console.log(action.payload)
        }
        state.dataResume1 = action.payload;
        state.success = true;
        state.loading = false;
        state.error = null;
        state.message = null;
      })
      .addCase(getResumeUsers.rejected, (state, action) => {
        state.dataResume1 = { count: 0, rows: [] };
        state.success = false;
        state.loading = false;
        state.error = {
          message: action.payload?.errors[0] || "Erro Desconhecido.",
        };
        state.message = null;
      });
  },
});

export default dataResumeSlice.reducer;
