import React, { useRef, useState } from 'react';
import { VRViewer } from './VRViewer';
import { ChevronLeft, ChevronRight, Maximize2, Play, Pause } from 'lucide-react';

interface MediaViewerProps {
  media: {
    type: 'image' | 'video' | '360-image' | '360-video';
    url: string;
    title?: string;
    description?: string;
  }[];
  initialIndex?: number;
}

export function MediaViewer({ media, initialIndex = 0 }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = media[currentIndex];
  const is360 = currentMedia.type === '360-image' || currentMedia.type === '360-video';

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, media.length - 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${
        isFullscreen ? 'w-screen h-screen' : 'w-full h-[600px]'
      } rounded-lg overflow-hidden bg-black`}
    >
      {is360 ? (
        <VRViewer
          scenes={[
            {
              url: currentMedia.url,
              label: currentMedia.title,
            },
          ]}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {currentMedia.type === 'video' ? (
            <video
              ref={videoRef}
              src={currentMedia.url}
              className="max-w-full max-h-full"
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <img
              src={currentMedia.url}
              alt={currentMedia.title}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full text-white">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {currentMedia.type === 'video' && (
          <button
            onClick={togglePlayPause}
            className="p-2 hover:bg-white/20 rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
        )}

        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-sm font-medium">
            {currentMedia.title || `Media ${currentIndex + 1}/${media.length}`}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === media.length - 1}
          className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="border-l border-white/20 h-8 mx-2" />

        <button
          onClick={handleFullscreen}
          className="p-2 hover:bg-white/20 rounded-full"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Description */}
      {currentMedia.description && (
        <div className="absolute top-4 left-4 right-4 bg-black/50 p-4 rounded-lg text-white">
          <p className="text-sm">{currentMedia.description}</p>
        </div>
      )}
    </div>
  );
}