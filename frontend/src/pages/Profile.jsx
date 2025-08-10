import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa6";
import Musics from "../components/Musics";
import {useUser} from "../context/UserContext"

const Profile = () => {
    const { user, updateFollowings, followings } = useUser()
    const myId = user?.userInfo[0]._id
    const [artist, setArtist] = useState([])
    const [songs, setSongs] = useState([])
    const [albums, setAlbums] = useState([])
    const navigate = useNavigate()
    const q = useLocation().search.split("=")[1]?.split("&")[0]  //id
    /* const n = useLocation().search.split("&")[1].split("=")[1]  //name */

    const fetchArtist = async()=> {
        const response = await fetch("http://localhost:3000/api/account/userInfo?q="+q, {
            method: "GET",
            headers: {
                "authorization" : `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setArtist(json)
        }

    }

    const fetchSongs = async()=> {
        const response = await fetch("http://localhost:3000/api/product/someSongs?q="+q)
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setSongs(json)
        }
    }

    const fetchAlbums = async()=> {
        const response = await fetch("http://localhost:3000/api/product/someAlbums?q="+q)
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setAlbums(json)
        }
    }

    const follow = async()=> {
        const response = await fetch("http://localhost:3000/api/account/follow", {
            method: "PUT",
            body: JSON.stringify({follower: myId, following: q}),
            headers: {
                "Content-Type" : "application/json",
                "authorization" : `Bearer ${user.token}`
            }
        })

        updateFollowings(q)
    }

    useEffect(()=> {
        fetchArtist()
        fetchSongs()
        fetchAlbums()
    }, [])

    const open = ()=> {
        navigate(`/releases?q=${q}`)
    }

    return ( 
        <div className="text-white pb-50 lg:p-10 lg:pb-20">

            {artist.map(item=> (
                <div className="profile">
                    <div>

                        <div className="relative  mx-auto div1">
                            <img src={"/profiles/"+item.profile} className="w-screen"  />
                            <p className="text-3xl font-[700] flex pl-5 pb-5 items-end absolute bottom-0 top-0 left-0 right-0 bg-black/20 w-[100%]">{item.username}</p>
                        </div>

                        <div className="flex items-center justify-between px-5 py-5 md:mx-auto  div2">
                            <button onClick={follow} className="border-1 border-white rounded-full px-5 py-1">{followings.includes(item._id) ? "unFollow" : "follow"}</button>
                            <div className="p-2 text-black text-[25px] flex justify-center items-center bg-green-500 aspect-square rounded-full w-15"><FaPlay /></div>
                        </div>

                    </div>

                    {/* <div>
                        <strong>Popular Songs</strong>


                    </div> */}


                    <div className="div3">
                        <strong className="ml-5">All Songs</strong>

                        {songs.map((item, index)=> (
                            <Musics song={item} playList={songs} songIndex={index} />
                        ))}

                        <button onClick={()=> open('songs')} className="border-1 block mx-auto mt-5 text-white/50 border-white/50 rounded-full px-5 py-1">See All</button>
                    </div>


                    {/* <div className="mt-10">
                        <strong className="ml-5">Albums</strong>
                        <div className="flex gap-2 justify-center flex-wrap mt-5">
                            {albums.map(item=> (
                                <div>
                                    <img src={"/cover/"+item.cover} className="w-35 aspect-square"/>
                                </div>
                            ))}
                        </div>

                        <button onClick={()=> open("albums")} className="border-1 block mx-auto mt-5 mb-10 text-white/50 border-white/50 rounded-full px-5 py-1">See All</button>
                    </div> */}


                </div>
            ))}

        </div>
     );
}
 
export default Profile;