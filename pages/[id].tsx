import { GetServerSideProps } from "next";
import Head from "next/head";
import path from "path";
import fs from "fs";

interface Video {
  id: string;
  title: string;
  img: string;
  durasi: string;
  date: string;
  video: string;
}

interface Props {
  video: Video;
}

export default function VideoPage({ video }: Props) {
  const metaDescription = `${video.title} - Tonton video berdurasi ${video.durasi} tanggal ${video.date}`;

  return (
    <>
      <Head>
        <title>{video.title}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={video.img} />
        <meta property="og:type" content="video.other" />
      </Head>

      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>{video.title}</h1>
        <p>Durasi: {video.durasi} | Tanggal: {video.date}</p>
        <img
          src={video.img}
          alt="Thumbnail"
          style={{ maxWidth: "100%", marginBottom: "20px" }}
        />
        <video
          src={video.video}
          controls
          poster={video.img}
          style={{ width: "100%", maxWidth: "600px" }}
        />
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
    return { notFound: true };
  }

  return { props: { video } };
};
