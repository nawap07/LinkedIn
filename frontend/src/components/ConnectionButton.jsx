import React, { useContext, useEffect, useId, useState } from 'react'
import { authContext } from '../context/AuthContext'
import axios from 'axios'
import { io } from "socket.io-client"
import { userContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const socket = io("http://localhost:3000")

const ConnectionButton = ({ userId }) => {

    const { serverUrl } = useContext(authContext);
    const { userData, setUserData } = useContext(userContext);
    const [status, setStatus] = useState("")



    const navigate = useNavigate()
    
    const handleSendConnection = async () => {
        try {
            const res = await axios.post(`${serverUrl}/api/connection/send/${userId}`, {}, {
                withCredentials: true
            })
            setStatus(res.data.status)
        } catch (error) {
            console.log("HandleConnection error", error.message);

        }
    }
    const handleRemoveConnection = async () => {
        try {
            const res = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, {
                withCredentials: true
            })
            setStatus("connect")
        } catch (error) {
            console.log("handleRemoveConnection error", error.message);
        }
    }

    const handleGetStatus = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/connection/status/${userId}`, {
                withCredentials: true
            })
            setStatus(res.data.status)

        } catch (error) {
            console.log("handleconnectionStatus error", error.message);
        }
    }

    useEffect(() => {
        socket.emit("register", userData._id);
        handleGetStatus();

        socket.on("statusUpdate", ({ updateUserId, newStatus }) => {

            if (updateUserId === userId) {
                setStatus(newStatus)
            }
        })

        return () => {
            socket.off("statusUpdate")
        }
    }, [userId])

    const handleClick = async () => {
        if (status == "disconnect") {
            await handleRemoveConnection()
        } else if (status == "received") {
            navigate("/network")
        } else {
            await handleSendConnection()
        }
    }

    return (
        <div>
            <button disabled={status === "pending"} onClick={handleClick} className='cursor-pointer min-w-[100px] h-[40px] rounded-full border-2 border-[#0A66c2] text-[#0A66c2]'> {status}</button>
        </div>
    )
}

export default ConnectionButton