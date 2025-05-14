import React, {useEffect, useState} from "react";
import NavbarComponent from "../components/NavbarComponent";
import { FaRegEdit } from "react-icons/fa";
import { getProfile, updateProfileInFirestore } from "../services/profileService";
import toast from "react-hot-toast";
import { auth } from "../firebase";

const Profile = () => {
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatedFName, setUpdatedFName] = useState("");
    const [updatedLName, setUpdatedLName] = useState("");

    useEffect(() =>{
        fetchProfile();
    }, []);

    const fetchProfile = async () =>{
        try{
            const profileData = await getProfile();
            setProfile(profileData);
        } catch (error){
            toast.error("Failed to load profile.");
        } finally{
            setLoading(false);
        }
    };

    const handleEdit = (profile) =>{
        setUpdatedFName(profile.firstName);
        setUpdatedLName(profile.lastName);
        document.getElementById("update-modal").showModal();
    };

    const handleUpdateProfile = async () =>{
        const user = auth.currentUser;
        if (!user) return;
        try{
            await updateProfileInFirestore(user.uid,{
                firstName: updatedFName,
                lastName: updatedLName,
            });
            toast.success("Profile updated successfully!");
            fetchProfile();
            document.getElementById("update-modal").close();
        }catch (error){
            toast.error("Failed to update profile.");
            console.error("Error updating profile:", error);
        }
    }

    return (
        <div className="h-full">
            {/* navbar component */}
            <NavbarComponent />

            {/** profile */}
            <div className="pt-20">

            <h1 className="text-xl font-semibold mb-2 text-center w-full">Profile</h1>

            {loading && <p className="text-gray-600">Loading profile...</p>}

                {!loading && profile ? (
                    <div key={profile.id} className="flex flex-col gap-2 mt-2 p-3 text-black rounded-md shadow-md">
                        <h3 className="text-sm font-semibold mb-1">First Name</h3>
                        <h1 className="text-xl font-semibold mb-2">{profile.firstName}</h1>
                        <h3 className="text-sm font-semibold mb-1">Last Name</h3>
                        <h1 className="text-xl font-semibold mb-2">{profile.lastName}</h1>
                        <div className="flex w-full justify-end items-center gap-4 mt-4">
                            <button className="btn btn-primary text-white bg-green-600 flex gap-1 px-3" onClick={() => handleEdit(profile)}>
                                <FaRegEdit className="text-base"/>
                                Edit
                            </button>
                        </div>
                    </div>
                ):(
                    !loading && <p>No profile found.</p>
                )}

                <dialog id="update-modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Update Profile</h3>
                        <div className="py-4">
                            <label className="block text-gray-700 font-medium">First Name</label>
                            <input type="text" className="input input-bordered w-full" value={updatedFName} onChange={(e) => setUpdatedFName(e.target.value)}/>

                            <label className="block text-gray-700 font-medium">Last Name</label>
                            <input type="text" className="input input-bordered w-full" value={updatedLName} onChange={(e) => setUpdatedLName(e.target.value)}/>
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-primary text-white" onClick={handleUpdateProfile}>
                                Save Changes
                            </button>
                            <button className="btn" onClick={() => document.getElementById("update-modal").close()}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default Profile;
