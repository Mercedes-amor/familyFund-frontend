//Componentes de React
import { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeContext } from "./context/themeContext.jsx";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

//Pages
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Servidor from "./pages/Servidor";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories.jsx";
import CategoryCompare from "./pages/CategoryCompare.jsx";
import SavingsList from "./pages/SavingsList.jsx";
import Goals from "./pages/Goals.jsx";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";

// import { ThemeContext } from "./context/ThemeContext";

function App() {
  const { isThemeDark} =
    useContext(ThemeContext);

  return (
    <div
      className={`app-container ${isThemeDark ? "theme-dark" : "theme-light"}`}
    >
      <Navbar />

      <div className="routes-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<Servidor />} />
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category-compare/:id"
            element={
              <ProtectedRoute>
                <CategoryCompare />
              </ProtectedRoute>
            }
          />
          <Route
            path="/savings-list/:familyId"
            element={
              <ProtectedRoute>
                <SavingsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {/* Espacio para el Toast */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        style={{ marginTop: "200px" }}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        containerId="global-toast" // identificador
        toastClassName="custom-toast" // para personalizar CSS
        bodyClassName="custom-toast-body"
      />
      <Footer />
    </div>
  );
}

export default App;
