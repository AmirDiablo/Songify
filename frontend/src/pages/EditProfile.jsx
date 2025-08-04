import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { FaArrowLeft } from "react-icons/fa6";
import {useNavigate} from "react-router-dom"

const EditProfile = () => {
    const {user, updateProfile} = useUser()
    const [info, setInfo] = useState([])
    const [username, setUsername] = useState()
    const [file, setFile] = useState()
    const [preview, setPreview] = useState(null)
    const myId = user?.userInfo[0]?._id
    const navigate = useNavigate()

    const fetchUserInfo = async()=> {
        const response = await fetch("http://localhost:3000/api/account/userInfo?q="+myId, {
            method: "GET",
            headers: {
                "authorization" : `Bearer ${user.token}`
            }
        })
            const json = await response.json()

            if(response.ok) {
                setInfo(json)
                setUsername(json[0].username)
                setFile(json[0].profile)
            }
    }

    useEffect(()=> {
        if(myId) {
            fetchUserInfo()
        }
    }, [myId])

    const chnagePreview = (e)=> {
        setFile(e.target.files[0])
        const files = e.target.files[0]
        if(files) {
            const reader = new FileReader()
            reader.onloadend = ()=> {
                setPreview(reader.result)
            }

            reader.readAsDataURL(files)
        }
    }

    const save = async()=> {
        if(myId && username && file) {
            const formData = new FormData()
            formData.append("name", username)
            formData.append("profile", file)
            formData.append("id", myId)
            const response = await fetch("http://localhost:3000/api/account/editProfile", {
                method: "PATCH",
                body: formData,
                headers: {
                    "authorization" : `Bearer ${user?.token}`
                }
            })

            const json = await response.json()

            if(response.ok) {
                updateProfile(json)
                navigate(-1)
            }else{
                console.log(json)
            }
        }
    }

    return ( 
        <div className="text-white">

            <div className="flex items-center justify-between px-5 mt-5">
                <button onClick={()=> navigate(-1)} className="text-2xl bg-black p-3 rounded-2xl"><FaArrowLeft /></button>
                <button onClick={save} className="bg-white text-black font-[600] p-3 rounded-2xl">Save</button>
            </div>

            <div className="relative mt-10">
                {preview ? <img src={preview} alt="cover" className="w-[50%] rounded-full aspect-square mx-auto" /> : <img src={"/profiles/"+file} alt="cover" className="w-45 aspect-square mx-auto rounded-full" />}
                <input onChange={chnagePreview} type="file" name="profile" id="profile" className="opacity-0 absolute top-0 left-[50%] -translate-x-[50%] w-45 aspect-square rounded-full" />
            </div>
            <div className="flex flex-col w-[90%] mx-auto mt-10">
                <label htmlFor="">Username</label>
                <input type="text" className="text-center text-xl focus:outline-none border-1 rounded-2xl p-2 " onChange={(e)=> setUsername(e.target.value)} value={username} />
            </div>

        </div>
     );
}
 
export default EditProfile;