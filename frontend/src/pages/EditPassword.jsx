import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const EditPassword = () => {
    const {user} = useUser()
    const [currentPass, setCurrentPass] = useState()
    const [newPass, setNewPass] = useState()
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const changePass = async (e)=> {
        e.preventDefault()
        const response = await fetch("http://localhost:3000/api/account/changePass", {
            method: "PATCH",
            body: JSON.stringify({currentPass, newPass, id: user.userInfo[0]._id}),
            headers: {
                "Content-Type" : "application/json"
            }
        })

        const json = await response.json()

        if(response.ok){
            setError(null)
            navigate("/")
        }
        if(!response.ok) {
            setError(json.error)
        }
    }

    const setpass = async(e)=> {
        e.preventDefault()
        const resposne = await fetch("http://localhost:3000/api/account/setPass", {
            method: "PATCH",
            body: JSON.stringify({newPass, id: user.userInfo[0]._id}),
            headers: {
                "Content-Type" : "application/json"
            }
        })

        const json = await resposne.json()

        if(!resposne.ok) {
            setError(json.error)
        }
        if(resposne.ok) {
            setError(null)
            navigate("/")
        }
    }

    return ( 
        <div className="text-white">

            {user?.userInfo[0]?.password ? 
                <form onSubmit={changePass} className="bg-white flex flex-col gap-3  rounded-2xl mx-5 mt-10 py-5 px-5" action="">
                    <div className="flex flex-col">
                        <label className="text-black" htmlFor="">Current Password</label>
                        <input className="border-1 text-black border-black rounded-[10px] p-2" type="text" onChange={(e)=> setCurrentPass(e.target.value)} value={currentPass} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="" className="text-black">New Password</label>
                        <input className="border-1 text-black border-black rounded-[10px] p-2" type="text" onChange={(e)=> setNewPass(e.target.value)} value={newPass} />
                    </div>

                    <button className="text-black mt-5 bg-green-500 rounded-[10px] px-5 py-3 w-max mx-auto">Submit Changes</button>
                </form>
                :
                <form onSubmit={setpass} className="bg-white rounded-2xl py-5 px-5 mx-5 mt-10 flex flex-col">
                    <div className="flex flex-col">
                        <label htmlFor="" className="text-black">Set Password</label>
                        <input className="border-1 text-black border-black rounded-[10px] p-2" type="text" onChange={(e)=> setNewPass(e.target.value)} value={newPass} />
                    </div>

                    <button className="text-black mt-5 bg-green-500 rounded-[10px] px-5 py-3 w-max mx-auto ">Submit</button>

                </form>
        }

        {error && <div className="bg-red-500 w-[90%] mt-10 text-center text-white font-[600] mx-auto rounded-2xl p-2">{error}</div>}

        </div>
     );
}
 
export default EditPassword;