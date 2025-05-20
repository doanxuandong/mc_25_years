import React from "react";
import SongCard from "./SongCard";

export default function SavedVotesModal({ open, onClose, votes, onRemove }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-2 p-6 relative text-gray-900">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-3xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Bài hát đã vote ({votes.length}/5)</h2>
        {votes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Chưa có bài hát nào được vote.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {votes.slice(0, 5).map((song, idx) => (
              <SongCard
                key={song.id || idx}
                song={song}
                showRemove
                onRemove={() => onRemove(song)}
                hideVoteButton
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 