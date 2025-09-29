import React, { useContext, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { userContext } from '../context/UserContext';
import dp from "../assets/dp.png"
import { FaCirclePlus } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import { toast } from "react-hot-toast"
import { useRef } from 'react';
import axios from 'axios';
import { authContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom"

const EditProfile = () => {
  const { setEdit, edit, userData, setUserData } = useContext(userContext);
  const { serverUrl } = useContext(authContext)
  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [userName, setUserName] = useState(userData.userName || "");
  const [headline, setHeadLine] = useState(userData.headline || "");
  const [location, setLocation] = useState(userData.location || "");
  const [gender, setGender] = useState(userData.gender || "");
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkills, setNewSkills] = useState("");
  const [education, setEducation] = useState(userData.education || []);
  const [newEducation, setNewEducation] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  });
  const [experience, setExprience] = useState(userData.experience || []);
  const [newEperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  const [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || dp);
  const [backendProfileImage, setBackendProfileImage] = useState(null);
  const [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || null);
  const [backendCoverImage, setBackendCoverImage] = useState(null);

  const [saving, setSaving] = useState(false)

  const profileImage = useRef();
  const coverImage = useRef();

  const navigate = useNavigate();

  const addSkills = (e) => {
    e.preventDefault();
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    } else {
      toast.error("Write a skill", {
        position: "top-right"
      })
    }

    setNewSkills(" ");
  }

  const addEducation = (e) => {
    e.preventDefault();
    if (newEducation.college && newEducation.degree && newEducation.fieldOfStudy && !education.includes(newEducation)) {
      setEducation([...education, newEducation])
    } else {
      toast.error("All fields are required", {
        position: "top-right"
      })
    }
    setNewEducation({
      college: "",
      degree: "",
      fieldOfStudy: ""
    })
  }
  const addExprience = (e) => {
    e.preventDefault();
    if (newEperience.title && newEperience.company && newEperience.description && !experience.includes(newEperience)) {
      setExprience([...experience, newEperience])
    } else {
      toast.error("All fields are required", {
        position: "top-right"
      })
    }
    setNewExperience({
      title: "",
      company: "",
      description: ""
    })
  }

  const removeSkills = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill))

    }
  }
  const removeEducation = (edu) => {
    if (education.includes(edu)) {
      setEducation(education.filter((ed) => ed !== edu))
    }
  }
  const removeExprience = (exp) => {
    if (experience.includes(exp)) {
      setExprience(experience.filter((ex) => ex !== exp))
    }
  }

  function handleProfileImage(e) {
    const file = e.target.files[0]
    setBackendProfileImage(file)
    setFrontendProfileImage(URL.createObjectURL(file))
  }

  function handleCoverImage(e) {
    const file = e.target.files[0]
    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));
      formdata.append("gender", gender);

      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage)
      }
      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage)
      }

      const res = await axios.put(`${serverUrl}/api/user/updateprofile`, formdata, {
        withCredentials: true
      })
      setUserData(res.data);
      navigate("/")
      toast.success("Update Profile", {
        position: "top-right"
      })
      setSaving(false);
      setEdit(false)

    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "top-right"
      });
      setSaving(false)
    }
  }
  return (
    <div className='w-full h-[100vh] fixed top-0   z-100 flex items-center justify-center  '>
      <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage} />
      <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImage} />

      <div className="w-full h-full bg-black opacity-[0.5] relative "></div>
      <div className="w-[90%] max-w-[500px] h-[500px] bg-white   absolute z-20 shadow-lg rounded-lg p-[10px] overflow-auto hide ">
        <div className=" absolute top-4 font-semibold text-gray-700 w-[19px] right-4 cursor-pointer " onClick={() => setEdit(false)}><RxCross1 size={22} /></div>
        <div className="w-full h-[150px] bg-gray-500 overflow-hidden cursor-pointer rounded-lg mt-[40px]" onClick={() => coverImage.current.click()}>
          <img src={frontendCoverImage} alt="cover_Image" className='w-full h-full ' />
          <FiCamera className="absolute right-8 top-[160px] cursor-pointer" color='white' size={25} />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden z-10  cursor-pointer absolute top-[150px] left-[30px]" onClick={() => profileImage.current.click()}>
          <img src={frontendProfileImage} alt="Profile_img" className='w-full h-full' />
        </div>
        <div className="">
          <FaCirclePlus color='#0A66c2' className='absolute top-[195px] cursor-pointer left-[85px] z-20' />
        </div>

        <div className='flex items-center justify-center w-full flex-col mt-[35px] gap-[20px]'>
          <input type="text" placeholder='firstname' value={firstName} onChange={(e) => setFirstName(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' />
          <input type="text" placeholder='lastname' value={lastName} onChange={(e) => setLastName(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' />
          <input type="text" placeholder='username' value={userName} onChange={(e) => setUserName(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' />
          <input type="text" placeholder='headline' value={headline} onChange={(e) => setHeadLine(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' />
          <input type="text" placeholder='location' value={location} onChange={(e) => setLocation(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' />
          <input type="text" placeholder='gender (male/female/other)' value={gender} onChange={(e) => setGender(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' />
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]">
            <h2 className='text-[16px] font-semibold'>Skills</h2>
            {
              skills && <div className="flex flex-col gap-[10px]">
                {skills.map((skill, index) => (
                  <div className="flex items-center justify-between w-full h-[40px] bg-gray-200 rounded border px-[10px] py-[5px]" key={index}>{skill}
                    <RxCross1 size={22} className='font-bold cursor-pointer' onClick={() => removeSkills(skill)} />
                  </div>
                ))}
              </div>
            }
            <div className='flex flex-col gap-[10px] items-start' >
              <input type="text" className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' placeholder=' add new skill' value={newSkills} onChange={(e) => setNewSkills(e.target.value)} />
              <button className='w-full px-[10px] py-[5px] border rounded-lg font-semibold text-[#0A66c2] cursor-pointer border-[#0A66c2]' onClick={addSkills}>Add</button>
            </div>
          </div>
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]">
            <h2 className='text-[16px] font-semibold'>Education</h2>
            {
              education && <div className="flex flex-col gap-[10px]">
                {education.map((edu, index) => (
                  <div className="flex items-center justify-between w-full  bg-gray-200 rounded border px-[10px] py-[5px]" key={index}>
                    <div className="">
                      <div>College : {edu.college}</div>
                      <div> Degree: {edu.degree}</div>
                      <div>Field Of Study : {edu.fieldOfStudy}</div>
                    </div>
                    <RxCross1 size={22} className='font-bold cursor-pointer' onClick={() => removeEducation(edu)} />
                  </div>
                ))}
              </div>
            }
            <div className='flex flex-col gap-[10px] items-start' >
              <input type="text" className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' placeholder='College' value={newEducation.college} onChange={(e) => setNewEducation({ ...newEducation, college: e.target.value })} />
              <input type="text" className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' placeholder='Degree' value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} />
              <input type="text" className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' placeholder='Field of education' value={newEducation.fieldOfStudy} onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })} />
              <button className='w-full px-[10px] py-[5px] border rounded-lg font-semibold text-[#0A66c2] cursor-pointer border-[#0A66c2]' onClick={addEducation}>Add</button>
            </div>
          </div>
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]">
            <h2 className='text-[16px] font-semibold'>Experience</h2>
            {
              experience && <div className="flex flex-col gap-[10px]">
                {experience.map((exp, index) => (
                  <div className="flex items-center justify-between w-full  bg-gray-200 rounded border px-[10px] py-[5px]" key={index}>
                    <div className="">
                      <div>Title : {exp.title}</div>
                      <div> Company: {exp.company}</div>
                      <div>Description : {exp.description}</div>
                    </div>
                    <RxCross1 size={22} className='font-bold cursor-pointer' onClick={() => removeExprience(exp)} />
                  </div>
                ))}
              </div>
            }
            <div className='flex flex-col gap-[10px] items-start' >
              <input type="text" className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' placeholder='Title' value={newEperience.title} onChange={(e) => setNewExperience({ ...newEperience, title: e.target.value })} />
              <input type="text" className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' placeholder='Company' value={newEperience.company} onChange={(e) => setNewExperience({ ...newEperience, company: e.target.value })} />
              <input type="text" className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg' placeholder='Description' value={newEperience.description} onChange={(e) => setNewExperience({ ...newEperience, description: e.target.value })} />
              <button className='w-full px-[10px] py-[5px] border rounded-lg font-semibold text-[#0A66c2] cursor-pointer border-[#0A66c2]' onClick={addExprience}>Add</button>
            </div>
          </div>

          <button className=' mb-4 rounded-lg cursor-pointer font-semibold w-full px-[10px] py-[5px]  bg-[#0A66c2] text-[#ffffff]' disabled={saving} onClick={() => handleSaveProfile()}>{saving ? "Saving..." : "Save profile"}</button>

        </div>

      </div>
    </div>
  )
}

export default EditProfile