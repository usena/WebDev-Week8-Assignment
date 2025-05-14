import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, NavLink } from "react-router-dom";
import NavbarComponent from "../components/NavBar";
import { AppContent } from "../context/AppContext";
import axios from 'axios';


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {backendUrl, setIsLoggedin} = useContext(AppContent)

    const handleEmailLogin = async (e) => {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + '/service/user/signin', {email, password})
            if(data.success){
                setIsLoggedin(true)
                navigate('/')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

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
        </div>
        </>
    );
};

export default Login;
