import { useState } from "react";
import logo from "../assets/logo2.png"
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { login } = useUser()

    const loginToAccount = async(e)=> {
        e.preventDefault()
        const response = await fetch("http://localhost:3000/api/account/login", {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {
                "Content-Type" : "application/json"
            }
        })

        const json = await response.json()

        if(response.ok) {
            localStorage.setItem("user", JSON.stringify(json))
            /* setIsLoading(false) */
            login(json)
            setError(null)
            navigate("/")
        }
        if(!response.ok) {
            setError(json.error)
        }
    }

    return ( 
        <div className="text-white">

            <div className="flex items-center gap-2 ml-10 my-10">
                <img src={logo} className="w-10"/>
                <p className="text-green-500">Songify</p>
            </div>

            <form onSubmit={loginToAccount} className="flex flex-col px-10 gap-3 sign">
                <h2 className="text-[25px] font-[600]">Log In To Your Account</h2>
                <h4 className="flex text-[15px] gap-1 -mt-3 mb-5">Its <p className="text-green-500">Now</p> free to start listening...</h4>
                <label htmlFor="" className="text-white/70">Your E-mail</label>
                <input onChange={(e)=> setEmail(e.target.value)} value={email} type="text" />
                <label htmlFor="" className="text-white/70">Your Password</label>
                <input onChange={(e)=> setPassword(e.target.value)} value={password} type="text" />

                <button className="bg-green-600 p-4 rounded-xl mt-5">LOG IN</button>
            </form>


            {error && <div className="bg-red-500 mx-auto w-[80%] mt-20 py-3 rounded-2xl px-5 text-center">{error}</div>}
            
        </div>
     );
}
 
export default Login;