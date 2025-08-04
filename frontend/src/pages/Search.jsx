import eminem from "../assets/Eminem2.jfif"
import metal from "../assets/metal.jfif"
import pop from '../assets/pop.jfif'
import rock from '../assets/rock.jfif'
import phonk from "../assets/phonk.jfif"
import country from "../assets/country.jfif"
import popPunk from "../assets/popPunk2.jfif"
import rockandRoll from "../assets/rockandRoll.jfif"
import RandB from "../assets/R&B.jfif"
import blues from "../assets/blues.jfif"
import SearchBar from "../components/SearchBar";
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const navigate = useNavigate()

    return ( 
        <div className="text-white">
            <h1 className="text-2xl font-[600] ml-5 py-5">Search</h1>

            <SearchBar />

            <p className="text-xl font-[600] px-5 mb-5 mt-10">Browse all</p>
            <div className="genres px-5 *:aspect-video *:h-25 *:bg-red-400 *:rounded-xl flex flex-row flex-wrap justify-center gap-3">
                <div onClick={()=> navigate("/results?q=hip hop")} className="hiphop" style={{backgroundImage: `url(${eminem})`}}>
                    <p className="bg-black/20 h-[100%] text-[20px] flex items-center justify-center font-[700]">Hip-Hop</p>
                </div>
                <div onClick={()=> navigate("/results?q=metal")} style={{backgroundImage: `url(${metal})`}}>
                    <p className="bg-black/20 h-[100%] text-[20px] flex items-center justify-center font-[700]">Metal</p>
                </div>
                <div onClick={()=> navigate("/results?q=pop")} style={{backgroundImage: `url(${pop})`}}>
                    <p className="bg-black/20 h-[100%] text-[20px] flex items-center justify-center font-[700]">Pop</p>
                </div>
                <div onClick={()=> navigate("/results?q=rock")} style={{backgroundImage: `url(${rock})`}}>
                    <p className="bg-black/20 h-[100%] text-[20px] flex items-center justify-center font-[700]">Rock</p>
                </div>
                <div onClick={()=> navigate("/results?q=phonk")} style={{backgroundImage: `url(${phonk})`}}>
                    <p className="bg-black/20 h-[100%] text-[20px] flex items-center justify-center font-[700]">Phonk</p>
                </div>
                <div onClick={()=> navigate("/results?q=country")} style={{backgroundImage: `url(${country})`}}>
                    <p className="bg-black/20 h-[100%] text-[20px] flex items-center justify-center font-[700]">Country</p>
                </div>
                <div onClick={()=> navigate("/results?q=punk")} style={{backgroundImage: `url(${popPunk})`}}>
                    <p className="bg-black/50 h-[100%] text-[20px] flex items-center justify-center font-[700]">punk</p>
                </div>
                <div onClick={()=> navigate("/results?q=rock and roll")} style={{backgroundImage: `url(${rockandRoll})`}}>
                    <p className="bg-black/30 h-[100%] text-[20px] flex items-center justify-center font-[700]">Rock and Roll</p>
                </div>
                <div onClick={()=> navigate("/results?q=r and b")} style={{backgroundImage: `url(${RandB})`}}>
                    <p className="bg-black/20 h-[100%] text-[20px] flex items-center justify-center font-[700]">R&B</p>
                </div>
                <div onClick={()=> navigate("/results?q=blues")} style={{backgroundImage: `url(${blues})`}}>
                    <p className="bg-black/20 h-[100%] text-[20px] flex items-center justify-center font-[700]">Blues</p>
                </div>
            </div>

        </div>
     );
}
 
export default Search;