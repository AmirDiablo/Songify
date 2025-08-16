import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";
import { usePlayer } from "../context/PlayerContext";

const SmallPlaying = ({}) => {
    const {songs, setSongs, index, setIndex, setPause, setPlay, play, setIsOpen, setIsHidden} = usePlayer()

    const openPlayer = ()=> {
        setIsOpen(true)
        setIsHidden(false)
    }

    const playMusic = (e)=> {
        e.stopPropagation()
        document.querySelector(".smallPLaying").style.display = "inline"
        setPause(false)
        setPlay(true)
    }

    const pauseMusic = (e)=> {
        e.stopPropagation()
        setPause(true)
        setPlay(false)
    }

    return ( 
        <div onClick={openPlayer} className="smallPlaying flex items-center gap-2 bg-[#22202b] text-white ">
            <img src={"/cover/"+songs[index]?.cover} className="w-15"/>
            <div className="flex items-center w-[100%] justify-between">
                <div>
                    <p className="font-[600] text-[17px]">{songs[index]?.title}</p>
                    <p className="text-white/50">{songs[index]?.artistId.username}</p>
                </div>
                <div className="bg-black p-2 rounded-full mr-5">{play ? <FaPause onClick={(e)=> pauseMusic(e)} /> : <FaPlay onClick={(e)=> playMusic(e)} />}</div>
            </div>
        </div>
     );
}
 
export default SmallPlaying;