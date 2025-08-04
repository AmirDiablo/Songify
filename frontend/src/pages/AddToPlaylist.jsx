import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { LuSearch } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { useUser } from "../context/UserContext";
import { usePlaylist } from "../context/PlaylistContext";

const AddToPlaylist = () => {
    const {user} = useUser()
    const {addToPlaylist, selectedTracks} = usePlaylist()
    const [query, setQuery] = useState('')
    const [filtered, setFiltered] = useState([])
    const [results, setResults] = useState([])
    const {state} = useLocation()
    const {playlist} = state
    const myId = user?.userInfo[0]?._id

    const search = async(e)=> {
        e.preventDefault()
        
        const response = await fetch("http://localhost:3000/api/product/find?q="+query)
        const json = await response.json()

        if(response.ok) {
            setResults(json)    
        }
    }

    const AddToPlaylist = async(song)=> {
        const response = await fetch("http://localhost:3000/api/playlist/addToPlaylist", {
            method: "PATCH",
            body: JSON.stringify({trackId: song._id, playlistId: playlist._id, userId: myId}),
            headers: {
                "Content-Type" : "application/json",
                "authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            console.log("added")
            addToPlaylist(song)
        }
    }


    useEffect(()=> {
        const filtered = results.filter(
            (music)=> !selectedTracks.some( (item)=> item._id === music._id )
        );
        setFiltered(filtered)
    }, [selectedTracks, results])

    return ( 
        <div className="text-white">

            <div className="fixed left-0 right-0 top-0 bg-[#09080e] w-screen py-2">

                <form onSubmit={search} className="relative flex items-center justify-center">
                    <input onChange={(e)=> setQuery(e.target.value)} type="search" placeholder="What do you want to listen to?" style={{paddingLeft: "40px"}} className="focus:outline-none bg-amber-50 rounded-[7px] p-2  text-xl text-black w-[90%]" />
                    <div onClick={search} className="absolute left-[21px] rounded-l-[7px] text-2xl p-[10px] text-black"><LuSearch /></div>
                </form>

            </div>


            {filtered.length != 0 && 
                <div className="bg-gray-800 rounded-2xl mx-5 mt-20 h-max-180 pb-5 overflow-auto">
                
                {filtered.map(item=> (
                    <div key={item._id} className="flex items-center gap-5 px-5 relative">
                        <img src={"/cover/"+item.cover} className="rounded-3xl aspect-square w-20 mt-5" />
                        <div>
                            <p className="text-[17px] font-[600]">{item.title}</p>
                            <div className="flex"><p className="text-white/50">By</p> <p className="ml-2">{item.artistId.username}</p> <p className="text-white/50"></p></div>
                        </div>

                        <div onClick={()=> AddToPlaylist(item)} className="border-1 border-white rounded-full p-1 absolute right-5"><FaPlus /></div>
                    </div>
                ))}
                  
            </div>
            }

        </div>
     );
}
 
export default AddToPlaylist;