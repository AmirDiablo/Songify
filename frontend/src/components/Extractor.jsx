import React, { useState, useRef, useEffect } from 'react';
import airpod from "../assets/video.mp4"

export default function VideoFrameExtractor() {
  const [videoFile, setVideoFile] = useState("../assets/statue.mp4");
  const [frames, setFrames] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [distance, setDistance] = useState(0)
  const [totalFrames, setTotalFrames] = useState()

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(()=> {
    if(currentFrameIndex == totalFrames-1) {
      const airpod = document.querySelector(".airpod")
      const elem = document.querySelector(".showing")
      const semi = document.querySelector(".semi-circle")
      elem.style.opacity = "1"
      
    }else{
      const elem = document.querySelector(".showing")
      const airpod = document.querySelector(".airpod")
      const semi = document.querySelector(".semi-circle")
      elem.style.opacity = "0"
    }
  }, [currentFrameIndex])

  const extractFrames = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    setExtracting(true);
    setFrames([]);
    setCurrentFrameIndex(0);

    const framesArray = [];
    const fps = 10;

    const onLoadedMetadata = () => {
      const duration = video.duration;
      const totalFrames = Math.floor(duration * fps);
      setTotalFrames(totalFrames)

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      let currentFrame = 0;

      const seekNext = () => {
        if (currentFrame >= totalFrames) {
          setFrames(framesArray);
          setExtracting(false);
          setCurrentFrameIndex(0);
          return;
        }
        video.currentTime = currentFrame / fps;
      };

      const onSeeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          framesArray.push(url);
          currentFrame++;
          setTimeout(seekNext, 40);
        }, 'image/jpeg', 0.8);
      };

      video.addEventListener('seeked', onSeeked);
      seekNext();

      // Cleanup listeners after extraction finishes
      video.addEventListener('ended', () => {
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
      });
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.load();
  };

  window.addEventListener("scroll", ()=> {
        const position = window.scrollY

        // when the user scroll to the bottom run this
        if(position > distance) { 
            if(currentFrameIndex < frames.length-1) {
                setCurrentFrameIndex(currentFrameIndex+1)
            }
        }

        //storing the value for next turn
        setDistance(position)

    })

    useEffect(()=> {
        extractFrames()
    }, [])

    

  return (
    <main dir="rtl" lang="fa" className="flex justify-center p-10 con" role="main">
      
        {frames.length > 0 && (
            <img
              src={frames[currentFrameIndex]}
              className="rounded-lg shadow-md object-contain max-w-full max-h-[400px]"
              loading="lazy"
            />
        )}

        {/* Hidden video and canvas elements */}
        <video
          ref={videoRef}
          src={airpod}
          style={{ display: 'none' }}
          crossOrigin="anonymous"
          aria-hidden="true"
          tabIndex={-1}
          className='roll'
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true"/>
    </main>
  );
}