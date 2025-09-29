import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import dp from "../assets/dp.png"
import { FaCirclePlus } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import { userContext } from '../context/UserContext';
import { HiPencilSquare } from "react-icons/hi2";
import EditProfile from '../components/EditProfile';
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import { useRef } from 'react';
import axios from 'axios';
import { authContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Post from '../components/Post';



const Home = () => {
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [description, setDescription] = useState("")
  const [uploadPost, setUploadPost] = useState(false)
  const [post, setPost] = useState(false)
  const [suggested, setSuggested] = useState([]);
  const { userData, setUserData, edit, setEdit, userPost, setUserPost, getAllPosts, handleGetProfile } = useContext(userContext);
  const { serverUrl } = useContext(authContext);

  const postImage = useRef();

  const hanlePostImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))

  }

  const handleUploadPost = async () => {
    if (description) {
      setUploadPost(true)
      setPost(true)
      try {
        const formdata = new FormData();
        formdata.append("description", description)
        if (backendImage) {
          formdata.append("image", backendImage)
        }
        const res = await axios.post(`${serverUrl}/api/post/create`, formdata, {
          withCredentials: true
        })
        console.log(res);
        toast.success("New post created", {
          position: "top-right"
        })
        setDescription("");
        setBackendImage("")
        setUploadPost(false)
        setPost(false)
      } catch (error) {
        console.log(error.message);
        toast.error(error.message, {
          position: "top-right"
        })
        setUploadPost(false)
        setPost(false)
      }
    } else {
      toast.error("Post or write somethings")
    }
  }

  const handleSuggestedUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/suggested`, {
        withCredentials: true
      })
      setSuggested(res.data)

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getAllPosts()
  }, [uploadPost])

  
  useEffect(() => {
    handleSuggestedUser();
  }, [])

  return (
    <div className='w-full min-h-[100vh] pb-[50px] bg-[#f0efe7] lg:pt-[90px] p-4  lg:px-[20px]  flex lg:flex-row  flex-col lg:items-start justify-center  md:items-center sm:items-center items-center gap-[20px] relative'>
      {edit && <EditProfile />}
      <Navbar />
      {/* left */}
      <div className='lg:w-[25%] w-full min-h-[200px] bg-white shadow-lg lg:mt-[0px] mt-[80px] md:mt-[100px] rounded-lg p-[10px] relative'>
        <div className="w-[100%]   h-[100px] bg-gray-400  rounded overflow-hidden flex items-center justify-center cursor-pointer " >
          <img src={userData.coverImage || null} alt="cover_img" className='w-full  ' />
          <FiCamera onClick={() => setEdit(true)} className='absolute w-[40px] top-[75px] right-[20px] text-[white] cursor-pointer' size={"22"} />
        </div>
        <div className="w-[60px] h-[60px] cursor-pointer rounded-full overflow-hidden items-center justify-center absolute top-[70px] left-[45px]" >
          <img src={userData.profileImage || dp} alt="" className='  h-full w-full' />
        </div>
        <div className=" w-[10px] h-[10px] cursor-pointer  absolute top-[108px] left-[90px]" onClick={() => setEdit(true)}><FaCirclePlus color='#0A66c2' />
        </div>

        <div className="">
          <div className="mt-[22px] pl-[20px] text-[20px] font-semibold text-gray-700">
            {`${userData.firstName} ${userData.lastName}`}
          </div>
          <div className="text-[12px] pl-[20px] text-gray-500">
            {userData.headline || "MERN"}
          </div>
          <div className="text-sm pl-[20px] text-gray-500">
            {userData.location}
          </div>
          <button className='flex items-center justify-center gap-3 lg:max-w-[300px] w-full h-[35px] text-[15px] border border-[#0A66c2] my-[20px]  rounded-3xl px-5  cursor-pointer text-[#0A66c2]' onClick={() => setEdit(true)}>Edit Profile <HiPencilSquare size={20} /></button>
        </div>

      </div>

      {/* //create post div */}

      {
        uploadPost && <div className="w-full   h-full bg-black fixed left-0 opacity-[0.5] z-[100] top-0"></div>
      }
      {
        uploadPost && <div className="flex items-start justify-start flex-col gap-[20px] w-[90%]  max-w-[500px] h-[500px] bg-white shadow-lg rounded-lg z-[200]   fixed top-[200px] lg:top-[70px] p-[20px]">
          <div className="absolute right-4 top-4 cursor-pointer ">
            <RxCross1 className='' size={25} onClick={() => setUploadPost(false)} />
          </div>
          <div className="flex items-center justify-start gap-[10px]">
            <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center overflow-hidden ">
              <img className='w-full h-full' src={userData.profileImage || dp} alt="" />
            </div>
            <div className="">{userData.firstName} {userData.lastName}</div>
          </div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`w-full ${frontendImage ? "h-[200px]" : "h-[550px]"}  text-[16px] outline-none p-[10px]  resize-none overflow-auto`} placeholder='What do you want to talk about'></textarea>
          <input type="file" accept='image/*' ref={postImage} hidden onChange={hanlePostImage} />
          <div className="w-full h-[300px] overflow-hidden flex items-center justify-center rounded-lg
          ">
            <img src={frontendImage || null} className='h-full ' />
          </div>
          <div className="w-full h-[200px] flex flex-col">
            <div className="p-[20] flex items-center justify-start border-b-2 border-gray-500" >
              <BsImage size={25} className='text-gray-500 mb-5  cursor-pointer' onClick={() => postImage.current.click()} />
            </div>
            <div className="w-full flex items-center justify-end mt-[20px] ">
              <button className='w-[40%] bg-[#0A66c2] font-semibold cursor-pointer p-3 text-white rounded-full' onClick={handleUploadPost} disabled={post}> {post ? "Uploading.." : "Post"}</button>
            </div>
          </div>
        </div>
      }

      {/* Middle */}
      <div className='lg:w-[50%]   w-full min-h-[200px] bg-[#f0efe7]  flex items-center justify-center gap-5 flex-col'>
        <div className="w-full h-[100px] rounded-lg bg-[white] shadow-lg p-4 flex items-center justify-center gap-4">
          <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full overflow-hidden">
            <img src={userData.profileImage || dp} alt="profileImage" className='w-full h-full' />
          </div>
          <button className='w-[80%] h-[50px] border border-[#0A66c2] flex items-center justify-start px-[20px] py-[10px] rounded-full cursor-pointer hover:bg-gray-100 text-[#0A66c2]' onClick={() => setUploadPost(true)}>Start a Post</button>
        </div>
        {
          userPost.map((post, index) => (
            <Post key={index} createdAt={post.createdAt} id={post._id} author={post.author} description={post.description} image={post.image} like={post.like} comment={post.comment} />
          ))
        }
      </div>
      {/* Right */}
      <div className='lg:w-[25%] w-full p-[20px]  overflow-auto h-[600px] bg-white shadow-lg hidden rounded-lg lg:flex flex-col'>
        <h2 className='text-[18px] text-gray-900 font-semibold'>Suggested Users</h2>
        {
          suggested.length > 0 && <div className="flex flex-col gap-[10px]">
            {
              suggested.map((suggest, index) => (
                <div className="mt-[10px] flex gap-[10px] items-center cursor-pointer p-[5px] rounded-lg hover:bg-gray-200" key={index} onClick={() => handleGetProfile(suggest.userName)}>
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <img src={suggest.profileImage || dp} alt="" className='w-full h-full' />
                  </div>
                  <div className="">
                    <div className="text-[14px] font-semibold text-gray-700">
                      {`${suggest.firstName} ${suggest.lastName}`}
                    </div>
                    <div className="text-[12px]  text-gray-900">
                      {`${suggest.headline} `}
                    </div>
                  </div>
                </div>
              ))
            }

            {
              suggested.length === 0 && <div className="">
                No Suggested Users
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Home