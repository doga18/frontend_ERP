// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
// import { useAuth } from "./hooks/useAuth";
import { PrivateRoute } from './components/PrivateRoute.tsx';

// Pages Basics
// import { Home } from './pages/home/Home';
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import Home from "./pages/home/Home.tsx";
import Clients from "./pages/client/Clients.tsx";
import Os from "./pages/os/Os.tsx";
import Admin from "./pages/admin/Admin.tsx";
import UserProfile from './pages/user/UserProfile.tsx';
import UserSettings from './pages/user/UserSettings.tsx';
import Notifications from './pages/notifications/Notifications.tsx';
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
        <div className="h-screen">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <MainLayout >
                      <Home />
                    </MainLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <MainLayout >
                    <Home />
                  </MainLayout>
                }
              />
              <Route
                path="/os"
                element={
                  <MainLayout >
                    <Os />
                  </MainLayout>
                }
              />
              <Route
                path="/admin"
                element={
                  <MainLayout >
                    <Admin />
                  </MainLayout>
                }
              />
              <Route
                path="/clients"
                element={
                  <MainLayout >
                    <Clients />
                  </MainLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <MainLayout >
                    <UserProfile />
                  </MainLayout>
                }
              />
              <Route
                path='/settings'
                element={
                  <MainLayout >
                    <UserSettings />
                  </MainLayout>
                }
              />
              <Route
                path='/notifications'
                element={
                  <MainLayout >
                    <Notifications />
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
