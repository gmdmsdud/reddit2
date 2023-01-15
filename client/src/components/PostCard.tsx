import axios from 'axios'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { useAuthState } from '../context/auth'
import { Post } from '../types'

interface PostCardProps {
    post: Post
    subMutate?: () => void
    mutate?: () => void
}
// const onDeleteClick = ()=>{
//     const ok = window.confirm("삭제 하시겠습니까?");
//    console.log(ok);
//     if(ok) {
//         dbService.doc()
//     }
// }
const PostCard = ({post: { 
    identifier, slug, title, body, subName,createdAt, voteScore, userVote, commentCount,url,username,sub
}, mutate, subMutate } :PostCardProps) => {
    const router =useRouter()
    const isInSubPage = router.pathname === '/r/[sub]'
    
    console.log('router.pathname',router.pathname);

    const {authenticated} = useAuthState();
    const vote =async (value:number) => {
        if(!authenticated)router.push("/login");

        if(value === userVote) value =0;

        try {
            await axios.post("/votes", {identifier,slug,value});
            if(mutate)mutate();
            if(subMutate)subMutate(); //vote 눌럿을때 submutate 실행
        } catch (error) {
            console.log(error);
        }
    }
  
    return (
        <div className='flex mb-4 bg-white rounded'
            id={identifier}
        >
            <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                <div className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    onClick={() => vote(1)}
                >
                        {userVote ===1? <FaArrowUp className=" text-red-500"/> : <FaArrowUp />}
                    
                </div>
                <p className="text-xs font-bold">{voteScore}</p>
                <div className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                    onClick={() => vote(-1)}
                >
                {userVote ===-1? <FaArrowDown className=" text-blue-500"/> : <FaArrowDown />}
                </div>
            </div>
            {/* 포스트데이터*/}
            
            <div className="w-full p-2">
           
                <div className='flex items-center'>      
                   
                    {!isInSubPage && (
                        <div className='flex items-center'>
                            
                            <Link href={`/r/${subName}`}>
                               
                                    <Image 
                                        src={sub!.imageUrl} alt="sub" className="rounded-full cursor-pointer" width={12} height={12}/>
                               
                            </Link>
                            <Link href={`/r/${subName}`} className="ml-2 text-xs font-bold cursor-pointer hover:underline">
                                    {subName}
                               
                            </Link>
                            <span className="mx-1 text-xs text-gray-400">•</span>
                        </div>

                    )}
                    
                    <p className="text-xs text-gray-400">
                        작성자
                        <Link href={`/u/${username}`} className='mx-1 hover:underline'>{username}
                        </Link>
                        <Link href={url} className='mx-1 hover:underline'>
                                {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
                            
                        </Link>
                    </p>
                   {/* <button onClick={onDeleteClick}>Delete</button> */}
                </div>
                <Link href={url}  className=' my-1 text-lg font-medium'>{title}
                    
                </Link>
                {body && <pre style={{ whiteSpace: "pre-wrap"}} className='my-1 text-sm' >{body.length>150 ? `${body.slice(0,150)} ...` :body}</pre>}
                <div className="flex">
                    <Link href={url}>
                        
                            <i className='mr-1 fas fa-comment-alt fa-xs'></i>
                            <span>{commentCount}</span>
                        
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PostCard