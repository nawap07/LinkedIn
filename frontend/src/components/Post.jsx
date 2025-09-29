import React, { useContext, useMemo } from 'react'
import axios from "axios"
import dp from "../assets/dp.png"
import moment from "moment"
import { useState } from 'react'
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { LuSendHorizontal } from "react-icons/lu";
import { authContext } from '../context/AuthContext'
import { toast } from "react-hot-toast"
import { userContext } from '../context/UserContext'
import { useEffect } from 'react'
import ConnectionButton from './ConnectionButton'


const Post = ({ id, author, createdAt, like, comment, description, image }) => {
    const [more, setMore] = useState(false);
    const [showComment, setShowComments] = useState(false);
    const [likes, setLikes] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [comments, setComments] = useState([]);

    const { serverUrl } = useContext(authContext);
    const { userData, setUserData, userPost, getAllPosts ,handleGetProfile,socket} = useContext(userContext)


    const getLike = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/post/like/${id}`, {
                withCredentials: true
            })
            setLikes(res.data.post.like)

            toast.success(res.data.message, {
                position: "top-right"
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    const getComment = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${serverUrl}/api/post/comment/${id}`, { content: commentContent }, {
                withCredentials: true
            })
            setComments(res.data.post.comment);
            setCommentContent("")

        } catch (error) {
            console.log("Error on Comment", error.message);

        }
    }
    useEffect(() => {
        socket.on("likeUpdate", ({ postId, likes }) => {
            if (postId === id) {
                setLikes(likes)
            }
        })

        socket.on("commentAdded", ({ postId, comments }) => {
            if (postId === id) {
                setComments(comments)
            }
        })
        return () => {
            socket.off("likeUpdate")
            socket.off("commentAdded")
        }
    }, [id])

    useEffect(()=>{
        setLikes(like)
        setComments(comment)
    },[like,comment])
    return (
        <div className='w-full min-h-[200px] bg-white flex flex-col gap-[10px] rounded-lg shadow-lg p-4'>
            <div className="flex justify-between items-center">
                <div className="flex justify-center items-start gap-[10px]">
                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer" onClick={()=>handleGetProfile(author?.userName)}>
                        <img src={author.profileImage || dp} className='h-full w-full' alt="image" />
                    </div>
                    <div className="">
                        <div className="text-[20px] font-semibold">{author.firstName} {author.lastName}</div>
                        <div className="text-[14px] text-gray-700">{author.headline} </div>
                        <div className="text-[12px] text-gray-700">{moment(createdAt).fromNow()} </div>
                    </div>
                </div>
                <div className=" ">
                    {userData._id !== author._id && <ConnectionButton userId={author._id} />}
                </div>
            </div>

            <div className={`w-full ${!more ? "max-h-[100px] overflow-hidden" : ""} text-[15px] pl-[50px] pt-[10px]   overflow-hidden mt-5`}>
                {description}
            </div>
            <div onClick={() => setMore(prev => !prev)} className="pl-[50px] text-[12px] text-gray-500 cursor-pointer font-semibold">{more ? "read less..." : "read more..."}</div>
            {
                image && <div className="w-full h-[250px] overflow-hidden flex items-center justify-center rounded-lg">
                    <img src={image} className='h-full rounded-lg' alt="" />
                </div>
            }

            <div className="">
                <div className="flex w-full justify-between items-center p-[20px] border-b-2">
                    <div className="flex items-center justify-center gap-[5px] text-[12px] "><BiLike size={20} color='#0A66c2' /><span>{likes?.length}</span></div>
                    <div className="flex items-center justify-center gap-[5px] text-[12px] cursor-pointer" onClick={() => setShowComments(prev => !prev)}> <span>{comments?.length}</span>Comments</div>
                </div>
                <div className="w-full flex items-center justify-start gap-[30px] p-[20px]">
                    <div className="flex items-center justify-center gap-[5px] cursor-pointer" onClick={getLike}>
                        {likes.includes(userData._id) ? <BiSolidLike size={20} color='#0A66c2' /> : <BiLike size={20} />}
                        <span className={`${likes.includes(userData._id) ? "text-[#0A66c2] font-semibold" : " "}`}>{likes.includes(userData._id) ? "Liked" : "Like"}
                        </span>
                    </div>
                    <div className="cursor-pointer flex items-center justify-center gap-[5px]" onClick={() => setShowComments(prev => !prev)}> <FaRegCommentDots size={20} /> <span className='text-[14px]'>Comments</span></div>
                </div>
                {
                    showComment && <div className="">
                        <div>
                            <form onSubmit={getComment} className="w-full flex items-center justify-between border-b-2 border-b-gray-300">
                                <input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} type="text" placeholder='Leave a comment...' className='w-full outline-none border-none p-2' />
                                <button className='cursor-pointer '> <LuSendHorizontal color='#0A66c2' size={25} /></button>
                            </form>
                        </div>
                        <div className="flex flex-col gap-[10px] p-2">
                            {
                                comments.map((com) => (
                                    <div className="flex flex-col gap-[10px] border-b-2 border-b-gray-300 p-2" key={com._id}>
                                        <div className="w-full flex justify-start  items-center gap-[10px] ">
                                            <div className="w-[35px] h-[35px] rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
                                                <img src={com.user.profileImage || dp} alt="" className='h-full w-full' />
                                            </div>
                                            <div className="">
                                                {`${com.user.firstName} ${com.user.lastName}`}
                                                {/* <div className="text-[10px] pl-[10px]">{moment(com.createdAt).fromNow()}</div> */}

                                            </div>
                                        </div>
                                        <div className="pl-[50px]">{com.content}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Post