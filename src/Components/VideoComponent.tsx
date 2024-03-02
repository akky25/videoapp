import Image from "next/image";
import Link from "next/link";
import { Thumbnail } from "./Thumbnail";
import moment from "moment";

interface VideoComponentProps {
  videos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    createdAt: Date;
    views: number;
  }[];
  users: {
    image: string;
    name: string;
  }[];
  refetch?: () => Promise<unknown>;
}

export const MuliColumnVideo: React.FC<VideoComponentProps> = ({
  videos,
  users,
}) => {
  return (
    <>
      <div className=" mx-auto grid grid-cols-1 gap-x-4 gap-y-8 md:mx-0 md:max-w-none md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:max-w-none xl:grid-cols-3 2xl:mx-0 2xl:max-w-none 2xl:grid-cols-3  ">
        {videos.map((video, index) => {
          const user = users[index];
          if (!user) return null;

          console.log(video.thumbnailUrl);

          return (
            <>
              <Link
                href={`/video/${video.id}`}
                className="flex flex-col items-start justify-between hover:bg-gray-100"
                key={video.id}
              >
                <div className="relative w-full">
                  <Thumbnail thumbnailUrl={video.thumbnailUrl} />
                  <div className="max-w-xl">
                    <div className="items-top relative mt-4 flex gap-x-4 ">
                      <UserImage image={user.image || ""} />
                      <div className="w-full">
                        <VideoTitle title={video.title} limitHeight={true} />
                        <VideoInfo
                          views={video.views}
                          createdAt={video.createdAt}
                        />
                        <UserName name={user.name || ""} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </>
          );
        })}
      </div>
    </>
  );
};

export function VideoTitle({
  title,
  limitHeight,
  limitSize,
}: {
  title: string;
  limitHeight?: boolean;
  limitSize?: boolean;
}) {
  return (
    <h1
      className={`max-w-md font-semibold leading-6 text-gray-900 group-hover:text-gray-600 ${
        limitSize ? "text-base" : "text-lg"
      } ${limitHeight ? "max-h-12 w-full overflow-hidden" : ""}`}
    >
      {title}
    </h1>
  );
}

export function VideoInfo({
  views,
  createdAt,
}: {
  createdAt: Date | string;
  views: number;
}) {
  return (
    <div className="mt-1 flex max-h-6 items-start overflow-hidden text-sm">
      <p className=" text-gray-600">
        {views}
        <span> Views</span>
      </p>
      <li className="pl-2 text-sm text-gray-500" />
      <p className=" text-gray-600">{moment(createdAt).fromNow()}</p>
    </div>
  );
}

export function UserImage({
  image,
  className = "",
}: {
  image: string;
  className?: string;
}) {
  return (
    <div className={`relative h-9 w-9 ${className}`}>
      <Image
        src={image || "/profile.jpg"}
        alt=""
        className="absolute rounded-full"
        fill
      />
    </div>
  );
}

export function UserName({ name }: { name: string }) {
  return (
    <p className="max-h-6 overflow-hidden text-sm font-semibold leading-6 text-gray-900">
      {name}
    </p>
  );
}
