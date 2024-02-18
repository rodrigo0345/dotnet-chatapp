import { RTCService } from "@/Services/RTCService";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function VideoCall() {
  const userVideoRef = useRef(null); // Use separate refs for user videos

  useEffect(() => {
    getMedia();
  }, []);

  const getMedia = async () => {
    console.log("getMedia");
    const constraints = { video: true, audio: true };
    try {
      const stream = await RTCService.getMediaStream(
        constraints.video,
        constraints.audio
      );
      const userVideo = userVideoRef.current;
      console.log({ stream });
      if (userVideo) {
        (userVideo as any).srcObject = stream;
      } else {
        console.error("User video element not found");
      }
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  };

  return (
    <div className="h-full grow flex flex-col self-start">
      <h1>Video Call</h1>
      <div className="" id="videos">
        <video
          className="video-player bg-gray-200"
          id="user-1"
          ref={userVideoRef}
          autoPlay
          playsInline
        ></video>
        <video
          className="video-player bg-gray-200"
          id="user-2"
          autoPlay
          playsInline
        ></video>
      </div>
      <button>Call</button>
      <button>Join</button>
    </div>
  );
}
