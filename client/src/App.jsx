import { Routes, Route } from "react-router";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup"
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <Home />
          }
        />
        
        <Route path="/signup" element={<Signup/>} />
        <Route path="/signin" element={<Login />} />
        <Route path="/profile" element={<Profile/>}/>

        {/* prevent user after login */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </>
  );
}

export default App;
