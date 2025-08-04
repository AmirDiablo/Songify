import { SlHome } from "react-icons/sl";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa6";
import { LuSearch } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useLocation } from "react-router-dom";


const Nav = ({changePanel, openPanel, setOpenPanel}) => {
    const path = useRef()

    path.current = useLocation().pathname

    const openClose = ()=> {
        setOpenPanel(!openPanel)
    }

    return ( 
        <div className="*:transition-background *:duration-300 w-[90%]  bottom-10 bg-white/20 h-max mx-auto rounded-full *:text-white *:text-[25px] *:p-4 *:rounded-full *:text-center flex justify-between backdrop-blur-2xl">

            <Link to="/" className={path.current == "/" ? "active" : ""}><SlHome /></Link>
            <Link to="/search" className={path.current == "/search" ? "active" : ""}><LuSearch /></Link>
            <Link to="/library" className={path.current == "/library" ? "active" : ""}><MdOutlineLibraryMusic /></Link>
            <Link onClick={openClose}><FaPlus className={openPanel === false ? "transition-all duration-300" : "rotate-45 transition-all duration-300"} /></Link>
            <Link><IoSettingsOutline /></Link>

        </div>
     );
}
 
export default Nav;