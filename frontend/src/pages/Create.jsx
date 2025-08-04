import { useState } from "react";
import {useLocation, useNavigate} from "react-router-dom"
import { useUser } from "../context/UserContext";


const Create = () => {
    const [name, setName] = useState('#MyPlayList')
    const q = useLocation().search.split("=")[1]
    const {user} = useUser()
    const navigate = useNavigate()

    const myId = user?.userInfo[0]?._id
    const isPublic = q == "public" ? true : false

    const create = async (e)=> {
        e.preventDefault()
        const response = await fetch("http://localhost:3000/api/playlist/create", {
            method: "POST",
            body: JSON.stringify({name, creatorId: myId, isPublic: isPublic}),
            headers: {
                "Content-Type" : "application/json",
                "authorization" : `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        //then navigate to that playlist as soon as the playlist has made
    }

    return ( 
        <div className="text-white bg-gradient-to-b from-gray-300 h-screen flex justify-center items-center">

            <div className="mx-10 space-y-3 ">
                <p className="text-[25px] font-[600] text-center">Give your playlist a name</p>
                <input type="text" className="border-b-white border-b-2 focus:outline-none w-[100%] p-3 text-center text-2xl" onChange={(e)=> setName(e.target.value)} value={name} />
                <div className="flex gap-10 w-max mx-auto mt-10">
                    <button onClick={(e)=> {e.preventDefault() ,navigate(-1)}} className="border-1 border-white rounded-full px-5 py-2">Cancel</button>
                    <button onClick={create} className="rounded-full  px-5 py-2 bg-green-500 text-black">Create</button>
                </div>
            </div>
            
        </div>
     );
}
 
export default Create;