import type { NextPage } from "next";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Webcam from "react-webcam";
import { BACKEND_URL } from "../constants";
import Image from "next/image";


const FaceRegister: NextPage = () => {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState("");
  const [error, errorMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const webcamRef: any = useRef(null);
  const videoConstraints = {
    width: 1000,
    height: 1000,
    facingMode: "user",
  };
  useEffect(() => {
    const username = window.localStorage.getItem("username");
    // const faceVerification = window.localStorage.getItem("faceVerification")
    // if (!username) router.push("/login")
    // if (username && faceVerification) router.push("/")
    if (username) setUsername(username);
    setIsMounted(true);
  }, []);

  const handleFaceRegister = async () => {
    if (isMounted) {
      try {
        const image = webcamRef.current.getScreenshot();
        const res = await axios.post(`${BACKEND_URL}/face-register`, {
          username,
          image,
        });
        if (res.data.status === "success") {
          errorMessage("");
          setCount(count + 1);
          if(count===4) return router.push("/");
        }
      } catch (err: any) {
        console.log(err);
        errorMessage(err.response.data);
      }
    }
  };

  //FACE REGISTER PAGE 
  return (
  <div className="min-h-screen relative flex flex-col items-center overflow-hidden">
  <Image 
  src="/bg.jpg"
  alt="login Background"
  layout="fill"
  className="absolute insert-0 object-cover -z-10"
  />
    
    <div className="inset-0 w-screen min-h-screen flex justify-center items-center z-20">
      <div className=" bg-white sm:px-8 shadow-lg rounded-lg sm:w-[25rem] w-5/6 flex items-center p-4 flex-col">
        <div className="mb-4 text-black text-20xl">Welcome {username}</div>
        <h3 className="mb-4 text-red-500 ">EYES SHOULD BE CLEARLY VISIBLE</h3>
        
        <span className="my-4 font-semibold ">Image: {count}/5</span>
        <Webcam
          className="rounded-lg"
          audio={false}
          ref={webcamRef}
          height={300}
          width={300}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <div className="flex flex-col items-center text-red-400 text-sm  ">
          {error}
        </div>
        <div className="p-4 w-full">
          <button
            className="w-full cursor-pointer flex justify-center mx-auto py-2 mt-4 mb-1 text-white bg-blue-500/90 hover:bg-blue-500 transition-all rounded"
            onClick={handleFaceRegister}
          >
            CLICK HERE 5 TIMES
          </button>
        </div>
        {/* <button
          className="mt-12 bg-red-500 px-6 py-2 rounded-lg text-red-100 text-sm"
          onClick={() => {
            if (window !== undefined) {
              window.localStorage.removeItem("username");
              window.localStorage.removeItem("faceVerification");
              router.reload();
            }
          }}
        >
          Logout
        </button> */}
      </div>
    </div>
    </div>
  );
};
export default FaceRegister;
