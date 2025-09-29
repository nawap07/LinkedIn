import React, { useContext, useState } from 'react'
import axios from "axios"
import logo from "../assets/logo.svg"
import { Link } from "react-router-dom"
import { authContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { userContext } from '../context/UserContext'
const SignUp = () => {
    const [show, setShow] = useState(false)
    const { serverUrl } = useContext(authContext);
    const { userData, setUserData } = useContext(userContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                firstName, lastName, userName, email, password
            }, {
                withCredentials: true
            })
            setUserData(result.data.user)
            navigate("/")
            setLoading(false)
            toast.success("Sign Up successfully", {
                position: 'top-right'
            })

            setErr("")
        } catch (error) {
            console.log(error.message);
            setErr(error.response.data.message)
            toast.error(error.response.data.message, {
                position: 'top-right'
            })
            setLoading(false)

        }
    }
    return (
        <div className='w-full h-screen flex flex-col items-center justify-start gap-[10px]'>
            <div className="p-[30px] lg:p-[35px] w-full h-[80px] flex items-center">
                <img src={logo} alt="logo" />
            </div>
            <form onSubmit={handleSignUp} className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col  justify-center gap-[10px] p-[20px]'>
                <h1 className='text-[#0A66c2] text-[30px] mb-[30px] font-semibold'>Sign Up</h1>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder='firstname' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[15px] py-[10px] px-[10px] outline-none rounded-md' />
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder='lastname' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[15px] py-[10px] px-[10px] outline-none rounded-md' />
                <input value={userName} onChange={(e) => setUserName(e.target.value)} type="text" placeholder='username' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[15px] py-[10px] px-[10px] outline-none rounded-md' />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='email' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[15px] py-[10px] px-[10px] outline-none rounded-md' />
                <div className="w-[100%] h-[50px] border-2 border-gray-600  text-gray-800 text-[15px] rounded-md relative px-2 ">
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder='password' required className='w-full h-full outline-none text-gray-800 text-[15px] pl-[5px] rounded-md' />
                    <span className="absolute right-[20px] top-[12px] text-[#0A66c2] cursor-pointer" onClick={() => setShow(!show)} > {show ? "Hide" : "Show"}</span>
                </div>

                {err && <p className='text-red-400 text-[14px] text-center h-[10px]'>{err}</p>}
                <button disabled={loading} className='w-full mt-[8px] bg-[#0A66c2] rounded-full px-10 py-3 text-white text-sm cursor-pointer'> {loading ? "Register" : "Sign Up"}</button>
                <Link to={"/login"}>  <p className='text-[12px] text-center font-semibold '>Already have an account ?  <span className='cursor-pointer text-[#0A66c2] '>Sign In</span></p></Link>
            </form>
        </div>
    )
}

export default SignUp 