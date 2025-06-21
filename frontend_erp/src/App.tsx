// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useAuth } from "./hooks/useAuth";

// Pages Basics
// import { Home } from './pages/home/Home';
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import Home from "./pages/home/Home.tsx";
// import { About } from './pages/About';

function App() {
  // const [count, setCount] = useState(0)
  // Pegando o privilégio de usuário.
  const { roleUser } = useAuth();

  console.log(roleUser);

  return (
    <>
      <div className="App min-h-screen">
        <div className="w-screen h-screen">
          <BrowserRouter>
            <Routes>
              {/* <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/about" element={<h1>About Page</h1>} /> */}
              {!roleUser && (
                <>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </>
              )}
              {roleUser && (
                <Route path="/" element={<Home />} />
              )}
              <Route path="/register" element={<Register />} />
              {roleUser && roleUser[0] === "Admin" && (
                <Route path="/admin" element={<h1>Admin Page</h1>} />
              )}
              {roleUser && roleUser[0] === "Manager" && (
                <Route path="/manager" element={<h1>Manager Page</h1>} />
              )}
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </>
  );
}

export default App;
