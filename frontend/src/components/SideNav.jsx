import { LuCirclePlus } from "react-icons/lu";
import { SlEnergy } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { useUser } from "../context/UserContext";

const SideNav = ({setIsOpen}) => {
    const {user} = useUser()

    const close = ()=> {
        const menu = document.querySelector(".menu")
        menu.style.left = "-90%"
        setIsOpen(false)
    }

    return ( 
        <div className="menu reltaive text-white w-[90%] bg-gray-900 px-5 fixed -left-[90%] top-0 py-5 bottom-0 z-10 transition-all duration-300">

            <div onClick={close} className="absolute top-10 right-5 text-2xl"><RxCross1 /></div>

            <Link to="/listenerProfile" className="flex items-center gap-5 w-[80%]">
                <img src={"profiles/"+user?.userInfo[0].profile} className="w-15 rounded-full aspect-square" />
                <div>
                    <p>{user?.userInfo[0].username}</p>
                    <p className="text-white/50">view Profile</p>
                </div>
            </Link>

            <div className=" mt-10">

                <Link to="/signup" className="flex items-center gap-3 p-2">
                    <div className="text-2xl"><LuCirclePlus /></div>
                    <p className="text-xl">Add account</p>
                </Link>

                <div className="flex items-center gap-3 p-2">
                    <div className="text-2xl"><SlEnergy /></div>
                    <p className="text-xl">What's new</p>
                </div>

                <div className="flex items-center gap-3 p-2">
                    <div className="text-2xl"><IoSettingsOutline /></div>
                    <p className="text-xl">Settings and privacy</p>
                </div>

            </div>

        </div>
     );
}
 
export default SideNav;