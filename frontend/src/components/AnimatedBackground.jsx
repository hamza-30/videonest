import {
  FiVideo,
  FiPlayCircle,
  FiMic,
  FiFilm,
  FiCamera,
  FiMessageSquare,
  FiHeart,
  FiMusic,
  FiMonitor,
  FiHeadphones,
} from "react-icons/fi";

const ICONS = [
  { Component: FiVideo, size: 40, top: "10%", left: "10%", animation: "animate-wander-1" },
  { Component: FiPlayCircle, size: 60, top: "20%", left: "80%", animation: "animate-wander-2" },
  { Component: FiMic, size: 30, top: "70%", left: "15%", animation: "animate-wander-3-delayed" },
  { Component: FiFilm, size: 50, top: "60%", left: "85%", animation: "animate-wander-1-delayed" },
  { Component: FiCamera, size: 45, top: "85%", left: "45%", animation: "animate-wander-2-delayed" },
  { Component: FiMessageSquare, size: 35, top: "30%", left: "40%", animation: "animate-wander-3" },
  { Component: FiHeart, size: 25, top: "15%", left: "50%", animation: "animate-wander-1" },
  { Component: FiMusic, size: 55, top: "80%", left: "70%", animation: "animate-wander-2-delayed" },
  { Component: FiMonitor, size: 40, top: "40%", left: "5%", animation: "animate-wander-3-delayed" },
  { Component: FiHeadphones, size: 65, top: "45%", left: "90%", animation: "animate-wander-1-delayed" },
  { Component: FiPlayCircle, size: 30, top: "50%", left: "25%", animation: "animate-wander-2" },
];

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating White Icons */}
      {ICONS.map((icon, index) => {
        const { Component, size, top, left, animation } = icon;
        return (
          <div
            key={index}
            className={`absolute text-white opacity-[0.15] ${animation}`}
            style={{ top, left }}
          >
            <Component size={size} />
          </div>
        );
      })}
    </div>
  );
}

export default AnimatedBackground;

