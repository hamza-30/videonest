import { memo } from "react";

function VideoPlayer({ videoUrl, thumbnail }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video">
      <video
        src={videoUrl}
        poster={thumbnail}
        controls
        autoPlay
        className="h-full w-full object-contain"
        // Optional: add these for better user experience
        controlsList="nodownload"
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default memo(VideoPlayer);
