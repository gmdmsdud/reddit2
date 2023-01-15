import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import InputGroup from '../components/InputGroup'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useAuthState } from '../context/auth'

const Register = () => {
    const [email,setEmail] = useState("")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [errors,setErrors] = useState<any>({})
    const {authenticated} = useAuthState
    ()

    let router =useRouter()
    if(authenticated) router.push("/");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        //백엔드에 회원가입을 위한 요청 및 회원가입 후 로그인 페이지로 자동 이동
        try {
            const res = await axios.post('/auth/register', {//요청을 보내서 백앤드에서 데이터베이스에 저장하기 위해 npm i axios --save 설치 axios요청을 보내는 모듈
                email,
                password,
                username
            })
            console.log('res',res);
            router.push("/login");
            
        } catch (error: any) {
            console.log('error',error);
            setErrors(error.response.data ||{});
        }
    }
    return (
        <div className='bg-white'>
            <div className="flex flex-col items-center justify-center h-screen p-6">
                <div className="w-10/12 mx-auto md:w-96"> 
                {/* width가 medium보다 클때 w를 ~ */}
                    <h1 className='mb-2 text-lg font-medium'>회원가입</h1>
                    {/* text-lg 글씨크기 font-medium 글씨 굵기 */}
                    <form onSubmit={handleSubmit}>
                        <InputGroup 
                            placeholder='Email'
                            value={email}
                            setValue={setEmail}
                            error={errors.email}
                            />
                            <InputGroup 
                            placeholder='Username'
                            value={username}
                            setValue={setUsername}
                            error={errors.username}
                            />
                            <InputGroup 
                            placeholder='Password'
                            value={password}
                            setValue={setPassword}
                            error={errors.password}
                            />
                            
                        <button className='w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border-gray-400 rounded'>
                            회 원 가 입
                        </button>
                    </form>
                    <small>
                        이미 가입하셨나요?
                        <Link  href="/login" className='ml-1 text-blue-500 uppercase'>로그인
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}

export default Register