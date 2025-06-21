import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
  error: string | null;
  isLoading: boolean;
  message: string | null;
}
// Tipo de resposta
interface RegisterUserResponse {
  message: string;
  // user: Record<string, AuthUserInterface>;
  user: AuthUserInterface;
}

interface RegisterUserResponseError {
  errors: string[];
}

interface LoginUserResponse {
  token: string;
}

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
interface AuthUserInterface {
  user: userData;
  message: string;
  errors?: string[];
}

interface newUserData {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password?: string;
  cpf: string;
  rg?: string;
}

interface updateTimePasswordProps {
  info_login: number | undefined;
  password: string;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") as string) || {},
  success: false,
  error: null,
  isLoading: false,
  message: null,
};


// Slice de Login
export const loginUser = createAsyncThunk<
  AuthUserInterface,
  { email: string; password: string },
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
      if (response.errors) {
        console.log("ocorreram erros" + response.errors);
        return thunkAPI.rejectWithValue({ errors: response.errors });
      } else if (response.message) {
        if (localStorage.getItem("user")) {
          localStorage.removeItem("user");
        }
        localStorage.setItem("user", JSON.stringify(response.user));
        return { message: response.message, user: response.user };
      } else {
        throw new Error("Erro ao tentar registrar, desconhecido." + response);
      }
    } catch (error: any) {
      console.log(error);
      // Verifica se o erro é do tipo CustomError
      console.log("Caiu no catch");
      console.log(error?.errors[0]);
      if (error?.errors) {
        return thunkAPI.rejectWithValue({ errors: error.errors });
      } else {
        return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
      }
    }
  }
);
export const updateTimePassword = createAsyncThunk<
  // Tipos de sucesso, ou seja o que a API responde ao dar sucesso.
  { message: string },
  updateTimePasswordProps,
  { rejectValue: { errors: string[] } }
>(
  "auth/updateTimePassword",
  async (data: updateTimePasswordProps, thunkAPI) => {
    try {
      const response = await authService.updateTimePassword(data);
      if (response.errors) {
        return thunkAPI.rejectWithValue({ errors: response.errors });
      } else if (response.message) {
        return response;
      }
    } catch (error: any) {
      if (error?.errors) {
        return thunkAPI.rejectWithValue({ errors: error.errors });
      } else {
        return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
      }
    }
  }
);
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
      // Add Cases Relacionados ao registerUser
      .addCase(registerUser.pending, (state) => {
        state.user = null; // Limpa o usuário antes de registrar
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        registerUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            message?: string;
            // user?: Record<string, AuthUserInterface>;
            user?: AuthUserInterface | undefined;
            errors?: string[0];
          }>
        ) => {
          state.isLoading = false;
          state.success = true;
          if (action.payload.errors && action.payload.errors.length > 0) {
            state.error = action.payload.errors[0];
          } else {
            state.error = null;
            state.user = action.payload || null; // Garante que `user` tenha um valor padrão
          }
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload?.errors[0] || "Erro Desconhecido.";
      })
      // Add Cases Relacionados ao loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthUserInterface | undefined>) => {
          state.isLoading = false;
          state.success = true;
          if (action.payload?.errors && action.payload.errors.length > 0) {
            state.error = action.payload.errors[0];
          } else if (action.payload && action.payload.user) {
            state.error = null;
            // Armazenando o usuário e o token no localStorage
            // if (action.payload.user.token) {
            //   localStorage.setItem("token", action.payload.user.token);
            //   localStorage.setItem("user", JSON.stringify(action.payload.user.userId))
            // }
            state.user = action.payload || null; // Garante que `user` tenha um valor padrão
            state.message = action.payload.message || null;
          } else {
            state.error = "Usuário ou token inválido.";
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload?.errors[0] || "Erro Desconhecido.";
      })
      .addCase(updateTimePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
        state.success = false;
      })
      .addCase(
        updateTimePassword.fulfilled,
        (
          state,
          action: PayloadAction<{ message?: string; errors?: string[0] }>
        ) => {
          state.isLoading = false;
          state.success = true;
          if (action.payload.errors && action.payload.errors.length > 0) {
            state.error = action.payload.errors[0];
          } else {
            state.error = null;
            state.message = action.payload?.message || "";
          }
        }
      )
      .addCase(updateTimePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload?.errors[0] || "Erro Desconhecido.";
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.success = false;
        state.error = null;
        state.message = null;
        state.user = {};
      });
  },
});

export default userSlice.reducer;
