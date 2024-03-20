import { Dialog, Transition } from "@headlessui/react";
import { Plus } from "../Icons/Icons";
import { Button } from "./Buttons";
import { Fragment, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { env } from "~/env";

export default function UploadButton({
  refetch,
}: {
  refetch: () => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const { data: sessionData } = useSession();
  const addVideoUpdateMutation = api.video.createVideo.useMutation();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedVideo(e.target.files[0] ? e.target.files[0] : null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleSubmit = () => {
    type UploadResponse = {
      secure_url: string;
    };
    if (!sessionData?.user.id) return;

    const videoData = {
      userId: sessionData.user.id,
      videoUrl: "",
    };

    const formData = new FormData();

    if (uploadedVideo) {
      formData.append("upload_preset", "user_uploads");
      formData.append("file", uploadedVideo);
    }

    void fetch(
      "https://api.cloudinary.com/v1_1//" +
        env.NEXT_PUBLIC_CLOUDINARY_NAME +
        "/video/upload",

      {
        method: "POST",
        body: formData,
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: UploadResponse) => {
        if (data.secure_url !== undefined) {
          const newVideoData = {
            ...videoData,
            ...(data.secure_url && { videoUrl: data.secure_url }),
          };

          addVideoUpdateMutation.mutate(newVideoData, {
            onSuccess: () => {
              setOpen(false);
              void refetch();
            },
          });
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="primary"
        className="ml-2 mt-6 flex"
        size="2xl"
      >
        <Plus className=" mr-2 h-5 w-5 shrink-0 stroke-gray-100" />
        Upload
      </Button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          onClose={setOpen}
          className="relative"
          initialFocus={cancelButtonRef}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-300 opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full  items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-100 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <>
                    <div className="sm:flex sm:items-start  ">
                      <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Upload Video{" "}
                        </Dialog.Title>
                        <div className="col-span-full">
                          <div className="mt-2 flex justify-center rounded-lg border-4 border-dashed border-gray-800/25 px-6 py-10">
                            <div className="text-center">
                              {uploadedVideo ? (
                                <p className="text-gray-700">
                                  Your video has been attached.
                                </p>
                              ) : (
                                <div>
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer rounded-md bg-gray-100 font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                                    >
                                      <span>Upload a Video</span>
                                      <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={onFileChange}
                                      />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>{/* button */}</div>
                    <div className=" relative mt-5 flex flex-row-reverse gap-2 sm:mt-4 ">
                      <Button
                        type="reset"
                        variant="primary"
                        size="lg"
                        onClick={() => handleSubmit()}
                      >
                        Upload
                      </Button>
                      <Button
                        variant="secondary-gray"
                        size="lg"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
