import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useRouter } from "next/router"
import { BACKEND_URL, BACKEND_URL_FLASK } from '../constants'
import Webcam from 'react-webcam'
// import faker from "@faker-js/faker"

const Home: NextPage = () => {
  const router =  useRouter()
  const [username, setUsername] = useState("")
  const [fakeData, setFakeData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [transactionAmount, setTransactionAmount] = useState(0)
  const [transactionVerification, setTransactionVerification] = useState(false)
  const [transactionVerificationErr, setTransactionVerificationErr] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const [remark, setRemark] = useState("")
  const [accountRandomData] = useState({
    accountNumber: Math.floor(Math.random() * 100000000000),
    email: Math.floor(Math.random() * 10000),
    phone: [
      Math.floor(Math.random() * 100000),
      Math.floor(Math.random() * 100000)
    ]
  })

  // EXPENSE TRACKER FUNCTIONS
  const transactionAmountChange = (e: any) =>  setTransactionAmount(parseInt(e.target.value, 10))
  const remarkChange= (e: any) =>  setRemark(e.target.value)
  useEffect(()=>{
    const username = window.localStorage.getItem("username")
    const faceVerification = window.localStorage.getItem("faceVerification")
    if (!username && faceVerification !== "true") router.push("/login")
    if (username && faceVerification !== "true") router.push("/face-login")
    if (username && faceVerification) setUsername(username)
    }, [])
  useEffect(()=>{
    getUserData()
  }, [username])
  useEffect(()=>{
    const getFakeData = async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users/1")
      setFakeData(res.data)
    }
      getFakeData()
  },[])
  const getUserData = async () => {
    const res = await axios.post(`${BACKEND_URL}/data`,{
      username
    })
    setUserData(res.data.data)
  }
  const webcamRef: any = useRef(null);
  const videoConstraints = {
      width: 300,
      height: 300,
      facingMode: "user"
  };
  const handleTransaction = async (type: string) => {
    let newTransactionAmount = 0
    if(type==="p") newTransactionAmount = transactionAmount
    if(type==="n") newTransactionAmount = transactionAmount  * -1
    const res = await axios.post(`${BACKEND_URL}/transaction`,{
        username,
        transactionAmount: newTransactionAmount,
        remark
    })
    setTransactionAmount(0)
    setRemark("")
    getUserData()
    if(type="p")setTransactionVerification(false)
  }


  // VERIFYING THE AMOUNT ENTERED BY USER WITH THE CURRENCY SHOWN FOR VERIFICATION
  const handleTransactionVerification = async () => {
    try{
      setTransactionVerificationErr("")
      const image = webcamRef.current.getScreenshot();
      const res = await axios.post(`${BACKEND_URL_FLASK}/transaction-verification`,{
        image
      })
      console.log(res)
      if(!res.data.status){
        setTransactionVerification(false)
        return setTransactionVerificationErr("Unable to verify Note")
      }
      setTransactionVerificationErr("")
      setShowCamera(!res.data.status)
      setTransactionVerification(res.data.status)
    }catch(e:any){
      if(e.response.data.error) return setTransactionVerificationErr(e.response.data.error)
      setTransactionVerificationErr(e.message)
    }
  }


  //  ACCOUNT DETAILS OF USER AND EXPENSE TRACKER 
  return (
    <div className="bg-gray-50 inset-0 w-screen min-h-screen flex flex-col md:flex-row justify-center">
      <div className="flex-1 flex-grow w-screen min-h-screen bg-gray-100">
      <div className="px-8">
        <h2 className="flex justify-center font-semibold text-2xl my-12">
            Welcome&nbsp;<span className="text-blue-500 font-bold">{username}</span>
        </h2>
        <h3 className="text-sm text-gray-700 font-bold my-4 underline">Account Details</h3>
        {fakeData && (
        <table className="table-auto">
          <tbody>
            <tr>
              <td className="w-52">Name:</td>
              <td>{username.toUpperCase()}</td>
            </tr>
            <tr>
              <td>Account Number:</td>
              <td>{accountRandomData.accountNumber}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{username}{accountRandomData.email}@gmail.com</td>
            </tr>
            <tr>
              <td>Street:</td>
              <td>{fakeData.address.street}</td>
            </tr>
            <tr>
              <td>City:</td>
              <td>{fakeData.address.city}</td>
            </tr>
            <tr>
              <td>Zip Code</td>
              <td>{fakeData.address.zipcode}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>+91&nbsp;{accountRandomData.phone[0]}-{accountRandomData.phone[1]}</td>
            </tr>
            <tr>
              <td>Website:</td>
              <td>{username}.com</td>
            </tr>
            <tr>
              <td>Company:</td>
              <td>{fakeData.company.name}</td>
            </tr>
          </tbody>
      </table>
        )}
        <button 
          className="mt-12 bg-red-500 px-6 py-2 rounded-lg text-red-100 text-sm"
          onClick={()=>{
            if(window !== undefined){
              window.localStorage.removeItem("username")
              window.localStorage.removeItem("faceVerification")
              router.reload()
            }
          }}
        >
          Logout
        </button>
        <br></br>
        <a href="https://www.google.com/search?q=banks+near+me&rlz=1C1RXQR_enIN967IN967&oq=banks&aqs=chrome.0.69i59j69i57j0i433i512j46i433i512j0i512j69i60l3.1828j0j7&sourceid=chrome&ie=UTF-8">
        <button 
          className="mt-12 bg-green-500 px-6 py-2 rounded-lg text-red-100 text-sm"

        >
          Look for nearby Banks
        </button>
        </a>
      </div>
      </div>
      <div className="flex-1 w-screen min-h-screen">
      {userData && (
      <div className="px-8">
        <h2 className="flex justify-center font-semibold text-2xl my-12">
          Expense Tracker
        </h2>
        <h3 className="text-lg text-gray-700 font-bold mt-4">Your Balance</h3>
        <h3 className="text-3xl font-bold mb-4">Rs. {userData.currentAmount}</h3>
        <div className="bg-white shadow h-36 flex divide-x">
          <div className="flex flex-1 font-semibold flex-col gap-2 justify-center items-center">
            <span> 
              INCOME
            </span>
            <span className="text-green-500"> 
              Rs. {userData.totalAmount}
            </span>
          </div>
          <div className="flex flex-1 font-semibold flex-col gap-2 justify-center items-center">
            <span> 
              EXPENSE
            </span>
              {userData.totalAmount - userData.currentAmount > 0 ? (
                <span className="text-red-500"> 
                  Rs. {userData.totalAmount - userData.currentAmount}
                </span>
              ) : (
                <span className="text-green-500"> 
                  0
                </span>
              ) }
          </div>
        </div>
        <h3 className="text-lg text-gray-700 font-bold mt-12">History</h3>
        <div>
          {userData.history.map((data: any,i: number)=>(
            <div key={i} className={`bg-white shadow h-10 mt-4 flex justify-between items-center p-4 border-r-4 ${data.transactionAmount>0 ? "border-green-500" : "border-red-500"}`}>
              <span> 
                {data.remark}
              </span>
              <span className={`${data.transactionAmount>0 ? "text-green-500" : "text-red-500"}`}> 
                {data.transactionAmount}
              </span>
            </div>  
          ))}
        </div>
        <h3 className="text-lg text-gray-700 font-bold mt-12">Add New Transition</h3>
        <form className="flex flex-col mb-20">
          <label className="text-sm font-semibold mt-4 mb-2 text-gray-800">Remark</label>
          <input 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="Shoes, Market etc .." 
            value={remark}
            onChange={remarkChange}
            required
          />
          <label className="text-sm font-semibold mt-4 mb-2 text-gray-800">Amount</label>
          <select name="currency" id="currency" value={transactionAmount}
            onChange={transactionAmountChange}>
          <option value="10">Rs10</option>
          <option value="20">Rs20</option>
          <option value="50">Rs50</option>
          <option value="100">Rs100</option>
          <option value="200">Rs200</option>
          <option value="500">Rs500</option>
          <option value="2000">Rs2000</option>
            {/* <input 
            type="number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            placeholder="Enter Amount" 
            value={transactionAmount}
            onChange={transactionAmountChange}
            required
            /> */}
            </select>
            
          <div className="mt-4 flex gap-4">
          <button 
                  className="bg-red-500 px-6 py-2 rounded-lg text-red-100 text-sm"
                  onClick={(e)=>{
                    e.preventDefault()
                    handleTransaction("n")
                  }}
                >
                    Withdraw
                </button>
            {transactionVerification ? (
              <div className="flex gap-4">
                <button 
                  className="bg-green-500 px-6 py-2 rounded-lg text-green-100 text-sm"
                  onClick={(e)=>{
                    e.preventDefault()
                    handleTransaction("p")
                  }}
                >
                    Deposit
                </button>
                
              </div>
            ) : (
              <button
                className="bg-zinc-500 px-6 py-2 rounded-lg text-zinc-100 text-sm"
                onClick={(e)=>{
                  e.preventDefault()
                  setShowCamera(!showCamera)
                }}
              >
                {showCamera ? "Close Camera": "Open Camera to deposit" }
                
              </button>
            )}
          </div>
          {showCamera && (
          <div className="flex flex-col items-center">
              <Webcam
                className="rounded-lg my-4"
                audio={false}
                ref={webcamRef}
                height= {300}
                width= {300}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
              <button
                className="bg-orange-500 px-6 py-2 rounded-lg text-green-100 text-sm"
                onClick={(e)=>{
                  e.preventDefault()
                  handleTransactionVerification()
                }}
              >
               CLICK 5 TIMES
            </button>
            <div className="text-red-500 text-sm mt-4">
                {transactionVerificationErr}
            </div>
          </div>
          )}
        </form>
      </div>
      )}
      </div>

    </div>
  )
}

export default Home