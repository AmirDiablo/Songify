import { SlHome } from "react-icons/sl";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";
import { LuSearch } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { IoShuffle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";


const Nav = ({changePanel, openPanel, setOpenPanel}) => {
    const path = useRef()
    const {setIsRandom, isRandom, setSongs, setPlay, setIsHidden, setIsOpen, updatePlayedSongs, playedSongs} = usePlayer()

    path.current = useLocation().pathname

    const openClose = ()=> {
        setOpenPanel(!openPanel)
    }

    //a button to play random musics from db
    const shuffle = async()=> {

        const fetchRandom = async(random)=> {
            if(random){
                const response = await fetch("http://localhost:3000/api/product/random")
                const json = await response.json()

                if(response.ok){
                    setSongs(json)
                    setPlay(true)
                    setIsHidden(false)
                    setIsOpen(true)
                    for(let i=0; i<json?.length; i++) {
                        for(let j=0; j<playedSongs?.length; j++) {
                            if(json[i]._id == playedSongs[j]._id) {
                                json.splice(i, 1)
                            }
                        }
                    }
                    updatePlayedSongs(json)
                }
            }
        }

        setIsRandom(pre=> {
            const newValue = !pre
            
            fetchRandom(newValue)

            document.querySelector(".smallPLaying").style.display = "inline"

            return newValue
        })

    }

    return ( 
        <div className="*:transition-background *:duration-300 w-[90%]  bottom-10 bg-white/20 h-max mx-auto rounded-full *:text-white *:text-[25px] *:p-4 *:rounded-full *:text-center flex justify-between backdrop-blur-2xl">

            <Link to="/" className={path.current == "/" ? "active" : ""}><SlHome /></Link>
            <Link to="/search" className={path.current == "/search" ? "active" : ""}><LuSearch /></Link>
            <Link to="/library" className={path.current == "/library" ? "active" : ""}><MdOutlineLibraryMusic /></Link>
            <Link onClick={openClose}><FaPlus className={openPanel === false ? "transition-all duration-300" : "rotate-45 transition-all duration-300"} /></Link>
            <Link><IoShuffle onClick={shuffle} /></Link>

        </div>
     );
}
 
export default Nav;