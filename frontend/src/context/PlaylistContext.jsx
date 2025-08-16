import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const PlaylistContext = createContext()

export const PlaylistProvider = ({ children })=> {
    const {user} = useUser()
    const [selectedId, setSelectedId] = useState()       //selected playlist to show its tracks
    const [selectedTracks, setSelectedTracks] = useState([])
    const [playlists, setPlaylists] = useState([])    

    const addToPlaylist = (song)=> {
        const newList = selectedTracks.concat(song)
        setSelectedTracks(newList)
    }

    const deleteFromPlaylist = (songId)=> {
        const newList = selectedTracks.filter(track=> track._id !== songId)
        setSelectedTracks(newList)
    }

    //save playlist
    const addToLib = (playlist)=> {
        const newList = playlists.concat(playlist)
        setPlaylists(newList)
    }

    const deleteFromLib = (id)=> {
        const newList = playlists.filter(playlist=> playlist._id != id)
        setPlaylists(newList)
    }

    useEffect(()=> {
        const user = JSON.parse(localStorage.getItem("user"))
    
        const fetchPlaylists = async ()=> {
            const response = await fetch("http://localhost:3000/api/playlist/myPlaylists?q="+user.id, {
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

        if (user) {
            fetchPlaylists()
        }

    }, [])

    useEffect(()=> {
        const fetchSelected = async ()=> {
            const response = await fetch("http://localhost:3000/api/playlist/playlistInfo?q="+selectedId)
            const json = await response.json()

            if(response.ok) {
                const tracks = json.tracks
                setSelectedTracks(tracks)
            }
        }

        if(selectedId){
            fetchSelected()
        }
        
    }, [selectedId])
    
    return (
        <PlaylistContext.Provider value={{playlists, selectedTracks, setPlaylists, setSelectedId, addToPlaylist, deleteFromPlaylist, selectedId, addToLib, deleteFromLib}}>
            {children}
        </PlaylistContext.Provider>
    )
}

//hook
export const usePlaylist = ()=> {
    return useContext(PlaylistContext)
}