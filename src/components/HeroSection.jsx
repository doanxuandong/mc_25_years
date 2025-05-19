import BlurText from "./BlurText";
import SplashCursor from './SplashCursor';
import StarBorder from './StarBorder';
import mcImg from '../img/logo.jpg';
import ClickSpark from "./ClickSpark";

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

const scrollToSongList = () => {
  const songListsection = document.getElementById('songlist');
  if (songListsection) {
    songListsection.scrollIntoView({ behavior: 'smooth'});
  }
}

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-[#33436f] to-[#001645] text-white py-10 px-4 flex flex-col items-start justify-center min-h-[320px] md:min-h-[400px] overflow-hidden">
      <img
        src={mcImg}
        alt="Logo MC"
        className="absolute top-1/2 right-20 -translate-y-1/2 bottom-15 h-350px object-cover rounded-lg shadow-lg hidden md:block"
        style={{ maxHeight: 350 }}
      />
      <div className="relative z-10 max-w-xl ml-7">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            <BlurText
              text ="Bình chọn bài hát yêu thích của bạn!"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="whitespace-pre-line"
            />
          </h1>
        <StarBorder
          as="button"
          className="custom-class press-effect"
          color="cyan"
          speed="5s"
          onClick={scrollToSongList}
        >
          VOTE NGAY
        </StarBorder>
      </div>
      <style jsx>{`
        .press-effect:active {
          transform: scale(0.96);
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
        }
      `}</style>
    </div>
  );
} 