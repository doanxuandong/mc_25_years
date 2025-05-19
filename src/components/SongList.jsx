import { useState } from "react";
import SongCard from "./SongCard";
import tomImg from "../img/tom.jpg";
import MusicModal from "./MusicModal";

const songs = [
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di_ve_nha.mp3",
    lyrics: `Hình như trong lòng anh đã không còn hình bóng ai ngoài em đâu\nHằng đêm anh nằm thao thức suy tư, chẳng nhớ ai ngoài em đâu\nVậy nên không cần nói nữa, yêu mà đôi nói trong vài ba câu?\nCứ cố quá đâm ra lại hâm\nUhm, đau hết cả đầu!\nĐợi chờ em trước nhà từ sáng đến trưa, chiều, tối mắc màn đây luôn\nNgược nắng hay là ngược gió, miễn anh thấy em tươi vui không buồn\nChỉ cần có thấy thế thôi, mây xanh chan hoà\nThấy thế thôi, vui hơn có quà`,
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
  {
    title: "Di ve nha",
    artist: "Doan Xuan Dong",
    img: tomImg,
    audio: "/audio/di-ve-nha.mp3",
    votes: 8303,
  },
];

export default function SongList() {
  const [open, setOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  const handleOpenModal = (song) => {
    setCurrentSong(song);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setCurrentSong(null);
  };

  return (
    <>
      <div id="songlist" className="max-w-6xl mx-auto px-2 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song, idx) => (
          <SongCard
            key={idx}
            song={song}
            onCardClick={() => handleOpenModal(song)}
          />
        ))}
      </div>
      <MusicModal open={open} onClose={handleCloseModal} song={currentSong} />
    </>
  );
} 