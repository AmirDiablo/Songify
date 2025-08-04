import Categories from "../components/Categories";
import girl from "../assets/girl.png"
import girl2 from "../assets/greenGirl.png"
import boy from "../assets/boy.png"
import TopDaily from "../components/TopDaily";
import { useState } from "react";
import SideNav from "../components/SideNav";
import defualtProfile from "../assets/profile.jpg"
import {useUser} from "../context/UserContext"

//we have a bug here. when a user login to account the user context is just id and token. so we should handle rendering this page when the info is not ready
const Home = () => {
    const {user} = useUser()
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
        <div>

            <div className=" relative z-0">
            
                <div className="-translate-x-[20px] -translate-y-[20px] *:w-45 *:aspect-video w-40 aspect-video *:blur-xl flex flex-col gap-1 rotate-45 z-0">
                    <div className="pinklight"></div>
                    <div className="bluelight"></div>
                </div>
    
                <div className="absolute top-10 left-0 right-0 px-10">
                    <div onClick={openMenu} className=" flex items-center justify-between text-white z-2">
                        <img src={"/profiles/"+user?.userInfo[0]?.profile} className="rounded-full w-13 aspect-square" />
                    </div>
    
                    <p className="text-[25px] font-[600] text-white mt-5">Hi, {user?.userInfo[0].username}</p>
                </div>
            
            </div>

            <Categories />

            <div className="mt-10 px-10 mb-10">
                <p className="text-white text-[20px] mb-3">Curated & Trending</p>
                <div className="flex gap-2 *:h-max *:flex-none overflow-x-auto hidenScroll">

                    <div className="rounded-3xl bg-purple-300 w-[90%] aspect-video relative">
                        <p className="text-[20px] font-[700] p-5">Discover weekly</p>
                        <p className="px-5 -mt-3 w-60">The original slow instrumental best playlist</p>
                        <img className="w-25 absolute right-0 bottom-0" src={girl} />
                    </div>

                    <div className="rounded-3xl bg-lime-400 w-[90%] aspect-video relative">
                        <p className="text-[20px] font-[700] p-5">Discover weekly</p>
                        <p className="px-5 -mt-3 w-60">The best and new phonk playlist</p>
                        <img src={girl2} className="w-30 absolute right-0 bottom-0" />
                    </div>

                    <div className="rounded-3xl bg-indigo-400 w-[90%] aspect-video relative">
                        <p className="text-[20px] font-[700] p-5">Discover weekly</p>
                        <p className="px-5 -mt-3 w-60">The best and new phonk playlist</p>
                        <img src={boy} className="w-25 absolute right-0 bottom-0" />
                    </div>
                </div>
            </div>

            <TopDaily />

            <SideNav setIsOpen={setIsOpen} />
            
        </div>
     );
}
 
export default Home;