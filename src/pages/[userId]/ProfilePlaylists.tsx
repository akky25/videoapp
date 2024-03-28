import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MultiColumnPlaylist } from "~/Components/Components";
import { ErrorMessage, LoadingMessage } from "~/Components/ErrorMessage";
import Layout from "~/Components/Layout";
import ProfileHeader from "~/Components/ProfileHeader";
import { api } from "~/utils/api";

const ProfilePlaylist: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();

  const { data, isLoading, error } = api.playlist.getPlaylistsByUserId.useQuery(
    userId as string,
    {
      enabled: !!userId,
    },
  );
  const errorTypes = !data || data?.length === 0 || error;

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (userId == sessionData?.user.id && errorTypes) {
      return (
        <ErrorMessage
          message="No Playlists Created"
          description="プレイリストが作成されていません"
        />
      );
    } else if (errorTypes) {
      return (
        <ErrorMessage
          message="No libraries created"
          description="プレイリストが作成されていません"
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Layout>
        <>
          <ProfileHeader />
          {errorTypes ? (
            <div className="!-ml-0">
              <Error />
            </div>
          ) : (
            <MultiColumnPlaylist
              playlists={data.map((playlist) => ({
                id: playlist.id,
                title: playlist.title,
                description: playlist.description ?? "",
                videoCount: playlist.videoCount,
                playlistThumbnail: playlist?.playlistThumbnail ?? "",
                createdAt: playlist.createdAt,
              }))}
            />
          )}
        </>
      </Layout>
    </>
  );
};

export default ProfilePlaylist;
