import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { IoShuffle } from "react-icons/io5";
import { PiPlaylistBold } from "react-icons/pi";
import { usePlayer } from "../context/PlayerContext";

const Playing = ({changeHidden}) => {
    const {songs, setPlay, index, setIsHidden, play, setPause, pause} = usePlayer()
    const [currentSongIndex, setCurrentSongIndex] = useState(index);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
  
    const audioRef = useRef(null);
    const progressBarRef = useRef(null);

    const currentSong = songs[currentSongIndex];


    useEffect(()=> {
      setCurrentSongIndex(index)
    }, [index])

    useEffect(()=> {
      if(pause) {
        audioRef.current.pause()
        setPause(true)
      }
    }, [pause])


    // Audio control effects
      useEffect(() => {
        const audio = audioRef.current;
        
        if (isPlaying || play) {
          const playPromise = audio.play();
          setPlay(true)
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Playback failed:", error);
              setIsPlaying(false);
            });
          }
        } else {
          audio.pause();
        }
      }, [isPlaying, currentSongIndex, play]);
    
      // Dragging event listeners
      useEffect(() => {
        const handleGlobalMouseUp = () => {
          setIsDragging(false);
        };
    
        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
    
        return () => {
          window.removeEventListener('mouseup', handleGlobalMouseUp);
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }, [isDragging]);
    
      const togglePlay = () => {
        setIsPlaying(!isPlaying);
        setPlay(!play)
      };
    
      const handleNext = () => {
        setCurrentSongIndex((prevIndex) => 
          prevIndex === songs.length - 1 ? 0 : prevIndex + 1
        );
      };
    
      const handlePrev = () => {
        setCurrentSongIndex((prevIndex) => 
          prevIndex === 0 ? songs.length - 1 : prevIndex - 1
        );
      };
    
      const handleTimeUpdate = () => {
        if (!isDragging) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
          setCurrentTime(audioRef.current.currentTime);
        }
      };
    
      const handleProgressBarClick = (e) => {
        if (!progressBarRef.current) return;
        
        const progressBar = progressBarRef.current;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const progressBarWidth = rect.width;
        const newProgress = (clickPosition / progressBarWidth) * 100;
        
        seekToPosition(newProgress);
      };
    
      const handleMouseDown = () => {
        setIsDragging(true);
      };
    
      const handleMouseMove = (e) => {
        if (!isDragging || !progressBarRef.current) return;
        
        const progressBar = progressBarRef.current;
        const rect = progressBar.getBoundingClientRect();
        let clickPosition = e.clientX - rect.left;
        
        clickPosition = Math.max(0, Math.min(clickPosition, rect.width));
        const newProgress = (clickPosition / rect.width) * 100;
        
        setProgress(newProgress);
        setCurrentTime((newProgress / 100) * duration);
      };
    
      const handleMouseUp = () => {
        if (isDragging) {
          seekToPosition(progress);
          setIsDragging(false);
        }
      };
    
      const seekToPosition = (progressPercent) => {
        const seekTime = (progressPercent / 100) * audioRef.current.duration;
        audioRef.current.currentTime = seekTime;
      };
    
      const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
      };
    
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };
    
      const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      };

      const handleClose = ()=> {
        setIsHidden(true)
      }


    return ( 
        <div className="text-white player relative h-screen">

            <div className="*:p-3 left-0 right-0 flex justify-between absolute z-10 top-10 px-10 *:backdrop-blur-2xl *:text-[20px] *:bg-white/20 *:rounded-full">
                <div onClick={handleClose}><FaArrowLeft /></div>
                <div className=""><FaRegHeart /></div>
            </div>

            <img src={"/cover/"+currentSong?.cover} className="fadeImage w-screen blur-xl" />

            <div className="flex gap-5 flex-col justify-center absolute left-[50%] -translate-x-[50%] top-20 w-[90%]">
                <div className="rounded-full w-[80%] mx-auto aspect-square overflow-hidden ">
                    <img src={"/cover/"+currentSong?.cover} />
                </div>

                <div className="text-center mx-auto">
                    <p className="text-[20px] font-[600]">{currentSong?.title}</p>
                    <p className="text-white/50">{currentSong?.artistId.username}</p>
                </div>
            </div>



            <div className="bg-[#09080e]  h-max w-screen py-10 absolute left-0 right-0 bottom-0  px-10 controller">
                
                <audio ref={audioRef} src={"/songs/"+currentSong?.fileName} onTimeUpdate={handleTimeUpdate}
                  onEnded={handleNext}
                  onLoadedMetadata={handleLoadedMetadata} preload="metadata"/>

                <div className="mb-5">
                    <div 
                      className="custom-progress-bar"
                      onClick={handleProgressBarClick}
                      ref={progressBarRef}
                    >
                      <div 
                        className="progress" 
                        style={{ width: `${progress}%` }}
                      ></div>
                      <div 
                        className="progress-thumb"
                        style={{ left: `${progress}%` }}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                      ></div>
                    </div>
                    <div className="flex justify-between *:text-white/70">
                        <p>{formatTime(currentTime)}</p>
                        <p>{formatTime(duration)}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center *:p-5 *:flex *:justify-center *:items-center *:text-center *:aspect-square *:text-[20px] *:rounded-full playerButtons">
                    <div><IoShuffle /></div>
                    <div onClick={handleNext} className="scale-[0.9] bg-gray-800"><IoPlaySkipBackSharp /></div>
                    <div className="active" onClick={togglePlay}>{play ? <FaPause /> : <FaPlay />}</div>
                    <div onClick={handlePrev} className="scale-[0.9] bg-gray-800"><IoPlaySkipForward /></div>
                    <div className=""><PiPlaylistBold /></div>
                </div>

            </div>

        </div>
     );
}
 
export default Playing;