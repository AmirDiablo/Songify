import { FcGoogle } from "react-icons/fc";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton"

const PreSignUp = () => {
    return ( 
        <div>
            {/* <div className="overflow-x-hidden absolute left-0 right-0 top-0">
                <div className="singerCircle1 w-32 translate-x-[20px]"></div>
                <div className="singerCircle2 w-40 translate-x-[150px] translate-y-[10px]"></div>
                <div className="singerCircle3 w-30 -translate-y-[120px] -translate-x-[30px]"></div>
                <div className="singerCircle4 w-27 translate-x-[330px] -translate-y-[400px]"></div>
                <div className="singerCircle5 w-30 -translate-y-[180px]"></div>
                <div className="singerCircle6 w-20 translate-x-[280px] -translate-y-[400px]"></div>
                <div className="singerCircle7 w-30 translate-x-[250px] -translate-y-[330px]"></div>
                <div className="singerCircle8 w-40  translate-x-[380px] -translate-y-[550px] "></div>
                <div className="singerCircle9 w-25  translate-x-[400px] -translate-y-[850px]"></div>
                <div className="singerCircle10 w-30 translate-x-[550px] -translate-y-[900px]"></div>
                <div className="singerCircle11 w-40  translate-x-[550px] -translate-y-[1200px]"></div>
                <div className="singerCircle12 w-40  translate-x-[650px] -translate-y-[1000px]"></div>
                <div className="singerCircle13 w-40 "></div>
                <div className="singerCircle14 w-40 "></div>
            </div> */}

            <div className="banner z-10 w-screen h-100 sm:h-screen"></div>

            <div className="text-white absolute left-0 right-0 -bottom-10 bg-gradient-to-t backdrop-blur-[4px] from-black to-black/40 h-110 -translate-y-[100px] sm:w-[90%] sm:rounded-2xl sm:mx-auto sm:top-[50%] sm:-translate-y-[50%] sm:backdrop-blur-2xl">
                <div className="text-[25px] font-[600] text-center pt-5">
                    <p>Millions of songs</p>
                    <p>Free on Songify</p>
                </div>
                <div className="px-7 mt-10 flex flex-col gap-3">
                    <Link to='/signup'>
                        <div className="bg-lime-600 rounded-full text-center p-4">Sign Up Free</div>
                    </Link>
                    <GoogleLoginButton />
                    <div className="relative flex justify-center items-center rounded-full p-4 border-1 border-white/50">
                        <div className="absolute left-5 text-[25px]"><IoPhonePortraitOutline /></div>
                        CONTINUE WITH PHONE NUMBER
                    </div>
                    <Link to='/login' className="mx-auto mt-3">LOG IN</Link>
                </div>
            </div>
        </div>
     );
}
 
export default PreSignUp;