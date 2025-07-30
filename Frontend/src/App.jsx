import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, checkAuth, isLoading } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"></Loader>
      </div>
    );
  }

  return (
    <div className="">
      <Navbar></Navbar>

      <Routes>
        <Route
          path="/"
          element={
            user ? <HomePage></HomePage> : <Navigate to="/login"></Navigate>
          }
        ></Route>
        <Route
          path="/login"
          element={!user ? <Login></Login> : <Navigate to="/"></Navigate>}
        ></Route>
        <Route
          path="/signup"
          element={!user ? <SignUp></SignUp> : <Navigate to="/"></Navigate>}
        ></Route>
        <Route
          path="/profile"
          element={
            user ? <Profile></Profile> : <Navigate to="/login"></Navigate>
          }
        ></Route>
        <Route path="/settings" element={<Settings></Settings>}></Route>
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
