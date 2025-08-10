import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { LuSearch } from "react-icons/lu";

const SearchBar = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const debounceTimeout = useRef(null)
    const navigate = useNavigate()

    useEffect(()=> {
        if(!query) {
            setResults([])
            return
        }

        //debounce api calls by 300ms
        if(debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }

        debounceTimeout.current = setTimeout(()=> {
            setLoading(true)
            fetch(`http://localhost:3000/api/account/liveSearch?q=${encodeURIComponent(query)}`)
            .then((res)=> res.json())
            .then((data)=> {
                setResults(data)
                setLoading(false)
            })
            .catch(()=> {
                setResults([])
                setLoading(false)
            })
        }, 300)

        return ()=> clearTimeout(debounceTimeout.current)
    }, [ ,query])

    const search = (e)=> {
        e.preventDefault()
        navigate("/results?q="+query)
    }

    const openProfile = (item)=> {
        navigate("profile", {state: {profile: item}})
    }

    return ( 
        <div className="bg-[#09080e] mx-auto  w-[100%] py-2">

            <form onSubmit={search} className="relative flex items-center justify-center">
                <input onChange={(e)=> setQuery(e.target.value)} type="search" placeholder="What do you want to listen to?" style={{paddingLeft: "40px"}} className="focus:outline-none bg-amber-50 rounded-[7px] p-2  text-xl text-black w-[90%]" />
                {/* <div onClick={search} className="absolute left-[21px] rounded-l-[7px] text-2xl p-[10px] text-black"><LuSearch /></div> */}
            </form>

            {results.length !== 0 && (
                <div className=" p-2 rounded-b-2xl bg-gray-800 w-[90%] mx-auto">
                    {results.map(item=> (
                        <div key={item._id} onClick={()=> openProfile(item)} className="text-white flex items-center gap-2">
                            <img src={"/profiles/"+item.profile} className="rounded-full aspect-square w-15" />
                            <p>{item.username}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
     );
}
 
export default SearchBar;