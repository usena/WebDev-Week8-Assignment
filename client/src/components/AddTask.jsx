import React, { useState } from "react";
import { addTaskToFirestore } from "../services/taskService";
import toast from "react-hot-toast";
import { auth } from "../firebase";

const AddTaskComponent = () => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!taskTitle.trim() || !taskDesc.trim()) {
        toast.error("Task title and description cannot be empty!");
        return;
        }

        const user = auth.currentUser;
        if (!user){
        toast.error("User not authenticated.");
        return;
        }

        setLoading(true);

        try {
        const newTask = {
            title: taskTitle,
            description: taskDesc,
            createdAt: new Date().toISOString(),
            userID: user.uid,
        };

        await addTaskToFirestore(newTask);

        setTaskTitle("");
        setTaskDesc("");
        toast.success("Task added successfully! Please refresh");
        } catch (err) {
        toast.error("Failed to add task. Please try again.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <>
        <div className="flex flex-1/4 flex-col gap-2 bg-blue-100 rounded-md p-4">
            <h1 className="text-blue-900 font-semibold text-lg">Add Your Task</h1>
            <form onSubmit={handleAddTask} className="flex flex-col gap-3">
            <input
                type="text"
                id="taskTitle"
                placeholder="Task Title..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="p-3 w-full text-white rounded-md border-gray-100 bg-blue-800 shadow-xs text-sm placeholder:text-gray-300"
            />

            <textarea
                id="taskDesc"
                cols="30"
                rows="12"
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                className="p-3 rounded-md text-sm w-full text-white border-gray-100 bg-blue-800 placeholder:text-gray-300 resize-none"
                placeholder="Write your task here..."
            ></textarea>

            <button
                type="submit"
                disabled={loading}
                className="btn w-full px-4 py-2 text-sm text-white rounded-md bg-blue-600 hover:bg-green-800 transition ease-in-out"
            >
                {loading ? "Saving..." : "Save"}
            </button>
            </form>
        </div>
        </>
    );
};

export default AddTaskComponent;
