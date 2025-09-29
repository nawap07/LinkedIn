import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useContext } from 'react'
import { authContext } from '../context/AuthContext'
import dp from "../assets/dp.png"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";

const Network = () => {
  const { serverUrl } = useContext(authContext)
  const [connection, setConnection] = useState([]);

  const handleGetRequest = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/connection/requests`, {
        withCredentials: true
      })
      setConnection(res.data)
      console.log(res?.data);

    } catch (error) {
      console.log("HandleRequest error", error.message);
    }
  }

  const handleAccepctConnection = async (requestId) => {
    try {
      const res = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`, {}, {
        withCredentials: true
      })
      setConnection(connection.filter((con) => con._id !== requestId))
      console.log(res);

    } catch (error) {
      console.log("Handle Accecpt Connection error", error.message);
    }
  }

  const handleRejectionConnection = async (requestId) => {
    try {
      let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {}, {
        withCredentials: true
      })
      setConnection(connection.filter((con) => con._id !== requestId))

      console.log(result);
    } catch (error) {
      console.log("HandleRejection error", error.message);
    }
  }

  useEffect(() => {
    handleGetRequest();
  }, [])
  return (
    <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex items-center flex-col gap-[40px]'>
      <Navbar />
      <div className="w-full h-[70px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[20px]">
        Invitations : {connection.length}
      </div>

      {
        connection.length > 0 && <div className="w-[100%] min-h-[70px] max-w-[900px] shadow-lg rounded-lg flex flex-col gap-[20px]">
          {connection.map((conn, index) => (
            <div className="w-full min-h-[70px] flex justify-between items-center p-[20px] bg-white shadow-lg rounded-lg"  key={index}>
              <div className=" flex items-center justify-center gap-[20px]">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer">
                  <img src={conn.sender.profileImage || dp} alt="profile" className='w-full h-full' />
                </div>
                <div className="">
                  {`${conn.sender.firstName} ${conn.sender.lastName}`}
                </div>
              </div>
              <div className="flex items-center justify-center gap-[10px]">
                <button className='text-[#0A66c2] cursor-pointer' onClick={() => handleAccepctConnection(conn._id)}> <IoIosCheckmarkCircleOutline size={40} /> </button>
                <button className='text-[#ec540d] cursor-pointer' onClick={() => handleRejectionConnection(conn._id)}><RxCrossCircled size={38} /></button>
              </div>
            </div>
          ))}
        </div>
      }

    </div>
  )
}

export default Network