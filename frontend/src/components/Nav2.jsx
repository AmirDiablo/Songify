import { useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { SlHome } from "react-icons/sl";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";

const Nav2 = ({openPanel, setOpenPanel}) => {
    const path = useRef()

    path.current = useLocation().pathname

    const openClose = ()=> {
        setOpenPanel(!openPanel)
    }

    return ( 
        <div className="bg-gray-900 w-[20%] text-white *:text-xl *:flex *:items-center *:gap-5 *:pl-5 *:py-4 fixed top-0 bottom-0 left-0 backdrop-blur-2xl ">

            <Link to="/" className={path.current == "/" ? "active" : ""}><SlHome /> Home</Link>
            <Link to="/search" className={path.current == "/search" ? "active" : ""}><LuSearch />Search</Link>
            <Link to="/library" className={path.current == "/library" ? "active" : ""}><MdOutlineLibraryMusic />Library</Link>
            <Link onClick={openClose}><FaPlus className={openPanel === false ? "transition-all duration-300" : "rotate-45 transition-all duration-300"} />Create</Link>
            <Link><IoSettingsOutline />Setting</Link>

        </div>
     );
}
 
export default Nav2;