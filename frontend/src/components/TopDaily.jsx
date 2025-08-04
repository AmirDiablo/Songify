import demo from "../assets/cover.jfif"
import { FaPlay } from "react-icons/fa6";

const TopDaily = () => {
    return ( 
        <div className="text-white px-10">
            <div className="flex justify-between">
                <p className="text-[20px] font-[600]">Top Daily Playlist</p>
                <p className="text-white/50">See All</p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <img src={demo} className="rounded-3xl aspect-square w-20 mt-5" />
                    <div>
                        <p className="">Starlit Reverie</p>
                        <div className="flex"><p className="text-white/50">By</p> <p className="ml-2">Budiaty</p> <p className="text-white/50">. 8 songs</p></div>
                    </div>
                </div>
                <FaPlay/>
            </div>

        </div>
     );
}
 
export default TopDaily;