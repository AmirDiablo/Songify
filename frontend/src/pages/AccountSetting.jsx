import {IoIosLogOut} from "react-icons/io"
import {CiEdit} from "react-icons/ci"
import { Link } from "react-router-dom"
import { useUser } from "../context/UserContext"

const AccountSetting = () => {
    const {logout} = useUser()

    const handleLogout = ()=> {
        logout()
    }

    return ( 
        <div className="text-white">

            <div className="w-[90%] bg-white rounded-2xl p-5 text-black space-y-2 mx-auto mt-10">
                <div onClick={handleLogout} className="flex items-center gap-3">
                    <div className="text-2xl"><IoIosLogOut /></div>
                    <p>Log Out</p>
                </div>
                <div className="w-[100%] h-[0.5px] bg-black/30 mx-auto my-5"></div>
                <Link to="/editPass" className="flex items-center gap-3">
                    <div className="text-2xl"><CiEdit /></div>
                    <p>Edit Password</p>
                </Link>
            </div>

        </div>
     );
}
 
export default AccountSetting;