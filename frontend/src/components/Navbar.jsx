import React, { useContext, useState } from 'react'
import linkedin from "../assets/linkedin.png"
import { FaSearch } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import dp from "../assets/dp.png"
import { userContext } from '../context/UserContext';
import { authContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const Navbar = () => {
  const [activeSearch, setActiveSearch] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { userData, setUserData, handleGetProfile } = useContext(userContext);
  const { serverUrl } = useContext(authContext)
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      console.log(response.data.message);
      toast.success("Logout successfully")
      setUserData(null)
      navigate("/login")

    } catch (error) {
      console.log(error.message, "Logout error");

    }
  }

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, {
        withCredentials: true
      })
      setSearchData(res.data)
    } catch (error) {
      setSearchData([]);
      console.log(error.message);
    }
  }

  useEffect(() => {
    handleSearch()
  }, [searchInput])

  return (
    <div className=' z-50 w-full h-[70px] bg-[white] fixed top-0 left-0 shadow-lg flex items-center md:justify-around  justify-between px-[10px] '>
      <div className="flex items-center justify-center cursor-pointer gap-4">
        <div className="" onClick={() => {
          setActiveSearch(false)
          navigate("/")
        }}>
          <img src={linkedin} alt="linkedin_logo" className='lg:w-[40px] w-[30px]' />

        </div>
        {!activeSearch && <FaSearch className='w-[20px] h-[20px] text-gray-600 lg:hidden' onClick={() => setActiveSearch(prev => !prev)} />}


        {
          searchData.length > 0 && <div className="lg:absolute top-[80px] shadow-lg left-[0px]   lg:left-[20px] w-full lg:max-w-[500px] h-[500px] fixed bg-white flex flex-col gap-[5px] p-[20px] rounded-lg overflow-auto">
            {
              searchData.map((search, index) => (
                <div onClick={() => {
                  handleGetProfile(search.userName)
                  setSearchData([])
                  setSearchInput("")
                }} className="flex items-center gap-[20px]  border border-gray-400 p-[10px] cursor-pointer rounded-4xl hover:bg-gray-200" key={index}>
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                    <img src={search.profileImage || dp} alt="" className='w-full h-full' />
                  </div>
                  <div className="">
                    <div className="text-[14px] font-semibold text-gray-700">
                      {`${search.firstName} ${search.lastName}`}
                    </div>
                    <div className="text-[12px] font-semibold text-gray-700">
                      {`${search.headline} `}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        }

        <form onSubmit={(e) => { e.preventDefault() }}>
          <div className={`lg:flex items-center justify-center ${!activeSearch ? "hidden" : "flex"}    gap-3 p-2 bg-gray-100 rounded-xl`}>
            <FaSearch className='w-[20px] h-[20px] text-gray-600  ' />
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="search" name="" id="" placeholder='search...' className=' outline-none px-[2px] w-[150px] lg:w-[400px]' />
          </div>
        </form>
      </div>

      <div className="flex   items-center justify-center gap-3 relative">



        {showPopup && <div className={`absolute top-[62px] right-5 w-[230px] min-h-[250px] flex items-center shadow-lg  flex-col rounded-2xl bg-[white] p-[20px] gap-[4px]`}>
          <div className="w-[60px] h-[60px]   ">
            <img src={userData.profileImage || dp} className='rounded-full w-full h-full' alt="" />
          </div>
          <div className="text-[15px] font-semibold text-gray-700 w-[150px] text-center mt-2">
            {`${userData.firstName} ${userData.lastName}`}
          </div>
          <button className='border mt-1 text-sm px-3 w-[180px] text-[#0A66c2] rounded-4xl border-[#0A66c2]   cursor-pointer py-1' onClick={() => {
            handleGetProfile(userData.userName)
            setShowPopup(false)
          }}>View profile</button>
          <hr className='mt-2 text-gray-300 w-[180px]' />
          <div className="flex cursor-pointer items-center w-full justify-start gap-4 text-[15px]" onClick={() => navigate("/network")}>
            <IoPeople />
            <p>My network</p>
          </div>
          <button onClick={handleSignOut} className='border text-sm mt-2 px-3 w-[180px] text-red-600 rounded-4xl border-red-500   cursor-pointer py-1'>Sign Out</button>
        </div>}


        <div className="text-[12px] lg:flex hidden items-center flex-col gap-[2px] cursor-pointer" onClick={() => navigate("/")}>
          <IoMdHome size={"25"} />
          <div className="">Home</div>
        </div>

        <div className="text-[12px] lg:flex hidden items-center flex-col gap-[2px] cursor-pointer" onClick={() => navigate("/network")}>
          <IoPeople size={"25"} />
          <div className="">My networks</div>
        </div>
        <div className="text-[12px] lg:flex  items-center cursor-pointer justify-center flex-col gap-[2px]" onClick={()=>navigate("/notification")}>
          <IoMdNotifications size={"25"} />
          <div className="lg:flex hidden">Notification</div>
        </div>
        <div className="w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer" onClick={() => setShowPopup(prev => !prev)}>
          <img src={userData.profileImage || dp} alt="Profile_img" className=' w-full h-full  cursor-pointer' />
        </div>


      </div>
    </div>
  )
}

export default Navbar