import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div className="absolute top-0 z-50 grid h-full w-full place-items-center bg-gray-500 bg-opacity-80">
      <ReactLoading type={"spin"} color={"#b3d81e"} height={100} width={100} />
    </div>
  );
}
