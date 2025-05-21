import { useState, useEffect } from "react";
import SongCard from "./SongCard";
import MusicModal from "./MusicModal";
import LoginModal from "./LoginModal";
import SavedVotesModal from "./SavedVotesModal";

export default function SongList({ setShowVoteLimit = () => {} }) {
  const [songs, setSongs] = useState([]);
  const [votedSongs, setVotedSongs] = useState([]); // [{id, id_song, ...}]
  const [open, setOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [autoNext, setAutoNext] = useState(false);

  // Lấy user hiện tại
  const user = JSON.parse(localStorage.getItem('user'));

  // Lấy danh sách bài hát
  useEffect(() => {
    fetch("http://localhost:5000/api/songs")
      .then(res => res.json())
      .then(data => setSongs(data.data || []));
  }, []);

  // Lấy danh sách voted của user
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/votes?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => setVotedSongs(data));
    } else {
      setVotedSongs([]);
    }
  }, [user]);

  const reloadVotes = () => {
    if (user) {
      fetch(`http://localhost:5000/api/votes?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => setVotedSongs(data));
    } else {
      setVotedSongs([]);
    }
    // Reload số vote bài hát
    fetch("http://localhost:5000/api/songs")
      .then(res => res.json())
      .then(data => setSongs(data.data || []));
  };

  const handleOpenModal = (song, idx) => {
    setCurrentSong(song);
    setCurrentIndex(idx);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCurrentSong(null);
  };

  const handlePrev = () => {
    if (songs.length === 0) return;
    const newIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(newIndex);
    setCurrentSong(songs[newIndex]);
  };

  const handleNext = () => {
    if (songs.length === 0) return;
    const newIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(newIndex);
    setCurrentSong(songs[newIndex]);
  };

  // Hàm xử lý vote
  const handleVote = async (song) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (votedSongs.some(v => v.id_song === song.id_song)) return;
    if (votedSongs.length >= 5) {
      setShowVoteLimit(true);
      return;
    }
    // Gọi API vote
    const res = await fetch('http://localhost:5000/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, song_id: song.id_song })
    });
    if (res.ok) {
      reloadVotes();
    } else {
      const data = await res.json();
      if (data.message && data.message.includes('đã vote đủ 5 lượt')) {
        setShowVoteLimit(true);
      } else {
        alert(data.message || 'Vote thất bại');
      }
      reloadVotes();
    }
  };

  // Hàm xử lý unvote
  const handleUnvote = async (voteId) => {
    const res = await fetch(`http://localhost:5000/api/votes/${voteId}`, { method: 'DELETE' });
    if (res.ok) {
      reloadVotes();
    } else {
      alert('Unvote thất bại');
      reloadVotes();
    }
  };

  return (
    <>
      <div id="songlist" className="max-w-6xl mx-auto px-2 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Array.isArray(songs) ? songs : []).map((song, idx) => {
          const votedObj = votedSongs.find(v => v.id_song === song.id_song);
          return (
            <SongCard
              key={song.id_song || idx}
              song={{
                ...song,
                title: song.title,
                artist: song.author,
                img: song.avatar,
                audio: song.audio,
                lyrics: song.lyrics,
                votes: song.votes || 0,
                id_song: song.id_song,
              }}
              onCardClick={() => handleOpenModal({ ...song }, idx)}
              onRequireLogin={() => setShowLogin(true)}
              onVote={() => handleVote(song)}
              voted={!!votedObj}
            />
          );
        })}
      </div>
      <MusicModal
        open={open}
        onClose={handleCloseModal}
        song={currentSong}
        onPrev={handlePrev}
        onNext={handleNext}
        autoNext={autoNext}
        setAutoNext={setAutoNext}
      />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      {/* Modal đã vote */}
      <SavedVotesModal
        open={false} 
        onClose={() => {}}
        votes={votedSongs}
        onRemove={vote => handleUnvote(vote.id)}
      />
    </>
  );
} 