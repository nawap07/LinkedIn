'use client'
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { authContext } from '../context/AuthContext'
import axios from 'axios';
import dp from "../assets/dp.png"
import { RxCrossCircled } from "react-icons/rx";
import toast from 'react-hot-toast';

const Notification = () => {
    const { serverUrl } = useContext(authContext);
    const [notificationData, setNotificationData] = useState([]);

    const handleGetNotification = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/notification/get`, {
                withCredentials: true
            })
            setNotificationData(res.data)
        } catch (error) {
            console.log(error.message);

        }
    }

    const singledeleteNotification = async (id) => {
        try {
            await axios.delete(`${serverUrl}/api/notification/deleteone/${id}`, { withCredentials: true })
            await handleGetNotification()
            toast.success("Notification delete", {
                position: "top-right"
            })
        } catch (error) {
            console.log(error.message);
        }
    }
    const cleardeleteNotification = async (id) => {
        try {
            await axios.delete(`${serverUrl}/api/notification`, { withCredentials: true })
            await handleGetNotification()
            toast.success("Clear all notification", {
                position: "top-right"
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    function handleMessage(type) {
        if (type == "like") {
            return "liked your post";
        } else if (type == "comment") {
            return "commented on your post"
        } else {
            return "accect your connection"
        }
    }

    useEffect(() => {
        handleGetNotification()
    }, [])
    return (
        <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex items-center flex-col gap-[40px]'>
            <Navbar />
            <div className="w-full h-[70px] bg-white shadow-lg rounded-lg flex items-center justify-around p-[10px] text-[20px]">
                Notifications : {notificationData.length}
                {notificationData.length &&
                    <div className="text-red-400 p-[10px] cursor-pointer rounded-lg border border-red-400 text-[14px]" onClick={cleardeleteNotification}>Clear all</div>

                }

            </div>


            {
                notificationData.length > 0 && <div className="w-[100%] overflow-auto h-[100vh] max-w-[900px]  rounded-lg flex flex-col gap-[5px] p-[20px]">
                    {notificationData.map((noti, index) => (
                        <div className="w-full lg:min-w-[600px] min-h-[50px] flex justify-between items-center p-[20px] bg-white  rounded-lg gap-[5px]" key={index}>
                            <div className=" flex items-center justify-center gap-[20px]">
                                <div className="w-[30px] h-[30px] rounded-full overflow-hidden cursor-pointer">
                                    <img src={noti.relatedUser.profileImage || dp} alt="profile" className='w-full h-full' />
                                </div>
                                <div className="text-[14px] ">
                                    {`${noti.relatedUser.firstName} ${noti.relatedUser.lastName} ${handleMessage(noti.type)}`}
                                    
                                </div>

                            </div>

                            {
                                noti.reletedPost && <div className="flex  items-center gap-[10px]">
                                    <div className="w-[40px] h-[40px] rounded-full  overflow-hidden">
                                        <img src={noti.reletedPost.image} alt="UserPost" className='w-full h-full' />
                                    </div>
                                </div>
                            }

                            <div className="cursor-pointer" onClick={() => singledeleteNotification(noti._id)}> <RxCrossCircled size={30} color='#fc0303' /></div>


                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default Notification