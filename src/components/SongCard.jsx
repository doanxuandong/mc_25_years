import { useState } from "react";

export default function SongCard({ song, onCardClick }) {
  const [voted, setVoted] = useState(false);

  return (
    <div
      className="flex items-center bg-white rounded-xl shadow p-3 mb-4 cursor-pointer"
      onClick={onCardClick}
    >
      <img
        src={song.img}
        alt={song.title}
        className="w-16 h-16 rounded-lg object-cover mr-4 flex-shrink-0"
      />
      <div className="flex-1">
        <div className="font-semibold text-lg">{song.title}</div>
        <div className="text-gray-500 text-sm">{song.artist}</div>
        <div className="text-gray-400 text-xs mt-1">{song.votes.toLocaleString()} votes</div>
      </div>
      <button
        onClick={e => {
          e.stopPropagation();
          setVoted(v => !v);
        }}
        className={`ml-4 flex items-center justify-center font-bold px-4 py-2 rounded-lg shadow transition-colors duration-200 min-w-[72px]
          ${voted ? "bg-green-400 text-white" : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"}`}
      >
        {voted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          "VOTE"
        )}
      </button>
    </div>
  );
} 