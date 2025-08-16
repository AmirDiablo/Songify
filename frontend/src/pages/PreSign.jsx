import { FcGoogle } from "react-icons/fc";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton"
import Extractor from "../components/Extractor"

const PreSignUp = () => {
    return ( 
        <div className="relative h-300 sm:h-400 overflow-x-hidden">

            <div className="showing text-purple-800 absolute top-15 text-center w-100 left-[50%] -translate-x-[50%] font-[700] z-10 text-[40px] opacity-0 ">Listen on Songify</div>

            <div className="semi-circle rotate-180 absolute top-60 sm:top-100"></div>
            
            <div className="w-[100%] airpod"><Extractor /></div>

            <div className="text-white absolute left-0 right-0 -bottom-10  h-110 -translate-y-[100px] sm:w-[90%] sm:rounded-2xl sm:mx-auto sm:top-[50%] sm:-translate-y-[50%] sm:backdrop-blur-2xl">
                
                <div className="px-7 mt-10 flex flex-col gap-3">
                    <Link to='/signup'>
                        <div className="bg-purple-800 rounded-full text-center p-4">Sign Up with Email</div>
                    </Link>
                    <div className="relative flex justify-center items-center rounded-full p-4 border-1 border-purple-600 glowing">
                        <div className="absolute left-5 text-[25px]"><IoPhonePortraitOutline /></div>
                        CONTINUE WITH PHONE NUMBER
                    </div>
                    <div className="bg-white flex items-center justify-center rounded-full p-2"><GoogleLoginButton /></div>
                    <Link to='/login' className="mx-auto mt-3">LOG IN</Link>
                </div>
            </div>

            
        </div>
     );
}
 
export default PreSignUp;