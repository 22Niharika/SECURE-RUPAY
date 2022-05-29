import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import axios from "axios"
import { useRouter } from "next/router"
import { BACKEND_URL } from '../constants'
import Link from 'next/link'
import Image from "next/image";

const Register: NextPage = () => {
  const router =  useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, errorMessage] = useState("")

  useEffect(()=>{
    const username = window.localStorage.getItem("username")
    const faceVerification = window.localStorage.getItem("faceVerification")
    // if (username && faceVerification) router.push("/")
    // if (!username && faceVerification) window.localStorage.removeItem("faceVerification")
    // if (username && !faceVerification) router.push("/face-login")
},[])

// REGISTER PAGE 
const handleRegister = async (e:any) => {
  e.preventDefault()
  if(username === "" || password === ""){
    return errorMessage("Please enter username and password")
  }
  try{
    const res = await axios.post(`${BACKEND_URL}/register`,{
      username,
      password
    })
    if(res.data.status==="error"){
      return errorMessage(res.data.error)
    }
    if(res.data.status==="success"){
      errorMessage("")
      if (window !== undefined){
        window.localStorage.setItem("username", username)
      }
      return router.push("/face-register")
    }
  }catch(err:any){
    errorMessage(err.response.data.error)
  }
}
  return (
    <div className="min-h-screen relative flex flex-col items-center overflow-hidden">
      <Image 
      src="/bg.jpg"
      alt="login Background"
      layout="fill"
      className="absolute insert-0 object-cover -z-10"
      />
    <div className=" inset-0 w-screen min-h-screen flex justify-center items-center z-20">
      <div className=" bg-white sm:px-8 shadow-lg rounded-lg sm:w-[25rem] w-5/6">
        <h1 className="text-2xl text-black font-semibold  pt-8 pb-4 text-center">
          Register
        </h1>
        <form>
          <div className="flex flex-col items-center p-2">
            <label className="block text-gray-500 text-xs font-bold mb-2 w-full">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Username"
              autoComplete="username"
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center p-2">
            <label className="block text-gray-500 text-xs font-bold mb-2 w-full">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center text-red-400 text-sm  ">
            {error}
          </div>
          <div className="p-2">
            <button 
              className="w-full flex cursor-pointer justify-center mx-auto py-2 my-4 text-white bg-blue-500/90 hover:bg-blue-500 transition-all rounded"
              onClick={handleRegister}
            >
              Register
            </button>
            <Link href={"/"}>
            <button 
          className="mt-12 bg-red-500 px-4 py-4 rounded-lg text-red-100 text-sm"
          
        >
          Logout
        </button>
        </Link>
          </div>
          
        </form>
      </div>
    </div>
    </div>
  )
}

export default Register