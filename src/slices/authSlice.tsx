import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import authService from "../services/authService";
import type { newUserByAnother, userDataEdit } from '../interfaces/AuthUserInterface';

interface UserState {
  // user: Record<string, any> | null;
  user: userData | null; // O usuário pode ser nulo inicialmente
  success: boolean;
  error?: { message: string } | null;
  isLoading: boolean;
  authenticated?: boolean;
  message: string | null;
  userSelected: userData | null
  usersList: userData[] | null
  totalUsers: number
}
// Tipo de resposta
interface RegisterUserResponse {
  user: AuthUserInterface;
  error?: string;
  message?: string;
}

interface RegisterNewUserByAnother {
  error?: string;
  user?: userData;
  message?: string;
}

interface RegisterUserResponseError {
  errors: string;
}

interface userData {
  userId: number;
  name: string;
  lastname: string;
  email: string;
  avaiable: boolean;
  hash_recover_password?: string;
  roleId: number;
  role?: {
    name: string
  }
  token?: string;
  createdAt?: string;
  updatedAt?: string;
  files?: [
    {
      fileName: string;
      fileUrl: string;
    }
  ]
}
interface ResponseListUsersAndCount {
  count: number
  rows: userData[]
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
  files: [
    {
      fileName: string;
      fileUrl: string;
    }
  ]
}

interface newUserData {
  name: string;
  lastname: string;
  email: string;
  password?: string;
}

interface UserAuthenticaded {
  message: string;
  user?: userData;
  error?: string;
}

// interface updateTimePasswordProps {
//   info_login: number | undefined;
//   password: string;
// }

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") as string) || null,
  success: false,
  error: null,
  isLoading: false,
  message: null,
  authenticated: true,
  userSelected: null,
  usersList: null,
  totalUsers: 0
};
//console.log('User localizado no localstorage: ', initialState.user?.userId);

// Slice Get all Users and Count
export const getAllUsersAndCount = createAsyncThunk<
  ResponseListUsersAndCount,
  void,
  { rejectValue: { errors: string[] } }
>("auth/getAllUsersAndCount", async (_, thunkAPI) => {
  try {
    const response = await authService.getAllUsersAndCount();
    return response;
  } catch (error: unknown) {
    console.log(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
})
// Slice GetUserById
export const getUserById = createAsyncThunk<
  userData,
  number,
  { rejectValue: { errors: string[] } }
>("auth/getUserById", async (id: number, thunkAPI) => {
  try {
    const response = await authService.getUserById(id);
    return response;
  } catch (error: unknown) {
    console.log(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
})
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
export const registerUserByAnotherUser = createAsyncThunk<
  RegisterNewUserByAnother,
  newUserByAnother,
  { rejectValue: { errors: string[] } }
>("auth/registerUserByAnotherUser", async (user, thunkAPI) => {
  try {
    const response = await authService.registerByAnotherUser(user);
    if(response.error){
      console.log("Erro ao tentar registrar um novo usuário", response.error);
      return thunkAPI.rejectWithValue({ errors: response.error });
    } else if (response.message) {
      return response;
    } else {
      throw new Error("Erro ao tentar registrar, desconhecido." + response);
    }
  } catch (error: unknown) {
    console.log(error);
    // Verifica se o erro é do tipo CustomError
    console.log("Erro ao realizar registro: " + error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
});
// Validando o usuário logado
export const validUserLogged = createAsyncThunk<
  UserAuthenticaded,
  void,
  { rejectValue: { errors: string[] } }
>("auth/validUserLogged", async (_, thunkAPI) => {
  try {
    const response = await authService.validUserLogged();
    return response;
  } catch (error: unknown) {
    console.error("Erro ao validar usuário:", error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
})
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
// Edit user self
export const updateDataUserSelf = createAsyncThunk<
  { message: string },
  FormData,
  { rejectValue: { errors: string[] } }
>("auth/updateDataUserSelf", async (FormData, thunkAPI) => {
  // Extraindo o userID do formData para usar no link...
  try {
    const response = await authService.updateDataUserSelf(FormData);
    if (response.errors) {
      return thunkAPI.rejectWithValue({ errors: response.errors });
    } else if (response.message) {
      return response;
    }
  } catch (error: unknown) {
    console.log(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
});
// Edit User
export const updateDataUser = createAsyncThunk<
  { message: string, user?: userData },
  userDataEdit,
  { rejectValue: { errors: string[], message?: string } }
>("auth/updateDataUser", async (data, thunkAPI) => {
  try {
    const response = await authService.updateDataUser(data);
    if (response.errors) {
      return thunkAPI.rejectWithValue({ errors: response.errors });
    } else if (response.message) {
      console.log(response.message);
      return response;
    }
  } catch (error: unknown) {
    console.log(error);
    return thunkAPI.rejectWithValue({ errors: ["Erro Desconhecido."] });
  }
});


// Criando o Slice.
const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // EditDataUser
      .addCase(updateDataUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateDataUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        console.log("Resposta do payload na edição do usuário:", action.payload);
        //console.log("Listando os usuário presentes: ", state.usersList);
        if(action.payload.message){
          if(action.payload.message.includes("sucesso")){
            state.message = action.payload.message;
            state.success = true;
            // Atualizando os dados da list
            const updateUsers = action.payload.user?.userId
            state.usersList = (state.usersList ?? []).map((user) => {
              if (user.userId === updateUsers) {
                return { ...user, ...action.payload.user };
              }
              return user;
            })
          }else if (action.payload.message.includes("Você não tem permissão")){
            state.message = null;
            state.error = {
              message: action.payload.message
            }
            state.success = false;
          }
        }
      })
      .addCase(updateDataUser.rejected, (state, action) => {
        console.log("Resposta do rejeito na edição do usuário:", action.payload);
        state.isLoading = false;
        state.error = { message: action.payload?.errors[0] || "Erro Desconhecido." };
        console.log("Message de erro: ", action.payload);
        state.message = action.payload?.message ? action.payload.message : null;
        state.success = false;
      })
      // EditDataSelf
      .addCase(updateDataUserSelf.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateDataUserSelf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if(action.payload.message){
          if(action.payload.message.includes("sucesso")){
            state.message = action.payload.message;
            state.success = true;  
          }
          if(action.payload.message.includes("nova senha precisa ser diferente da senha atual")){
            state.message = null;
            state.error = {
              message: action.payload.message
            }
            state.success = false;  
          }
          if(action.payload.message.includes("diferente da última senha")) {
            state.message = null;
            state.error ={
              message: action.payload.message
            }
            state.success = false;  
          }
        }else{
          state.message = null;
          state.success = false;
        }
      })
      .addCase(updateDataUserSelf.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          message: action.payload?.errors[0] || "Erro Desconhecido.",
        };
        state.message = null;
      })
      // Get AllUsersAndCount
      .addCase(getAllUsersAndCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getAllUsersAndCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = null;
        state.usersList = action.payload.rows;
        state.totalUsers = action.payload.count;
      })
      .addCase(getAllUsersAndCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          message: action.payload?.errors[0] || "Erro Desconhecido.",
        };
        state.message = null;
        state.usersList = [];
        state.totalUsers = 0;
      })
      // Get UserById
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = null;
        state.userSelected = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          message: action.payload?.errors[0] || "Erro Desconhecido.",
        };
        state.message = null;
      })
      // Registro de Conta.
      .addCase(registerUser.pending, (state) =>{
        state.isLoading = true;
        state.error = null;
        state.message = null;
        state.user = null;
      })
      // Registro próprio de conta.
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
        state.authenticated = false;
        state.isLoading = false;
        state.error = { message: action.payload?.errors || "Erro Desconhecido" };
        state.message = null;
        state.user = null;
      })
      // Registro de conta por usuário de permissão maior
      .addCase(registerUserByAnotherUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
        state.user = null;
      })
      .addCase(registerUserByAnotherUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = "Cadastrado com sucesso.";
        if(action.payload?.message?.includes("sucesso") && state.usersList?.length){
          state.usersList?.push({
            userId: action.payload?.user?.userId ?? 0,
            name: action.payload?.user?.name ?? "",
            lastname: action.payload?.user?.lastname ?? "",
            email: action.payload?.user?.email ?? "",
            avaiable: action.payload?.user?.avaiable ?? false,
            hash_recover_password: action.payload?.user?.hash_recover_password ?? undefined,
            createdAt: action.payload?.user?.createdAt ?? "",
            updatedAt: action.payload?.user?.updatedAt ?? "",
            roleId: action.payload?.user?.roleId ?? 5,
            token: action.payload?.user?.token ?? "",
            role: {
              name:
                action.payload?.user?.roleId === 1 ? "Admin" :
                action.payload?.user?.roleId === 2 ? "Owner" :
                action.payload?.user?.roleId === 3 ? "Manager" :
                action.payload?.user?.roleId === 4 ? "Employee" :
                "Supplier"
            },
            files: [{ fileName: '', fileUrl: '' }]
          })
        }
      })
      .addCase(registerUserByAnotherUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = { message: action.payload?.errors[0] || "Erro Desconhecido" };
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
      .addCase(loginUser.fulfilled, (state, action) => {
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
          state.authenticated = true;
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
        state.authenticated = false;
      })
      // Validando o usuário logado.
      .addCase(validUserLogged.pending, (state) => {
        console.log("Validando pendente")
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(validUserLogged.fulfilled, (state, action) => {
        console.log("Sucesso na validação do usuário logado: ", action.payload);
        state.isLoading = false;
        state.error = null;
        state.message = null;
        state.authenticated = true;
        console.log('Payload do usuário autenticado:', action.payload);
        if(action.payload && action.payload?.user?.roleId){
          state.user = action.payload.user;
          console.log('Payload do usuário autenticado:', action.payload);
        }        
      })
      .addCase(validUserLogged.rejected, (state, action) => {
        console.log("falha na validação")
        state.isLoading = false;
        state.error = { message: action.payload?.errors[0] || "Erro Desconhecido" };
        state.message = null;
        state.authenticated = false;
      })
  }
})

export default userSlice.reducer;
