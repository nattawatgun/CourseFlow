import { useEffect, useRef } from 'react';

function CldVideoPlayer({publicId, ...props }) {
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
    <div style={{ width: `${props.width}`, height: `${props.height}` }}>
      <video
        ref={videoRef}
        className="cld-video-player cld-fluid"
        controls
        data-cld-public-id={publicId}
        {...props}
      />
    </div>
  );
}

export default CldVideoPlayer;