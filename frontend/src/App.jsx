import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Nav from "./components/Nav"
import PreSignUp from "./pages/PreSign"
import Login from "./pages/Login"
import SinglePageVerification from "./pages/SinglePageVerification"
import ArtistSignUp from "./pages/ArtistSignUp"
import Search from "./pages/Search"
import Results from "./pages/Results"
import Playing from "./components/Playing"
import SmallPlaying from "./components/SmallPlaing"
import { useState } from "react"
import { usePlayer } from "./context/PlayerContext"
import { useUser } from "./context/UserContext"
import Profile from "./pages/Profile"
import Releases from "./pages/Releases"
import Details from "./pages/Details"
import CreatePanel from "./components/CreatePanel"
import Create from "./pages/Create"
import Library from "./pages/Library"
import PlaylistDetails from "./pages/PlaylistDetails"
import AddToPlaylist from "./pages/AddToPlaylist"
import EditPlaylist from "./pages/EditPLaylist"
import ListenerProfile from "./pages/ListenerProfile"
import EditProfile from "./pages/EditProfile"
import { useLocation } from "react-router-dom";


function App() {
  const {isOpen, setPlay, isHidden} = usePlayer()
  const [openPanel, setOpenPanel] = useState(false)
  const {user} = useUser()
  
  

  const changeOpen = (status)=> {
    setOpenPanel(status)
  }
  
  return (
    <>
      <BrowserRouter>

          <Routes>
              <Route path="/" element={user ? <Home /> : <PreSignUp />} />
              <Route path="preSign" element={<PreSignUp />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SinglePageVerification />} />
              <Route path="ArtistSignup" element={<ArtistSignUp />} />
              <Route path="search" element={user ? <Search /> : <PreSignUp />} />
              <Route path="results" element={user ? <Results /> : <PreSignUp />} />
              <Route path="profile" element={user ? <Profile /> : <PreSignUp />} />
              <Route path="releases" element={user ? <Releases /> : <PreSignUp />} />
              <Route path="details" element={user ? <Details /> : <PreSignUp />} />
              <Route path="create" element={user ? <Create /> : <PreSignUp />} />
              <Route path="library" element={user ? <Library /> : <PreSignUp />} />
              <Route path="playlistDetails" element={user ? <PlaylistDetails /> : <PreSignUp />} />
              <Route path="addToPlaylist" element={user ? <AddToPlaylist /> : <PreSignUp />} />
              <Route path="editPlaylist" element={user ? <EditPlaylist /> : <PreSignUp />} />
              <Route path="listenerProfile" element={user ? <ListenerProfile /> : <PreSignUp />} />
              <Route path="editProfile" element={user ? <EditProfile /> : <PreSignUp />} />
          </Routes>

          {openPanel && <CreatePanel />}
      
          <div className="flex flex-col fixed left-0 right-0 bottom-0">
            <div className="mb-5"><Nav changeOpen={changeOpen} openPanel={openPanel} setOpenPanel={setOpenPanel} /></div>
            <div className="smallPLaying hidden"><SmallPlaying /></div>
          </div>

          <div className={isHidden ? "playing fixed top-0 bg-black h-screen invisible  -z-1" : "playing fixed top-0 bg-black h-screen z-10"}>
            <Playing />
          </div>
        
      </BrowserRouter>
    </>
  )
}

export default App
