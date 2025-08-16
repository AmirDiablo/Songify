import { createContext, useContext, useEffect, useState } from "react";

const PlayerContext = createContext()

export const PlayerProvider = ({ children })=> {
    const [songs, setSongs] = useState([])              //for storing songs
    const [play , setPlay] = useState(false)            //playing status
    const [index, setIndex] = useState(0)               //which song should be play in songs array
    const [isHidden, setIsHidden] = useState(true)     //player should be hidden or not
    const [pause, setPause] = useState(false)           //just for handle icons
    const [isOpen, setIsOpen] = useState(false)         //
    const [isRandom, setIsRandom] = useState(false)
    const [playedSongs, setPlayedSongs] = useState([])

    const updatePlayedSongs = (newSongs)=> {
        let playedSongslList = playedSongs
        newSongs.forEach(element => playedSongslList = [...playedSongslList, element]);
        setPlayedSongs(playedSongslList)
    }

    useEffect(()=> {
        console.log(playedSongs)
    }, [playedSongs])
    
    return (
        <PlayerContext.Provider value={{songs, setSongs, play, setPlay, index, setIndex, isHidden, setIsHidden, setPause, pause, isOpen, setIsOpen, setIsRandom, isRandom, updatePlayedSongs, playedSongs}}>
            {children}
        </PlayerContext.Provider>
    )
}

//hook
export const usePlayer = ()=> {
    return useContext(PlayerContext)
}