import React from "react";
// Importando as Pages para montar o dashboard
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavBar from "./NavBar";

// Importando o tratamento do dispatch.
import { useAuth } from "../hooks/useAuthBACKUP";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  //const { auth, loading, roleUser, user } = useAuth();
  const { auth, loading } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  const handleLogout = async () => {
    // Realizando o logout do usuário.
    dispatch(logout());
    //navigate('/login');
  };

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {auth && (
        <div>
          <NavBar logout={handleLogout} />
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      )}
      {!auth && (
        <div>
          <div className="forbidden">
            <span className="title_forbidden">Acesso Restrito</span>
            <p className="text-white">
              Ops ocorreu um erro, essa página requer autenticação.
            </p>
            <button className="btn" onClick={handleGoLogin}>
              Tente realizar um novo Loguin
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainLayout;
