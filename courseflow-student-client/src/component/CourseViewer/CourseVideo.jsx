import { useEffect, useRef } from 'react';

function CourseVideo({ id, publicId, handlePlay, handleEnd, ...props }) {
  const videoRef = useRef();
  const cloudinaryRef = useRef();
  const playerRef = useRef();

  // Store the Cloudinary window instance to a ref when the page renders

  useEffect(() => {
    if ( cloudinaryRef.current ) return;

    cloudinaryRef.current = window.cloudinary;

    playerRef.current = cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      secure: true
    });
  }, []);

  return (
    <div style={{ width: '100%', height: `${props.height}` }}>
      <video
        onPlay={handlePlay}
        onEnded={handleEnd}
        ref={videoRef}
        id={id}
        className="cld-video-player cld-fluid"
        controls
        data-cld-public-id={publicId}
        {...props}
      />
    </div>
  );
}

export default CourseVideo;