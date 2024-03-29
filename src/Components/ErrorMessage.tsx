import ReactLoading from "react-loading";
import { GreenHorn, GreenPeople, GreenPlay } from "./Icons/Icons";

export function ErrorMessage({
  children,
  message,
  description,
  icon,
  noCenter,
}: {
  children?: React.ReactNode;
  icon?: string;
  message: string;
  description?: string;
  noCenter?: boolean;
}) {
  const IconSelection = ({
    icon,
    className,
  }: {
    icon?: string;
    className: string;
  }) => {
    if (icon === "GreenHorn") {
      return <GreenHorn className={className} />;
    } else if (icon === "GreenPeople") {
      return <GreenPeople className={className} />;
    } else {
      return <GreenPlay className={className} />;
    }
  };

  return (
    <div
      className={`relative mt-16 flex w-full  flex-col items-center  gap-2 text-center ${noCenter ? "" : "justify-center"}`}
    >
      <IconSelection className="center items-center" icon={icon} />
      <h1 className="text-2xl font-semibold text-gray-900">{message}</h1>
      <p className="max-w-xs text-gray-600">{description}</p>
      {children}
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="relative top-40  flex h-full w-full  flex-col items-center justify-center gap-2 text-center">
      <ReactLoading type={"spin"} color={"#b3d81e"} height={100} width={100} />
      <h1 className="text-2xl font-semibold text-gray-900">Loading</h1>
    </div>
  );
}
