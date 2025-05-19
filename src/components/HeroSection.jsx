import BlurText from "./BlurText";
import SplashCursor from './SplashCursor';
import StarBorder from './StarBorder';
import mcImg from '../img/3.png';
import ClickSpark from "./ClickSpark";
import TopBarMenu from './TopBarMenu';

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
    <div className="font_po relative bg-gradient-to-br from-[#224099] via-[#224099] to-[#224099] text-white py-10 px-4 flex flex-col items-start justify-center min-h-[320px] md:min-h-[400px] overflow-hidden">
      <TopBarMenu />
      <img
        src={mcImg}
        alt="Logo MC"
        className="absolute top-1/2 left-20 -translate-y-1/2 w-[350px] h-[350px] object-contain rounded-lg hidden md:block"
        style={{ maxHeight: 350 }}
      />
      <img
        src={mcImg}
        alt="Logo MC"
        className="block md:hidden mx-auto my-8 w-2/3 max-w-xs h-auto object-contain"
      />
      <div className="relative z-10 max-w-xl ml-auto mr-20 hidden md:block">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          <span className="text-7xl bg-gradient-to-r font-sans from-[#ffe066] via-[#ffd700] to-[#f9b233] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Thanh âm  <span className="text-[85px] ">25</span>
          </span>
          <BlurText
            text ="Bình chọn ca khúc"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="whitespace-pre-line text-4xl"
          />
          <BlurText
            text ="yêu thích nhất của bạn"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="whitespace-pre-line text-4xl"
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