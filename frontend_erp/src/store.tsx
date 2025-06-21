import { configureStore } from '@reduxjs/toolkit';
// import exampleReducer from './exampleSlice';
import authReducer from './slices/authSlice';
// import userReducer from './slices/userSlice';
// import companyReducer from './slices/companySlice';
// import companyDetailReducer from './slices/companyDetailsSlice';
// import userReducer from './slices/userSlice';
// import clientReducer from './slices/clientsSlice';
// import osServices from './slices/osSlice';

export const store = configureStore({
  reducer: {
  // example: exampleReducer, // Adicione seus reducers aqui
  auth: authReducer,
  // company: companyReducer,
  // companyDetail: companyDetailReducer,
  // user: userReducer,
  // client: clientReducer,
  // os: osServices,  // Adicione os reducers dos serviços operacionais aqui
  },
});

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
