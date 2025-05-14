import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router";
import Profile from "../pages/Profile";


const NavbarComponent = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    return (
        <nav className="flex w-full justify-between items-center bg-blue-200 shadow-md py-3 px-10 fixed">
        {/* Logo */}
        <NavLink to="/">
            <div className="flex gap-1 justify-center items-center cursor-pointer">
            <p className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition ease-in-out">
                Task List
            </p>
            </div>
        </NavLink>

        {/* Navigation Menu */}
        <div className="flex gap-6 justify-center items-center text-blue-900 font-semibold">
            {user ? (
            <div className="flex items-center gap-3">
                <NavLink to="/profile">
                {user.photoURL ? (
                    <img
                    src={user?.photoURL}
                    alt="profile"
                    className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-semibold">
                    {user.email.charAt(0).toUpperCase()}
                    </div>
                )}
                </NavLink>
            </div>
            ) : (
            <a
                href="/signin"
                className="bg-blue-800 text-white text-sm py-2 px-6 rounded-md hover:bg-green-700 transition ease-in-out"
            >
                Login
            </a>
            )}
        </div>
        </nav>
    );
};

export default NavbarComponent;
