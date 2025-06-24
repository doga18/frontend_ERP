// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// import { useAuth } from "./hooks/useAuth";

// Pages Basics
// import { Home } from './pages/home/Home';
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import Home from "./pages/home/Home.tsx";
// import { About } from './pages/About';

// Importando os layout dependendo da autenticação do usuário /// Pages
import MainLayout from "./components/MainLayout.tsx";
import AuthLayout from "./components/AuthLayoyt.tsx";

function App() {
  // const [count, setCount] = useState(0)
  // Pegando o privilégio de usuário.
  // const { roleUser } = useAuth();

  return (
    <>
      <div className="App min-h-screen">
        <div className="w-screen h-screen">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <MainLayout >
                    <Home />
                  </MainLayout>
                }
              />
                {/* Rotas com AuthLayout */}
              <Route 
                path="/login"
                element={
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                }
              />
              <Route 
                path="/register"
                element={
                  <AuthLayout>
                    <Register />
                  </AuthLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
}

export default App;
