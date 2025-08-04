import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({ children })=> {
    const [user, setUser] = useState()
    const [userId, setUserId] = useState(null)
    const [followings, setFollowings] = useState([])


    const updateProfile = (obj)=> {
        setUser([obj])
    }

    const login = (value)=> {
        setUserId(value)
    }

    const updateFollowings = (userId)=> {
        const Exist = followings.includes(userId)

        if(Exist) {
            setFollowings( followings.filter( item=> item !== userId ) )
        }else{
            setFollowings([...followings, userId])
        }
    }


    useEffect(()=> {
        const user = JSON.parse(localStorage.getItem('user'))

        const fetchUser = async (id)=> {
            const response = await fetch("http://localhost:3000/api/account/userInfo?q="+id, {
                method: "GET",
                headers: {
                    "authorization" : `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if(response.ok) {
                setUser({token: user.token, userInfo: json})
                setFollowings(json[0].followings)
            }
        }

        if (user) {
            fetchUser(user.id)
        }

    }, [ , userId])

    console.log(user, followings)
    
    return (
        <UserContext.Provider value={{user, followings, login, updateFollowings, updateProfile}}>
            {children}
        </UserContext.Provider>
    )
}

//hook
export const useUser = ()=> {
    return useContext(UserContext)
}