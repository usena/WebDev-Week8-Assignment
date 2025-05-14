import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import { useNavigate, NavLink } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import NavbarComponent from "../components/NavbarComponent";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailLogin = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
        toast.error("Email and password cannot blank!");
        return;
        }

        try {
        await loginWithEmail(email, password);
        toast.success("Login success!");
        navigate("/");
        } catch (error) {
        toast.error("Invalid authentication!");
        }
    };

    const handleGoogleLogin = async () => {
        try {
        await loginWithGoogle();
        toast.success("Login via google successfully!");
        navigate("/");
        } catch (error) {
        toast.error("Google login error");
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            navigate("/");
        }
        });
    }, [navigate]);

    return (
        <>
        <NavbarComponent />
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-lg text-blue-800 font-semibold mb-4">
            Please login!
            </h1>
            <form className="flex flex-col gap-3 w-80" onSubmit={handleEmailLogin}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded-md"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded-md"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
                Login
            </button>
            </form>

            <span className="my-4 text-sm font-bold text-grey-600">
            Do not have an account?
            <NavLink to="/signup" className="text-blue-800 hover:underline ml-1">Signup</NavLink>
            </span>

            <span className="my-4 text-sm font-bold text-blue-600">
            --- Or ---
            </span>

            <button
            onClick={handleGoogleLogin}
            className="bg-blue-600 text-white text-sm px-3 py-2 rounded-md hover:bg-blue-700 transition"
            >
            Login with Google
            </button>
        </div>
        </>
    );
};

export default Login;
