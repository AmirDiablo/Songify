import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer = ({ songs }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const currentSong = songs[currentSongIndex];

  // Audio control effects
  useEffect(() => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSongIndex]);

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

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <div className="song-info">
        <h3>{currentSong.title}</h3>
        <p>{currentSong.artist}</p>
      </div>
      
      <div className="progress-container">
        <span className="time-display">{formatTime(currentTime)}</span>
        
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
        
        <span className="time-display">{formatTime(duration)}</span>
      </div>
      
      <div className="controls">
        <button onClick={handlePrev} className="control-btn" aria-label="Previous">
          <i className="icon prev-icon">⏮</i>
        </button>
        <button onClick={togglePlay} className="control-btn play-btn" aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? '⏸' : '⏵'}
        </button>
        <button onClick={handleNext} className="control-btn" aria-label="Next">
          <i className="icon next-icon">⏭</i>
        </button>
      </div>
      
      <div className="volume-control">
        <span className="volume-icon">🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          aria-label="Volume control"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;