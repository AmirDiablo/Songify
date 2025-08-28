import { useEffect, useState } from "react";
import demo from "../assets/cover.jfif"
import { FaPlay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { usePlaylist } from "../context/PlaylistContext";

const TopDaily = () => {
    const [topPlaylists, setTopPlaylists] = useState([])
    const navigate = useNavigate()
    const {setSelectedId} = usePlaylist()

    const fetchTopPlaylists = async()=> {
        const response = await fetch("http://localhost:3000/api/playlist/dailyTopPlaylists")
        const json = await response.json()

        if(response.ok) {
            setTopPlaylists(json)
        }
    }

    const open = (item)=> {
        setSelectedId(item.playlistId._id)
        navigate(`/playlistDetails?q=${item.playlistId._id}`)
    }

    useEffect(()=> {
        fetchTopPlaylists()
    }, [])

    return ( 
        <div className="text-white px-10">
            <div className="flex justify-between">
                <p className="text-[20px] font-[600]">Top Daily Playlist</p>
                <p className="text-white/50">See All</p>
            </div>

            {topPlaylists?.length != 0 && 
                <div className="px-5 mt-5">

                    <div className="space-y-3 mt-5">
                        {topPlaylists?.map(item=> (
                        <div key={item._id} onClick={()=> open(item)} className="flex items-center gap-2">
                            <img src={"/cover/"+item?.playlistId?.cover} className="aspect-square object-cover w-20 rounded-2xl"/>
                            <div>
                                <p className="text-[20px] font-[600]">{item?.playlistId.name}</p>
                                <div className="flex gap-1"><p className="text-white/50">Playlist by</p> {item?.playlistId?.creatorId?.username}. <p className="text-white/50">{item?.playlistId?.tracks?.length} songs</p></div>
                            </div>
                        </div>
                    ))}
                    </div>

                </div>
            }

        </div>
     );
}
 
export default TopDaily;