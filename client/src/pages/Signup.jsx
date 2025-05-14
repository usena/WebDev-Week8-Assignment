import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, NavLink } from "react-router-dom";
import NavbarComponent from "../components/NavBar";
import axios from 'axios';
import { AppContent } from "../context/AppContext";

const Signup = () => {
    const navigate = useNavigate();

    const [personalID, setPersonalID] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {backendUrl, setIsLoggedin} = useContext(AppContent)

    const handleEmailSignup = async (e) => {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + '/service/user/signup', {personalID, name, email, password, confirmPassword})
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
            Create a new account!
            </h1>
            <form className="flex flex-col gap-3 w-80" onSubmit={handleEmailSignup}>
                <input
                type="text"
                placeholder="Personal ID"
                value={personalID}
                onChange={(e) => setPersonalID(e.target.value)}
                className="border p-2 rounded-md"
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded-md"
            />
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
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 rounded-md"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
                Signup
            </button>
            </form>

            <span className="my-4 text-sm font-bold text-grey-600">
            Already have an account?
            <NavLink to="/signin" className="text-blue-800 hover:underline ml-1">Signin</NavLink>
            </span>
        </div>
        </>
    );
};

export default Signup;
