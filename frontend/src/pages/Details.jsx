import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Musics from "../components/Musics"

const Details = () => {
    const {state} = useLocation()
    const {info} = state
    const q = useLocation().search.split("=")[1]
    const [songs, setSongs] = useState([])
    const [single, setSingle] = useState([])
    const naviagte = useNavigate()

    console.log(info)

    const songsOfAlbum = async()=> {
        const response = await fetch("http://localhost:3000/api/product/songsOfAlbum?q="+info.title+"&n="+info.artistId._id)
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setSongs(json)
        }
    }

    const findResults = async()=> {
        const response = await fetch("http://localhost:3000/api/product/findSingle?q="+info._id)
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setSingle(json)
        }

    }

    useEffect(()=> {
        songsOfAlbum()
        findResults()
    }, [])

    return ( 
        <div className="text-white">

            {q === "album" ? <>
                <div className="bg-gradient-to-b relative from-neutral-800 flex items-center h-100">
                    <img src={"/cover/"+info.cover} alt="cover" className="w-[50%] aspect-square mx-auto rounded-2xl" />
                    <p className="absolute bottom-12 left-5 text-[25px] font-[600]">{info.title}</p>
                    <div className="absolute bottom-0 left-5 ">
                        <div onClick={()=> naviagte("/profile?q="+info.artistId._id)} className="flex items-center gap-2"> 
                            <img src={"/profiles/"+info.artistId.profile} alt="profile" className="w-6 rounded-full " />
                            <p className="">{info.artistId.username }</p>
                        </div>
                        <p className="text-white/50">Album . {info.releaseDate}</p>
                    </div>    
                </div>

                <div className="mt-10">
                    {songs.map((item, index)=> (
                        <Musics song={item} playList={songs} songIndex={index} />
                    ))}
                </div>
            </> : <>
                    <div className="bg-gradient-to-b relative from-neutral-800 flex items-center h-100">
                        <img src={"/cover/"+info.cover} alt="cover" className="w-[50%] aspect-square mx-auto rounded-2xl" />
                        <p className="absolute bottom-12 left-5 text-[25px] font-[600]">{info.title}</p>
                        <div className="absolute bottom-0 left-5 ">
                            <div onClick={()=> naviagte("/profile?q="+info.artistId._id)} className="flex items-center gap-2"> 
                                <img src={"/profiles/"+info.artistId.profile} alt="profile" className="w-6 rounded-full " />
                                <p className="">{info.artistId.username }</p>
                            </div>
                            <p className="text-white/50">Single . {info.releaseDate}</p>
                        </div>    
                    </div>

                    <div className="mt-10">
                        {single.map((item, index)=> (
                            <Musics song={item} playList={single} songIndex={index} />
                        ))}
                    </div>
            </> }

        </div>
     );
}
 
export default Details;