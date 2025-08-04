import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import {useUser} from "../context/UserContext"
import { FiMinusCircle } from "react-icons/fi";
import { usePlaylist } from "../context/PlaylistContext";


const EditPlaylist = () => {
    const {state} = useLocation()
    const {playlist} = state
    const [playlistName, setPlaylistName] = useState(playlist.name)
    const [file, setFile] = useState(playlist.cover)
    const [preview, setPreview] = useState(null)
    const navigate = useNavigate()
    const {user} = useUser()
    const {deleteFromPlaylist, selectedTracks} = usePlaylist()
    const myId = user?.userInfo[0]._id


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
        const formData = new FormData()
        formData.append("name", playlistName)
        formData.append("file", file)
        formData.append("id", playlist._id)
        const response = await fetch("http://localhost:3000/api/playlist/editPlaylist", {
            method: "PATCH",
            body: formData,
            headers: {
                "authorization" : `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if(response.ok) {
            console.log("changes saved")
            navigate(-1)
        }
    }

    const deleteFromPlaylst = async(songId)=> {
        const response = await fetch("http://localhost:3000/api/playlist/deleteFromPlaylst", {
            method: "PATCH",
            body: JSON.stringify({userId: myId, playlistId: playlist._id, songId: songId}),
            headers: {
                "Content-Type" : "application/json",
                "authorization" : `Bearer ${user.token}`
            }
        })

        if(response.ok) {
            deleteFromPlaylist(songId)
        }
    }


    return ( 
        <div className="text-white pb-30">
            
            <button onClick={()=> navigate(-1)} className="bg-black px-5 py-2 rounded-2xl text-[25px] w-max z-10  absolute left-5 top-5"><FaArrowLeft /></button>
            <button disabled={playlist.name == playlistName && playlist.cover == file} onClick={save} className={playlist.name == playlistName && playlist.cover == file ? "bg-black/10 px-5 py-2 rounded-2xl z-10 w-max  absolute right-5 top-5" : "bg-black px-5 py-2 rounded-2xl z-10 w-max  absolute right-5 top-5"}>Save</button>
            

            <div className="bg-gradient-to-b relative from-neutral-800 flex items-center h-100">
                {preview ? <img src={preview} alt="cover" className="w-[50%] aspect-square mx-auto rounded-2xl" /> : <img src={"/cover/"+file} alt="cover" className="w-[50%] aspect-square mx-auto rounded-2xl" />}
                <input className="absolute left-[50%] w-[50%] -translate-x-[50%] aspect-square rounded-2xl opacity-0" type="file" name="file" id="file" onChange={chnagePreview} />
                <p className="absolute bottom-14 left-[50%] -translate-x-[50%]">change playlist cover</p>
                <input className="absolute text-center -bottom-10 left-[50%] -translate-x-[50%] text-[25px] font-[600] border-b-1 focus:outline-none" onChange={(e)=> setPlaylistName(e.target.value)} value={playlistName}  />   
            </div>


            <div className="mt-20 space-y-5">
                {selectedTracks?.map((item, index)=> (
                    <div key={item._id} className="flex items-center gap-5 px-5">
                        <div onClick={()=> deleteFromPlaylst(item._id)} className="text-2xl"><FiMinusCircle /></div>
                        <img src={"/cover/"+item.cover} className="w-20 rounded-2xl" />
                        <div className="">
                            <p className="text-[17px] font-[600]">{item.title}</p>
                            <p>{item.artistId.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
     );
}
 
export default EditPlaylist;