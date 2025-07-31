import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { PayloadAction } from "@reduxjs/toolkit";
import authService from "../services/authService";
// import { AuthUserInterface } from "../interfaces/AuthSimpleInterface";

// interface AuthUserInterface {
//   userId: string;
//   name: string;
//   lastname: string;
//   email: string;
//   password: string;
//   laspassword?: string;
//   avaiable: boolean;
//   hash_recover_password?: string;
//   roleId: number;
//   token: string;
//   createdAt?: string;
//   updatedAt?: string;
// }
interface UserState {
  // user: Record<string, any> | null;
  user: userData | null; // O usuário pode ser nulo inicialmente
  success: boolean;
  error?: { message: string } | null;
  isLoading: boolean;
  message: string | null;
}
// Tipo de resposta
interface RegisterUserResponse {
  user: AuthUserInterface;
  error?: string;
  message?: string;
}
// interface LoginErrorWithMessage {
//   message: string;
// }

interface RegisterUserResponseError {
  errors: string;
}

// interface LoginUserResponse {
//   token: string;
// }

interface userData {
  userId: number;
  name: string;
  lastname: string;
  email: string;
  avaiable: boolean;
  hash_recover_password?: string;
  roleId: number;
  token: string;
  createdAt?: string;
  updatedAt?: string;
}
interface LoginUserResponse {
  user?: userData;
  message: string;
  error?: string;
}
type LoginUserData = {
  email: string;
  password: string;
}
interface AuthUserInterface {
  userId: number;
  name: string;
  lastname: string;
  email: string;
  roleId: number;
  avaiable: boolean;
  createdAt?: string;
  updatedAt?: string;
  hash_recover_password?: string;
  token: string;
}

// message?: string

interface newUserData {
  name: string;
  lastname: string;
  email: string;
  password?: string;
}

// interface updateTimePasswordProps {
//   info_login: number | undefined;
//   password: string;
// }

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") as string) || {},
  success: false,
  error: null,
  isLoading: false,
  message: null,
};


// Slice de Login
export const loginUser = createAsyncThunk<
  LoginUserResponse, // Tipo de retorno, com user? e message.
  LoginUserData, // Dados de entrada
  { rejectValue: { errors: string[] } }
>("auth/loginUser", async (user, thunkAPI) => {
  try {
    const response = await authService.login(user);
    console.log("Resposta do login:", response);
    if (response.errors) {
      return thunkAPI.rejectWithValue({ errors: response.errors });
    } else if (response.user && response.user.token) {
      // Removendo os dados do localStorage
      if (localStorage.getItem("user")) {
        localStorage.removeItem("user");
      }
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", JSON.stringify(response.user.token));
      localStorage.setItem("error", "");
      return response;
    } else {
      return thunkAPI.rejectWithValue({
        errors: ["Usuário ou token inválido."],
      });
    }
  } catch (error: unknown) {
    console.error("Erro ao fazer login:", error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
});

export const registerUser = createAsyncThunk<
  // Tipos de sucesso, ou seja oque a API responde ao dar sucesso.
  // { message: string, user: Record<string, any> },
  // { user: Record<string, any> },
  RegisterUserResponse,
  // Dados retornados.
  newUserData,
  //{ rejectValue: { errors: string[] } }
  { rejectValue: RegisterUserResponseError }
>(
  "auth/registerUser",
  //async(user: Record<string, any>, thunkAPI) => {
  async (user, thunkAPI) => {
    //console.log('tentiva de registro: ' + user);
    try {
      const response = await authService.register(user);
      if (response.error) {
        console.log("ocorreram erros" + response.error);
        return thunkAPI.rejectWithValue({ errors: response.error });
      } else if (response.message) {
        if (localStorage.getItem("user")) {
          localStorage.removeItem("user");
        }
        localStorage.setItem("user", JSON.stringify(response.user));
        return { message: response.message, user: response.user };
      } else {
        throw new Error("Erro ao tentar registrar, desconhecido." + response);
      }
    } catch (error: unknown) {
      console.log(error);
      // Verifica se o erro é do tipo CustomError
      console.log("Erro ao realizar registro: " + error);
      return thunkAPI.rejectWithValue({ errors: "Erro Desconhecido." });
    }
  }
);
// export const updateTimePassword = createAsyncThunk<
//   // Tipos de sucesso, ou seja o que a API responde ao dar sucesso.
//   { message: string },
//   updateTimePasswordProps,
//   { rejectValue: { errors: string[] } }
// >(
//   "auth/updateTimePassword",
//   async (data: updateTimePasswordProps, thunkAPI) => {
//     try {
//       const response = await authService.updateTimePassword(data);
//       if (response.errors) {
//         return thunkAPI.rejectWithValue({ errors: response.errors });
//       } else if (response.message) {
//         return response;
//       }
//     } catch (error: any) {
//       if (error?.errors) {
//         return thunkAPI.rejectWithValue({ errors: error.errors });
//       } else {
//         return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
//       }
//     }
//   }
// );
// Slices de logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// Criando o Slice.
const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Registro de Conta.
      .addCase(registerUser.pending, (state) =>{
        state.isLoading = true;
        state.error = null;
        state.message = null;
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterUserResponse>) => {
        state.isLoading = false;
        state.message = null;
        state.error = null;
        if(action.payload.user){
          console.log(action.payload.user);
        }
        if(action.payload.message && action.payload.message.includes(
          "Usuário já existe"
        )){
          state.error = { message: action.payload.message };
          console.log(state.error);
          return;
        }
        if(action.payload.user){
          state.user = action.payload.user;
          // Removando os dados do localStorage
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", JSON.stringify(action.payload.user.token));
          state.message = 'Registro efetuado com sucesso!';
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = { message: action.payload?.errors || "Erro Desconhecido" };
        state.message = null;
        state.user = null;
      })
      // Login de Conta.
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
        state.user = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginUserResponse >) => {
        state.isLoading = false;
        state.error = null;
        state.message = null;
        console.log("erro na resposta da api e não erro na api: ", action.payload.error);
        // Caso login seja válido (usuário presente)
        state.user = action.payload.user || null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        const requisitionUser = JSON.stringify(action.payload.user);        
        localStorage.setItem("user", requisitionUser);
        const requisitionToken = JSON.stringify(action.payload.user?.token);
        if(requisitionToken){
          localStorage.setItem("token", requisitionToken);
          state.message = 'Login efetuado com sucesso!';
          state.success = true;
        }else{
          throw new Error("Erro ao tentar registrar, desconhecido.");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        console.log("resposta da tentantiva de login: ", action.payload);
        state.error = { message: action.payload?.errors[0] || "Erro Desconhecido" };
        state.message = null;
        state.user = null;
        state.success = false;
      })
  }
})

export default userSlice.reducer;
