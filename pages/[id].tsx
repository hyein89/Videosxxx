import { GetServerSideProps } from "next";
import Head from "next/head";
import path from "path";
import fs from "fs";
import { useEffect } from "react";

interface Video {
  id: string;
  title: string;
  video: string;
  img: string;
  durasi: string;
  date: string;
}

interface Props {
  video: Video;
}

export default function VideoPlayer({ video }: Props) {

  useEffect(() => {
    // Ini pakai window.videojs karena CDN sudah di-load
    const player = (window as any).videojs("my-video", {
      fluid: false,
      controlBar: { fullscreenToggle: false },
    });

    // Nonaktifkan PiP
    const videoEl = document.getElementById("my-video_html5_api") as HTMLVideoElement;
    if (videoEl) {
      videoEl.disablePictureInPicture = true;
      videoEl.playsInline = true;
    }

    // IMA VAST
    (player as any).ima({
      id: "my-video",
      adTagUrl: "https://s.magsrv.com/v1/vast.php?idzone=5708414",
    });

    // Popup muncul setelah 10 detik
    let popupShown = false;
    const popup = document.getElementById("popup");
    player.on("timeupdate", () => {
      if (player.currentTime() >= 10 && !popupShown && !(player as any).ads?.isAdPlaying()) {
        popupShown = true;
        player.pause();
        if (popup) popup.style.display = "flex";
      }
    });

    // Tap untuk play/pause
    player.on("click", () => {
      if (player.paused()) player.play();
      else player.pause();
    });

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <>
      <Head>
        <title>{video.title}</title>
        <meta name="description" content={`Tonton ${video.title} durasi ${video.durasi}`} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={`Tonton ${video.title} durasi ${video.durasi}`} />
        <meta property="og:image" content={video.img} />
        
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Material+Icons" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>.
        <link href="/style.css" rel="stylesheet" />

        {/* Video.js CDN */}
        <link href="https://vjs.zencdn.net/7.21.1/video-js.css" rel="stylesheet" />
        <script src="https://vjs.zencdn.net/7.21.1/video.js"></script>

        {/* IMA CDN */}
        <script src="https://cdn.jsdelivr.net/npm/videojs-contrib-ads@6.9.0/dist/videojs.ads.min.js"></script>
        <script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/videojs-ima@1.7.0/dist/videojs.ima.min.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/videojs-ima@1.7.0/dist/videojs.ima.css" rel="stylesheet" />
      </Head>

      <div className="main-container">
        <div className="video-container">
          <video
            id="my-video"
            className="video-js vjs-big-play-centered"
            controls
            preload="auto"
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            poster={video.img}
          >
            <source src={video.video} type="video/mp4" />
            <p className="vjs-no-js">
              Enable JavaScript or a browser that supports HTML5 video.
            </p>
          </video>

          <div className="popup-overlay" id="popup" style={{ display: "none" }}>
            <p>Streaming is Blocked in Your Country<br /> Click Below to <strong>Download</strong> This Video</p>
            <button onClick={() => window.open(video.video, "_blank")}>
              <span className="material-icons download-icon">download</span> Download
            </button>
          </div>
        </div>

        <div className="video-info">
          <h4>{video.title}</h4>
          <div className="meta">
            <div className="length"><span className="material-icons">schedule</span> {video.durasi}</div>
            <div className="uploadate"><span className="material-icons">calendar_today</span> {video.date}</div>
          </div>
        </div>

        <div className="native-ad">
          <div className="ad-content">
            {/* area ads */}
            <script async data-cfasync="false" src="//signingunwilling.com/3911d811a20e71a5214546d08cc0afaf/invoke.js"></script>
            <div id="container-3911d811a20e71a5214546d08cc0afaf"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const filePath = path.join(process.cwd(), "data", "videos.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const videos: Video[] = JSON.parse(jsonData);

  const video = videos.find((v) => v.id === id);

  if (!video) {
    return { notFound: true }; // redirect otomatis ke 404
  }

  return { props: { video } };
};
