import { useState } from "react";

export default function SongCard({ song, onCardClick, showRemove, onRemove, hideVoteButton, onRequireLogin, onVote, voted }) {
  // const [voted, setVoted] = useState(false); // Không dùng state cục bộ nữa

  const handleVote = (e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      onRequireLogin?.();
      return;
    }
    onVote?.();
  };

  return (
    <div
      className="flex items-center bg-white rounded-xl shadow p-3 mb-4 cursor-pointer"
      onClick={onCardClick}
    >
      <img
        src={
          song.avatar
            ? song.avatar
            : song.img
              ? song.img.startsWith('http') || song.img.startsWith('/uploads')
                ? song.img
                : `/uploads/${song.img}`
              : song.image
                ? song.image.startsWith('http') || song.image.startsWith('/uploads')
                  ? song.image
                  : `/uploads/${song.image}`
                : song.image_url
                  ? song.image_url.startsWith('http') || song.image_url.startsWith('/uploads')
                    ? song.image_url
                    : `/uploads/${song.image_url}`
                  : '/default-image.jpg'
        }
        alt={song.title}
        className="w-16 h-16 rounded-lg object-cover mr-4 flex-shrink-0"
      />
      <div className="flex-1">
        <div className="font-semibold text-lg">{song.title}</div>
        <div className="text-gray-500 text-sm">{song.artist}</div>
        <div className="text-gray-400 text-xs mt-1">{song.votes.toLocaleString()} votes</div>
      </div>
      {!hideVoteButton && (
        <button
          onClick={handleVote}
          disabled={voted}
          className={`ml-4 flex items-center justify-center font-bold px-4 py-2 rounded-lg shadow transition-colors duration-200 min-w-[72px]
            ${voted ? "bg-green-400 text-white cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"}`}
        >
          {voted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            "VOTE"
          )}
        </button>
      )}
      {showRemove && (
        <button
          onClick={e => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-2 flex items-center justify-center font-bold px-3 py-2 rounded-lg shadow bg-red-500 hover:bg-red-600 text-white"
        >
          Xóa
        </button>
      )}
    </div>
  );
} 