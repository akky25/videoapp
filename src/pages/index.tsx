import { type NextPage } from "next";
import Head from "next/head";
import { ErrorMessage, LoadingMessage } from "~/Components/ErrorMessage";
import Layout from "~/Components/Layout";
import { MuliColumnVideo } from "~/Components/Components";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data, isLoading, error } = api.video.getRandomVideos.useQuery(30);

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (error ?? !data) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No Videos"
          description="動画が見つかりませんでした。"
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Head>
        <title>VideApp</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Layout closeSidebar={true}> */}
      <Layout>
        {!data || error ? (
          <Error />
        ) : (
          <>
            <MuliColumnVideo
              videos={data.videos.map((video) => ({
                id: video?.id ?? "",
                title: video?.title ?? "",
                thumbnailUrl: video?.thumbnailUrl ?? "",
                createdAt: video?.createdAt ?? new Date(),
                views: video?.views ?? 0,
              }))}
              users={data.users.map((user) => ({
                name: user?.name ?? "",
                image: user?.image ?? "",
              }))}
            />
          </>
        )}
      </Layout>
    </>
  );
};

export default Home;
