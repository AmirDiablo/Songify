import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { PlayerProvider } from './context/PlayerContext.jsx'
import { PlaylistProvider } from './context/PlaylistContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = "600707487068-304patsc4up5atl2bc5cuhaeodqkoafu.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <UserProvider>
        <PlayerProvider>
          <PlaylistProvider>
            <App />
          </PlaylistProvider>
        </PlayerProvider>
      </UserProvider>
    </GoogleOAuthProvider>
    ,
)
