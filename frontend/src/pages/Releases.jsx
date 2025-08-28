import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Releases = () => {
    const [albums, setAlbums] = useState([])
    const [singles, setSingles] = useState([])
    const q = useLocation().search.split("=")[1].split("&")[0]  //id
    /* const n = useLocation().search.split("&")[1].split("=")[1]  //name */
    const navigate = useNavigate()

    const fetchAlbums = async()=> {
        const response = await fetch("http://localhost:3000/api/product/albums?q="+q)
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setAlbums(json)
        }
    }

    const fetchsingles = async()=> {
        const response = await fetch("http://localhost:3000/api/product/singles?q="+q)
        const json = await response.json()

        if(!response.ok) {
            console.log(json.error)
        }
        if(response.ok) {
            setSingles(json)
        }
    }

    useEffect(()=> {
        fetchAlbums()
        fetchsingles()
    }, [])

    return ( 
        <div className="text-white pb-50">

            <div className="px-5 mt-5">
                <strong>Albums</strong>
                <div className="space-y-2 mt-5">
                    {albums.map(item=> (
                        <div onClick={()=> navigate("/details?q=album", {state: {info: item}})} className="flex items-center gap-2">
                            <img src={"/cover/"+item.cover} alt="album cover" className="w-30 aspect-square" />
                            <div>
                                <p className="text-[20px] font-[600]">{item.title}</p>
                                <p className="text-white/50">{item.releaseDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-5 mt-5">
                <strong>Singles</strong>
                <div className="space-y-2 mt-5">
                    {singles.map(item=> (
                        <div onClick={()=> navigate("/details?q=single", {state: {info: item}})} className="flex items-center gap-2">
                            <img src={"/cover/"+item.cover} alt="album cover" className="w-30 aspect-square" />
                            <div>
                                <p className="text-[20px] font-[600]">{item.title}</p>
                                <p className="text-white/50">{format(new Date(item.releaseDate), "MM/dd/yyyy")}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
     );
}
 
export default Releases;