import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Musics from "../components/Musics"
import { FiEdit2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { LuCirclePlus } from "react-icons/lu";
import { useUser } from "../context/UserContext";
import { GoTrash } from "react-icons/go";
import { usePlaylist } from "../context/PlaylistContext";
import { FaArrowLeft } from "react-icons/fa6";

const PlaylistDetails = () => {
    const {user} = useUser()
    const {playlists, addToLib, deleteFromLib} = usePlaylist()
    const playlitId = useLocation().search.split("=")[1]
    const [infos, setInfos] = useState()
    const navigate = useNavigate()
    const myId = user?.userInfo[0]._id

    const fetchInfos = async ()=> {
        const response = await fetch("http://localhost:3000/api/playlist/playlistInfo?q="+playlitId)
        const json = await response.json()

        if(response.json) {
            setInfos(json)
        }
    }

    useEffect(()=> {
        fetchInfos()
    }, [])

    const deletePlaylist = async()=> {
        if(infos.creatorId._id == myId) {
            //remove from app
            const response = await fetch("http://localhost:3000/api/playlist/delete", {
                method: "DELETE",
                body: JSON.stringify({playlistId: playlitId, userId: myId}),
                headers: {
                    "Content-Type" : "application/json",
                    "authorization" : `Bearer ${user.token}`
                }
            })

            if(response.ok) {
                deleteFromLib(playlitId)
                navigate(-1)
            }
        }else{
            //remove from library
            const response = await fetch("http://localhost:3000/api/playlist/deleteFromLibrary", {
                method: "DELETE",
                body: JSON.stringify({playlistId: playlitId, userId: myId}),
                headers: {
                    "Content-Type" : "application/json", 
                    "authorization" : `Bearer ${user.token}`
                }
            })
            
            if(response.ok) {
                deleteFromLib(playlitId)
                navigate(-1)
            }
        }
    }

    const savePlaylist = async()=> {
        const response = await fetch("http://localhost:3000/api/playlist/savePlaylist", {
            method: "POST",
            body: JSON.stringify({userId: myId, playlistId: playlitId}),
            headers: {
                "Content-Type" : "application/json",
                "authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            console.log("added")
            addToLib(infos)
        }
    }

    const checkIfExist = ()=> {
        let isExist;
        playlists.forEach(element => {
            if(element._id == playlitId) {
                isExist = true
            }
        });

        return isExist
    }

    return ( 
        <div className="text-white pb-40">

            <div onClick={()=> navigate(-1)} className="text-2xl absolute top-10 left-5 z-10 bg-black p-2 rounded-full"><FaArrowLeft /></div>

            <div className="bg-gradient-to-b relative from-neutral-800 flex items-center h-100">
                <img src={"/cover/"+infos?.cover} alt="cover" className="w-[50%] aspect-square mx-auto rounded-2xl" />
                <p className="absolute bottom-12 left-5 text-[25px] font-[600]">{infos?.name}</p>
                <div className="absolute bottom-0 left-5 ">
                    <div onClick={()=> navigate("/profile?q="+infos?.creatorId?._id)} className="flex items-center gap-2"> 
                        <img src={"/profiles/"+infos?.creatorId?.profile} alt="profile" className="w-6 rounded-full aspect-square" />
                        <p className="">{infos?.creatorId?.username }</p>
                    </div>
                    <p className="text-white/50">28 min</p>
                </div>    
            </div>


            <div className="flex gap-3 px-5 mt-3">
                {myId == infos?.creatorId._id && 
                    <div className="flex gap-3">
                        <button onClick={()=> navigate("/addToPlaylist", {state: {playlist: infos}})} className="flex items-center gap-2 bg-gray-800 p-2 rounded-2xl"><FaPlus /> Add</button>
                        <button onClick={()=> navigate("/editPlaylist", {state: {playlist: infos}})} className="flex items-center gap-2 bg-gray-800 p-2 rounded-2xl"><FiEdit2 /> Edit</button>
                    </div>
                }
                {checkIfExist() ? <button onClick={deletePlaylist} className="flex aspect-square text-xl items-center gap-2 bg-gray-800 p-2 rounded-2xl"><GoTrash /></button> : <button onClick={savePlaylist} className="flex aspect-square text-xl items-center gap-2 bg-gray-800 p-2 rounded-2xl"><LuCirclePlus /></button>}
            </div>

            

            <div>

                {infos?.tracks.map((item, index)=> (
                    <Musics song={item} playList={infos.tracks} songIndex={index} />
                ))}

            </div>
             

        </div>
     );
}
 
export default PlaylistDetails;