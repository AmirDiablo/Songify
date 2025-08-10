import { HiMiniUserGroup } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import {Link, useNavigate} from "react-router-dom"

const CreatePanel = () => {
    const navigate = useNavigate()

    return ( 
        <div className="bg-gray-800 text-white px-5 py-5 mx-5 rounded-2xl mb-80 fixed -bottom-58 left-0 right-0 createPanel">

            <div onClick={()=> navigate("/create?q=public")} className="flex items-center gap-2 p-2">
                <div className="text-[30px]"><HiMiniUserGroup /></div>
                <p>Public Playlist</p>
            </div>
            
            <div onClick={()=> navigate("/create?q=private")} className="flex items-center gap-2 p-2">
                <div className="text-[30px]"><IoPerson /></div>
                <p>Private Playlist</p>
            </div>

        </div>
     );
}
 
export default CreatePanel;