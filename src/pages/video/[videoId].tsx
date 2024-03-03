import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactPlayer from "react-player";
import { FollowButton } from "~/Components/Button/Buttons";
import LikeDislikeButton from "~/Components/Button/LikeDislikeButton";
import { ErrorMessage, LoadingMessage } from "~/Components/ErrorMessage";
import Layout from "~/Components/Layout";
import {
  SmallSingleColumnVideo,
  UserImage,
  UserName,
  VideoInfo,
  VideoTitle,
} from "~/Components/VideoComponent";
import { api } from "~/utils/api";

const VideoPage: NextPage = () => {
  const router = useRouter();
  const { videoId } = router.query;
  const { data: sessionData } = useSession();

  const {
    data: videoData,
    isLoading: videoLoading,
    error: videoError,
    refetch: refetchVideoData,
  } = api.video.getVideoById.useQuery(
    {
      id: videoId as string,
      viewerId: sessionData?.user.id,
    },
    {
      enabled: !!videoId && !!sessionData?.user?.id,
    },
  );

  const {
    data: sidebarVideos,
    isLoading: sidebarLoading,
    error: sidebarError,
    refetch: refetchSidebarVideos,
  } = api.video.getRandomVideos.useQuery(20, {
    enabled: false, // this query will not run automatically
  });

  const addViewMutation = api.videoEngagement.addViewCount.useMutation();
  const addView = (input: { id: string; userId: string }) => {
    addViewMutation.mutate(input);
  };

  useEffect(() => {
    if (videoId) {
      void refetchVideoData();

      addView({
        id: videoId as string,
        userId: sessionData ? sessionData.user.id : " ",
      });
    }
  }, [videoId]);

  useEffect(() => {
    if (!sidebarVideos) {
      void refetchSidebarVideos(); // manually refetch sidebarVideos if they do not exist
    }
  }, []);

  const video = videoData?.video;
  const user = videoData?.user;
  const viewer = videoData?.viewer;
  const errorTypes = !videoData || !user || !video || !viewer;

  const DataError = () => {
    if (videoLoading) {
      return <LoadingMessage />;
    } else if (errorTypes) {
      return (
        <ErrorMessage
          icon="GreenPlay"
          message="No Video"
          description="Sorry there is an error with video ."
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Head>
        <title>{video?.title}</title>
        <meta name="description" content={user?.description ?? ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout closeSidebar={true}>
        <div className="mx-auto lg:flex">
          {errorTypes ? (
            <DataError />
          ) : (
            <>
              <div className="w-full sm:px-4 lg:w-3/5">
                <div className="py-4">
                  <ReactPlayer
                    controls={true}
                    style={{ borderRadius: "1rem", overflow: "hidden" }}
                    width={"100%"}
                    height={"50%"}
                    url={video.videoUrl ?? ""}
                  />
                </div>
                <div className="flex space-x-3 rounded-2xl border border-gray-200 p-4 shadow-sm">
                  <div className="min-w-0 flex-1 space-y-3 ">
                    <div className="xs:flex-wrap flex flex-row justify-between gap-4 max-md:flex-wrap">
                      <div className="flex flex-col items-start justify-center gap-1 self-stretch ">
                        <VideoTitle title={video.title ?? "unknown"} />
                        <VideoInfo
                          views={video.views}
                          createdAt={video.createdAt}
                        />
                      </div>
                      <div className="flex-inline flex items-end justify-start  gap-4 self-start  ">
                        <LikeDislikeButton
                          EngagementData={{
                            id: video.id,
                            likes: video.likes,
                            dislikes: video.dislikes,
                          }}
                          viewer={{
                            hasDisliked: viewer.hasDisliked,
                            hasLiked: viewer.hasLiked,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row  place-content-between gap-x-4 ">
                      <Link
                        href={`/${video.userId}/ProfileVideos`}
                        key={video.userId}
                      >
                        <div className="flex flex-row gap-2">
                          <UserImage image={user.image ?? ""} />
                          <button className="flex flex-col">
                            <UserName name={user.name ?? ""} />
                            <p className=" text-sm text-gray-600">
                              {user.followers}
                              <span> Followers</span>
                            </p>
                          </button>
                        </div>
                      </Link>
                      <FollowButton
                        followingId={user.id}
                        viewer={{
                          hasFollowed: viewer.hasFollowed,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="px-4 lg:w-2/5 lg:px-0">
            {!sidebarVideos ? (
              <DataError />
            ) : (
              <>
                <SmallSingleColumnVideo
                  videos={sidebarVideos.videos.map((video) => ({
                    id: video?.id ?? "",
                    title: video?.title ?? "",
                    thumbnailUrl: video?.thumbnailUrl ?? "",
                    createdAt: video?.createdAt ?? new Date(),
                    views: video?.views ?? 0,
                  }))}
                  users={sidebarVideos.users.map((user) => ({
                    name: user?.name ?? "",
                    image: user?.image ?? "",
                  }))}
                />
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default VideoPage;
