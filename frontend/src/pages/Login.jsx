import React, { useContext, useState } from 'react'
import axios from "axios"
import logo from "../assets/logo.svg"
import { Link } from "react-router-dom"
import { authContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { userContext } from '../context/UserContext'
const Login = () => {
    const [show, setShow] = useState(false)
    const { serverUrl } = useContext(authContext);
    const {  userData,setUserData } = useContext(userContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/login`, {
                  email, password
            }, {
                withCredentials: true
            })
            setUserData(result.data.user)
            setLoading(false)
            navigate("/")

            toast.success("Login successfully", {
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
            <form onSubmit={handleSignIn} className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col  justify-center gap-[10px] p-[20px]'>
                <h1 className='text-[#0A66c2] text-[30px] mb-[30px] font-semibold'>Sign In</h1>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='email' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[15px] py-[10px] px-[10px] outline-none rounded-md' />
                <div className="w-[100%] h-[50px] border-2 border-gray-600  text-gray-800 text-[15px] rounded-md relative px-2 ">
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder='password' required className='w-full h-full outline-none text-gray-800 text-[15px] pl-[5px] rounded-md' />
                    <span className="absolute right-[20px] top-[12px] text-[#0A66c2] cursor-pointer" onClick={() => setShow(!show)} > {show ? "Hide" : "Show"}</span>
                </div>

                {err && <p className='text-red-400 text-[14px] text-center h-[10px]'  >{err}</p>}
                <button disabled={loading} className='w-full mt-[8px] bg-[#0A66c2] rounded-full px-10 py-3 text-white text-sm cursor-pointer'> {loading ? "Login..." : "Sign In"}</button>
                <Link to={"/signup"}>  <p className='text-[12px] text-center font-semibold '>Don't have an account ?  <span className='cursor-pointer text-[#0A66c2] '>Sign Up</span></p></Link>
            </form>
        </div>
    )
}

export default Login 