import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Musics from "../components/Musics";
import ProfilePreview from "../components/ProfilePreview";
import SearchBar from "../components/SearchBar";

const Results = () => {
    const q= useLocation().search.split("=")[1]
    const [results, setResults] = useState([])
    const [Artist, setArtist] = useState([])
    const [playlists, setPlaylists] = useState([])
    const navigate = useNavigate()

    const findResults = async()=> {
        const response = await fetch("http://localhost:3000/api/product/find?q="+q)
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setResults(json)
        }

    }

    const findArtist = async()=> {
        const response = await fetch("http://localhost:3000/api/account/liveSearch?q="+q)
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setArtist(json)
        }
    }

    const findPlaylists = async()=> {
        const response = await fetch("http://localhost:3000/api/playlist/findPlaylist?q="+q)
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setPlaylists(json)
        }
    }
    
    useEffect(()=> {
        findResults()
        findArtist()
        findPlaylists()
    }, [q])

    const open = (id, route)=> {
        navigate(`/${route}?q=`+id)
    }

    return ( 
        <div className="text-white pt-10 pb-50">

            <div className="mt-5">
                <SearchBar />
            </div>

            {Artist.map((item)=> (
                <div key={item._id} onClick={()=> open(item._id, "profile")}>
                    <ProfilePreview artist={item} />
                </div>
            ))}


            {playlists.map(item=> (
                <div key={item._id} onClick={()=> open(item._id, "playlistDetails")} className="flex items-center mt-10 px-5 gap-5">
                    <img src={"/cover/"+item.cover} className="aspect-square w-20 rounded-2xl"/>
                    <div>
                        <p className="text-[20px] font-[600]">{item.name}</p>
                        <div className="flex gap-1"><p className="text-white/50">Playlist by</p> {item.creatorId.username}</div>
                    </div>
                </div>
            ))}

            {results.map((item, index)=> (
                <div key={item._id}>
                    <Musics song={item} playList={results} songIndex={index} />
                </div>
            ))}
        </div>
     );
}
 
export default Results;