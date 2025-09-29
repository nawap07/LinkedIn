import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { FiCamera } from 'react-icons/fi'
import { FaCirclePlus } from 'react-icons/fa6'
import { userContext } from '../context/UserContext'
import { HiPencilSquare } from 'react-icons/hi2'
import EditProfile from '../components/EditProfile'
import dp from "../assets/dp.png"
import Post from '../components/Post'
import ConnectionButton from '../components/ConnectionButton'

const Profile = () => {
  const { userData, edit, setEdit, userPost, setUserPost, profileData, setProfileData, handleGetProfile } = useContext(userContext);
  const [profilePost, setProfilePost] = useState([]);

  useEffect(() => {
    setProfilePost(userPost.filter((post) => post.author._id == profileData._id))
  }, [profileData])

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center px-[10px] pt-[100px] gap-[10px] pb-[40px] '>
      <Navbar />
      {
        edit && <EditProfile />
      }
      <div className="w-full max-w-[900px] min-h-[100vh] flex  gap-[10px] flex-col  ">
        <div className="relative bg-white pb-[40px] rounded p-[10px] shadow-lg ">
          <div className="w-[100%]   h-[100px] bg-gray-400  rounded overflow-hidden flex items-center justify-center cursor-pointer " >
            <img src={profileData.coverImage || null} alt="cover_img" className=' w-full  ' />
            {
              profileData._id === userData._id && <FiCamera onClick={() => setEdit(true)} className='absolute w-[40px] top-[75px] right-[20px] text-[white] cursor-pointer' size={"22"} />
            }
          </div>
          <div className="w-[60px] h-[60px] cursor-pointer rounded-full overflow-hidden items-center justify-center absolute top-[70px] left-[45px]" >
            <img src={profileData.profileImage || dp} alt="" className='  h-full w-full' />
          </div>
          {
            profileData._id === userData._id && <div className=" w-[10px] h-[10px] cursor-pointer  absolute top-[108px] left-[90px]" onClick={() => setEdit(true)}><FaCirclePlus color='#0A66c2' />
            </div>
          }

          <div className="">
            <div className="">
              <div className="mt-[22px] pl-[20px] text-[25px] font-semibold text-gray-900">
                {`${profileData.firstName} ${profileData.lastName}`}
              </div>
              <div className="text-[17px] pl-[20px] text-gray-900">
                {profileData.headline || "MERN"}
              </div>
              <div className="text-[16px] pl-[20px] text-gray-900">
                {profileData.location}
              </div>
              <div className="text-[16px] pl-[20px] text-gray-900">
                {` ${profileData.connections.length} Connections`}
              </div>
            </div>
            {
              profileData._id == userData._id && <button className='flex items-center justify-center gap-3 min-w-[150px] ml-[10px] h-[35px] text-[15px] border border-[#0A66c2] my-[20px]  rounded-3xl px-5  cursor-pointer text-[#0A66c2]' onClick={() => setEdit(true)}>Edit Profile <HiPencilSquare size={20} /></button>
            }

            {
              profileData._id != userData._id && <div className="m-[20px]">
                <ConnectionButton userId={profileData._id} />
              </div>
            }
          </div>
        </div>

        <div className="w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg">
          {` Post (${profilePost.length})`}
        </div>
        {
          profilePost.map((post) => (
            <Post key={post._id} createdAt={post.createdAt} id={post._id} author={post.author} description={post.description} image={post.image} like={post.like} comment={post.comment} />
          ))
        }

        {
          userData.skills.length > 0 && <div className="w-full min-h-[100px] flex flex-col gap-[10px]  justify-center p-[20px] bg-white shadow-lg rounded-lg">
            <div className=' text-[22px] text-gray-800 font-semibold'>
              Skills
            </div>
            <div className="flex gap-[10px] lg:items-center p-[2px] lg:flex-row flex-col text-[20px] flex-wrap justify-start lg:ml-[20px] text-gray-600">
              {
                profileData.skills.map((skill, index) => (
                  <div className="text-[20px] text-gray-800" key={index}>
                    - {skill}
                  </div>
                ))
              }
              {
                profileData._id === userData._id && <button onClick={() => setEdit(true)} className='cursor-pointer min-w-[150px] h-[40px]  flex items-center justify-center text-[#0A66c2] lg:ml-[50px] mt-[10px] border-[#0A66c2] border-2 rounded-full px-5 text-[16px] font-semibold '>Add skills</button>
              }
            </div>
          </div>
        }

        {
          profileData.education.length > 0 && <div className="w-full min-h-[100px] flex flex-col gap-[25px]  justify-center p-[20px] bg-white shadow-lg rounded-lg">
            <div className=' text-[22px] text-gray-900 font-semibold'>
              Education
            </div>
            <div className="flex gap-[10px] min-w-[300px]  p-[2px]  text-[20px] flex-col items-start justify-start lg:ml-[20px] text-gray-600">
              {
                profileData.education.map((skill, index) => (
                  <div className="text-[20px] flex flex-col gap-[12px] text-gray-900 border-2 w-full p-4 rounded-lg border-[#0A66c2]" key={index}>
                    <div className="">College :  {skill.college}</div>
                    <div className="">Degree : {skill.degree}</div>
                    <div className="">Field of study : {skill.fieldOfStudy} </div>
                  </div>
                ))
              }
              {
                profileData._id === userData._id && <button onClick={() => setEdit(true)} className='cursor-pointer min-w-[150px] h-[40px]  flex items-center justify-center text-[#0A66c2]  border-[#0A66c2] border-2 rounded-full px-5 text-[16px] font-semibold mt-6'>Add education</button>
              }
            </div>
          </div>
        }
        {
          profileData.experience.length > 0 && <div className="w-full min-h-[100px] flex flex-col gap-[25px]  justify-center p-[20px] bg-white shadow-lg rounded-lg">
            <div className=' text-[22px] text-gray-800 font-semibold'>
              Experience
            </div>
            <div className="flex gap-[10px]   p-[2px]  text-[20px] flex-col items-start justify-start ml-[20px] text-gray-600">
              {
                profileData.experience.map((skill, index) => (
                  <div className="text-[20px] flex flex-col gap-[12px] text-gray-800 border-2 w-full p-4 rounded-lg border-[#0A66c2]" key={index}>
                    <div className="">Title :  {skill.title}</div>
                    <div className="">Company : {skill.company}</div>
                    <div className="">Description : {skill.description} </div>
                  </div>
                ))
              }
              {
                profileData._id === userData._id && <button onClick={() => setEdit(true)} className='cursor-pointer min-w-[150px] h-[40px]  flex items-center justify-center text-[#0A66c2]  border-[#0A66c2] border-2 rounded-full px-5 text-[16px] font-semibold mt-6'>Add Experience</button>
              }
            </div>
          </div>
        }


      </div>
    </div>
  )
}

export default Profile