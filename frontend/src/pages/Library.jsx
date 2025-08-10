import { useEffect, useState } from "react"
import ProfilePreview from "../components/ProfilePreview"
import {useUser} from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { usePlaylist } from "../context/PlaylistContext"
import { FaArrowLeft } from "react-icons/fa6";

const Library = () => {
    const { user } = useUser()
    const myId = user?.userInfo[0]?._id
    const {setSelectedId} = usePlaylist()
    const [followings, setFollwings] = useState([])
    const [playlists, setPlaylists] = useState([])
    const navigate = useNavigate()

    console.log(user.token)
    
    const fetchFollowings = async()=> {
        const response = await fetch("http://localhost:3000/api/account/followings?q="+myId)
        const json = await response.json()

        if(response.ok) {
            setFollwings(json)
        }
    }

    const fetchPlaylists = async()=> {
        const response = await fetch("http://localhost:3000/api/playlist/myPlaylists?q="+myId, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            setPlaylists(json)
        }
    }

    const open = (playlist)=> {
        setSelectedId(playlist._id)
        navigate("/playlistDetails?q="+playlist._id)
    }


    useEffect(()=> {
        if(user.token) {
            fetchPlaylists()
        }
    }, [ , user.token])

    useEffect(()=> {
        if(myId) {
            fetchFollowings()
        }
    }, [ , myId])

    return ( 
        <div className="text-white pt-15 relative">

            <div className="flex items-center absolute top-0 right-0 left-0 bg-gray-900 p-4 space-x-10">
                <div onClick={()=> navigate(-1)} className="text-2xl"><FaArrowLeft /></div>
                <p className="text-xl font-[600]">Library</p>
            </div>

            {followings?.length != 0 && 
                <div className="mt-10">
                <strong className="px-5">Artists</strong>

                {followings.map(item=> (
                    <div key={item._id} onClick={()=> navigate("/profile?q="+item?._id)}>
                        <ProfilePreview artist={item} />
                    </div>
                ))}
            </div>
            }

            {playlists?.length != 0 && 
                <div className="px-5 mt-5">
                    <strong >Playlist</strong>

                    <div className="space-y-3 mt-5">
                        {playlists?.map(item=> (
                        <div key={item._id} onClick={()=> open(item)} className="flex items-center gap-2">
                            <img src={"/cover/"+item?.cover} className="aspect-square w-20 rounded-2xl"/>
                            <div>
                                <p className="text-[20px] font-[600]">{item?.name}</p>
                                <div className="flex gap-1"><p className="text-white/50">Playlist by</p> {item?.creatorId?.username}</div>
                            </div>
                        </div>
                    ))}
                    </div>

                </div>
            }

        </div>
     );
}
 
export default Library;