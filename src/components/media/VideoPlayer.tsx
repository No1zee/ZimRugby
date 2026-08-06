'use client';

import { useRef, useState, useEffect } from 'react';
import { Maximize2, ExternalLink, PictureInPicture } from 'lucide-react';

type VideoPlayerProps = {
  src?: string;
  videoId?: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
};

export function VideoPlayer({ src, videoId, poster, title, autoPlay = true }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPipSupported, setIsPipSupported] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsPipSupported('pictureInPictureEnabled' in document || 'documentPictureInPicture' in window);
    }
  }, []);

  const openInPip = async () => {
    const container = containerRef.current;
    const video = videoRef.current;

    // 1. Ensure element is centered in user's immediate view before requesting PiP
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise((r) => setTimeout(r, 150));
    }

    // 2. Native HTML5 <video> Picture-in-Picture
    if (video && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
        await video.requestPictureInPicture();
        setIsPipActive(true);
        return;
      } catch (err) {
        console.warn('Native HTML5 PIP failed, trying Document PIP:', err);
      }
    }

    // 3. Document Picture-in-Picture API (Works for standard Web & Iframe players)
    if ('documentPictureInPicture' in window) {
      try {
        // @ts-ignore - Document Picture-in-Picture API definition
        const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: 560,
          height: 315,
        });

        if (container) {
          pipWindow.document.body.appendChild(container.cloneNode(true));
          setIsPipActive(true);

          pipWindow.addEventListener('unload', () => {
            setIsPipActive(false);
          });
        }
      } catch (err) {
        console.error('Document PIP failed:', err);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnter = () => setIsPipActive(true);
    const onLeave = () => setIsPipActive(false);

    video.addEventListener('enterpictureinpicture', onEnter);
    video.addEventListener('leavepictureinpicture', onLeave);

    return () => {
      video.removeEventListener('enterpictureinpicture', onEnter);
      video.removeEventListener('leavepictureinpicture', onLeave);
    };
  }, []);

  const ytid = videoId || (src?.includes('youtube.com') || src?.includes('youtu.be') ? src.split('v=')[1] || src.split('/').pop() : null);

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group border border-white/10">
      {ytid ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ytid}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`}
          title={title || 'Video Player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          autoPlay={autoPlay}
          className="w-full h-full object-cover"
          title={title}
        />
      )}

      {isPipSupported && (
        <button
          onClick={openInPip}
          type="button"
          className="absolute top-2.5 right-2.5 z-20 p-2 rounded-xl bg-black/60 hover:bg-[#006747] backdrop-blur-md text-white/90 hover:text-white transition-all border border-white/10 hover:border-white/30 hover:scale-105 shadow-md"
          title="Picture in Picture (Pop Out)"
        >
          <PictureInPicture className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
