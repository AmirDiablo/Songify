import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { usePlaylist } from "../context/PlaylistContext";
import { FaArrowLeft } from "react-icons/fa6";


const ListenerProfile = () => {
    const {user} = useUser()
    const {setSelectedId} = usePlaylist()
    const myId = user?.userInfo[0]?._id
    const [playlists, setPlaylists] = useState([])
    const navigate = useNavigate()
    

    const fetchPlaylists = async()=> {
        const response = await fetch("http://localhost:3000/api/playlist/accountPlaylist?q="+myId, {
            method: "GET",
            headers: {
                "authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setPlaylists(json)
        }
    }

    useEffect(()=> {
        if(myId) {
            fetchPlaylists()
        }
    }, [myId])


    const open = (playlist)=> {
        setSelectedId(playlist._id)
        navigate("/playlistDetails?q="+playlist._id)
    }

    return ( 
        <div className="text-white pt-10 relative">

            <div className="flex items-center absolute top-0 right-0 left-0 bg-gray-900 p-4 space-x-10">
                <div onClick={()=> navigate(-1)} className="text-2xl"><FaArrowLeft /></div>
                <p className="text-xl font-[600]">Profile</p>
            </div>

            <div className="flex items-center gap-5 px-5 mt-10">
                <img src={"/profiles/"+user?.userInfo[0].profile} className="w-30 rounded-full aspect-square" />
                <div>
                    <p className="text-2xl font-[600]">{user?.userInfo[0].username}</p>
                    <div className="flex gap-5">
                        <div className="flex gap-1"><p>{user?.userInfo[0].followers?.length}</p><p className="text-white/50">followers</p></div>
                        <div className="flex gap-1"><p>{user?.userInfo[0].followings?.length}</p><p className="text-white/50">followings</p></div>
                    </div>
                </div>
            </div>

            <button onClick={()=> navigate("/editProfile")} className="border-1  rounded-2xl px-5 py-2 ml-5 mt-5">Edit</button>

            <div className="px-5 mt-10">
                <strong className="text-2xl">Playlists</strong>

                <div className="mt-5 space-y-3">
                    {playlists?.map(item=> (
                        <div onClick={()=> open(item)} key={item?._id} className="flex gap-5">
                            <img src={"/cover/"+item?.cover} className="w-15" />
                            <div>
                                <div>{item?.name}</div>
                                <div className="text-white/50">{item.saveCount} saves</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
     );
}
 
export default ListenerProfile;