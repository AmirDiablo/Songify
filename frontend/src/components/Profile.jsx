import defualtProfile from "../assets/profile.jpg"
import { LuSearch } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa6";
import { useState } from "react";

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false)

    const openMenu = ()=> {
        if(isOpen) {
            const menu = document.querySelector(".menu")
            menu.style.left = "-90%"
        }else{
            const menu = document.querySelector(".menu")
            menu.style.left = "0%"
        }
        setIsOpen(!isOpen)
    }

    return ( 
        <div className=" relative z-0">

            <div className="-translate-x-[20px] -translate-y-[20px] *:w-45 *:aspect-video w-40 aspect-video *:blur-xl flex flex-col gap-1 rotate-45 z-0">
                <div className="pinklight"></div>
                <div className="bluelight"></div>
            </div>

           <div className="absolute top-10 left-0 right-0 px-10">
                <div onClick={openMenu} className=" flex items-center justify-between text-white z-2">
                    <img src={defualtProfile} className="rounded-full w-13" />
                </div>

                <p className="text-[25px] font-[600] text-white mt-5">Hi, Amir</p>
           </div>

        </div>
     );
}
 
export default Profile;