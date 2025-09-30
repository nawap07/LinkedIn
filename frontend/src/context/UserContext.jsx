import React, { createContext, useContext, useEffect, useState } from 'react'
import { authContext } from './AuthContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
export const userContext = createContext({})
import { io } from "socket.io-client"

const socket = io("https://linkedin-backend-lz2h.onrender.com");

const UserContext = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const { serverUrl } = useContext(authContext);
    const [edit, setEdit] = useState(false);
    const [userPost, setUserPost] = useState([]);
    const [profileData, setProfileData] = useState([]);

    const navigate = useNavigate();



    const getCurrentUser = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/user/currentuser`, { withCredentials: true });
            setUserData(response.data.user);

        } catch (error) {
            console.log("GetCurrent User error", error.message);
            setUserData(null)
        }
    }

    const getAllPosts = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/post/getpost`, {
                withCredentials: true
            })
            setUserPost(response.data.post)
            // console.log((response.data.post));

        } catch (error) {
            console.log("Get all Posts error");
        }
    }

    const handleGetProfile = async (userName) => {
        try {
            const res = await axios.get(`${serverUrl}/api/user/profile/${userName}`, {
                withCredentials: true
            })
            setProfileData(res.data)
            navigate("/profile")
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        getCurrentUser(),
            getAllPosts();

    }, [])


    const value = {
        userData,
        setUserData,
        edit,
        setEdit,
        userPost,
        setUserPost,
        getAllPosts,
        handleGetProfile,
        profileData,
        setProfileData,
        socket
    }
    return (
        <userContext.Provider value={value}>
            {children}
        </userContext.Provider>
    )
}

export default UserContext