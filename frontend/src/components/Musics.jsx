import { FaPlay } from "react-icons/fa6";
import { usePlayer } from "../context/PlayerContext";
import { FaPause } from "react-icons/fa6";

const Musics = ({song, songIndex, playSong, playList}) => {
    const {play, pause ,index, setSongs, setPlay, setIndex, setIsHidden, setPause, setIsOpen} = usePlayer()

    const playMusic = ()=> {
        document.querySelector(".smallPLaying").style.display = "inline"
        setSongs(playList)
        setIndex(songIndex)
        /* setIsOpen(true) */
        setPause(false)
        setPlay(true)
    }

    const pauseMusic = ()=> {
        setPause(true)
        setPlay(false)
    }

    return ( 
        <div className="text-white px-5">

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <img src={"/cover/"+song.cover} className="rounded-3xl aspect-square w-20 mt-5" />
                    <div>
                        <p className="text-[17px] font-[600]">{song.title}</p>
                        <div className="flex"><p className="text-white/50">By</p> <p className="ml-2">{song.artistId.username}</p> <p className="text-white/50"></p></div>
                    </div>
                </div>
                {index === songIndex && play && pause === false ? <FaPause onClick={pauseMusic} /> : <FaPlay onClick={()=> playMusic(song._id)}/>}
            </div>

        </div>
     );
}
 
export default Musics;