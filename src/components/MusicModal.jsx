import React, { useRef, useState } from "react";

export default function MusicModal({ open, onClose, song, onPrev, onNext }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  if (!open || !song) return null;

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-[#224099] bg-opacity-80 rounded-2xl shadow-2xl w-full max-w-2xl mx-2 p-6 relative text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-3xl font-bold"
        >
          ×
        </button>
        <div className="flex flex-row md:flex-row gap-4 items-center">
          <img
            src={song.img}
            alt={song.title}
            className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-xl object-cover shadow-lg"
          />
          <div className="flex-1 flex flex-col justify-center">
            <div className="uppercase text-xs text-gray-400 mb-1">Bài hát</div>
            <div className="text-2xl md:text-3xl font-bold mb-2">{song.title}</div>
            <div className="flex items-center gap-2 text-gray-300 mb-2 flex-wrap">
              <span className="font-semibold">{song.artist}</span>
              {song.year && <>• {song.year}</>}
              {song.duration && <>• {song.duration}</>}
              {song.views && <>• {song.views.toLocaleString()}</>}
            </div>
          </div>
        </div>
        {/* Nút điều khiển và thanh audio */}
        <div className="flex flex-col items-center w-full mt-4">
          <div className="flex items-center gap-4 justify-center w-full">
            <button
              onClick={onPrev}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={handlePlayPause}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-400 text-3xl"
            >
              {playing ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button
              onClick={onNext}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6l6 6-6 6" /></svg>
            </button>
          </div>
          <audio
            ref={audioRef}
            src={song.audio}
            className="w-full mt-4"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            controls
          />
        </div>
        {/* Lời bài hát */}
        {song.lyrics && (
          <div className="mt-8">
            <div className="font-bold text-lg mb-2">Lời bài hát</div>
            <div className="whitespace-pre-line text-gray-200 text-sm">{song.lyrics}</div>
          </div>
        )}
      </div>
    </div>
  );
} 