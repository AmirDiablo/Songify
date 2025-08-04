import { createContext, useContext, useEffect, useState } from "react";

const PlayerContext = createContext()

export const PlayerProvider = ({ children })=> {
    const [songs, setSongs] = useState([])              //for storing songs
    const [play , setPlay] = useState(false)            //playing status
    const [index, setIndex] = useState(0)               //which song should be play in songs array
    const [isHidden, setIsHidden] = useState(true)     //player should be hidden or not
    const [pause, setPause] = useState(false)           //just for handle icons
    const [isOpen, setIsOpen] = useState(false)         //
    
    return (
        <PlayerContext.Provider value={{songs, setSongs, play, setPlay, index, setIndex, isHidden, setIsHidden, setPause, pause, isOpen, setIsOpen}}>
            {children}
        </PlayerContext.Provider>
    )
}

//hook
export const usePlayer = ()=> {
    return useContext(PlayerContext)
}