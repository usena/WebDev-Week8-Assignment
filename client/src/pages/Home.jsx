import React from "react";
import NavbarComponent from "../components/NavbarComponent";
import AddTaskComponent from "../components/AddTaskComponent";
import MyTaskComponent from "../components/MyTaskComponent";

const Home = () => {
    return (
        <div className="h-full">
        {/* navbar component */}
        <NavbarComponent />

        {/* task container */}
        <div className="flex w-full h-full gap-8 pt-20 pb-4 px-6">
            {/* add task component */}
            <AddTaskComponent />

            {/* my task component */}
            <div className="flex flex-col gap-3 flex-3/4 bg-blue-100 rounded-md p-4">
            <h1 className="text-blue-900 font-semibold text-lg">My Tasks</h1>
            <MyTaskComponent />
            </div>
        </div>
        </div>
    );
};

export default Home;
