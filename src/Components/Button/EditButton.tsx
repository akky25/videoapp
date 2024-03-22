import { Fragment, useRef, useState } from "react";
import { Edit } from "../Icons/Icons";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "./Buttons";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useSession } from "next-auth/react";
import { env } from "~/env";
import { api } from "~/utils/api";

interface EditButtonProps {
  video: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
  };
  refetch: () => Promise<unknown>;
}

export default function EditButton({ video, refetch }: EditButtonProps) {
  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const [currentPage, setCurrentPage] = useState(2);

  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);

  const [videoInfoForm, setVideoInfoForm] = useState({
    title: video.title,
    description: video.description,
  });

  const { data: sessionData } = useSession();

  const addVideoUpdateMutation = api.video.updateVideo.useMutation();

  const handleClick = () => {
    setCurrentPage(1);
    setOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setVideoInfoForm({
      ...videoInfoForm,
      [e.target.name]: e.target.value,
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0] ? e.target.files[0] : null);
      setCurrentPage(2);
    }
  };

  const handleSubmit = () => {
    type UploadResponse = {
      secure_url: string;
    };

    if (!!sessionData?.user.id && croppedImage) {
      const videoData = {
        id: video.id,
        userId: sessionData.user.id,
        title: video.title || undefined,
        description: video.description || undefined,
        thumbnailUrl: video.thumbnailUrl || undefined,
      };

      const formData = new FormData();
      formData.append("upload_preset", "user_uploads");
      formData.append("file", croppedImage);
      void fetch(
        "https://api.cloudinary.com/v1_1/" +
          env.NEXT_PUBLIC_CLOUDINARY_NAME +
          "/image/upload",

        {
          method: "POST",
          body: formData,
        },
      )
        .then((response) => {
          if (!response.ok) throw new Error("UPLOAD_ERROR:" + response.status);
          return response.json();
        })
        .then((data: UploadResponse) => {
          if (
            videoInfoForm.title !== video.title ||
            videoInfoForm.description !== video.description ||
            data.secure_url !== undefined
          ) {
            const newVideoData = {
              ...videoData,
              ...(data.secure_url && { thumbnailUrl: data.secure_url }),
            };

            // only include title and description if they've changed
            if (videoInfoForm.title !== video.title)
              newVideoData.title = videoInfoForm.title;
            if (videoInfoForm.description !== video.description)
              newVideoData.description = videoInfoForm.description;

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
    }
  };

  return (
    <>
      <button onClick={() => handleClick()}>
        <Edit className="mr-2 h-5 w-5 shrink-0 stroke-gray-600" />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative "
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-50"
            enterTo="opacity-75"
            leave="ease-in duration-200"
            leaveFrom="opacity-75"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
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
                  {currentPage === 1 && (
                    <>
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Edit Video
                          </Dialog.Title>
                          <p className="mt-2 text-sm text-gray-600">
                            Edit your thumbnail, title, and description
                          </p>
                          <div className="col-span-full">
                            <label
                              htmlFor="cover-photo"
                              className="block text-sm font-medium leading-6 text-gray-700"
                            >
                              Cover photo
                            </label>

                            <div className="mt-2 flex justify-center rounded-lg border-4 border-dashed border-gray-200/25 px-6 py-10">
                              <div className="text-center">
                                {croppedImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={croppedImage} alt="Cropped" />
                                ) : (
                                  <>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                      <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-gray-100 font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                                      >
                                        <span>Upload a file</span>

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
                                    <p className="text-xs leading-5 text-gray-600">
                                      PNG, JPG, GIF up to 10MB
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="title"
                              className="mt-2 block text-sm font-medium leading-6 text-gray-900"
                            >
                              Title
                            </label>

                            <input
                              type="text"
                              name="title"
                              id="title"
                              onChange={handleInputChange}
                              value={videoInfoForm.title}
                              className="block w-full rounded-md border-0 bg-gray-100 p-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />

                            <label
                              htmlFor="title"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Description
                            </label>
                            <textarea
                              rows={4}
                              name="description"
                              id="description"
                              value={videoInfoForm.description || ""}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-0 bg-gray-100 p-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                      <div className=" relative mt-5 flex flex-row-reverse gap-2 sm:mt-4 ">
                        <Button
                          type="reset"
                          variant="primary"
                          size="lg"
                          onClick={() => handleSubmit()}
                        >
                          Save
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
                  )}
                  {currentPage === 2 && (
                    <>
                      <ImageCropper
                        setCurrentPage={setCurrentPage}
                        setCroppedImage={setCroppedImage}
                        image={image}
                      />
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

interface CropperImageElement extends HTMLImageElement {
  cropper?: Cropper;
}

export function ImageCropper({
  setCurrentPage,
  setCroppedImage,
  image,
  handleSubmit,
  imageType,
  setOpen,
}: {
  handleSubmit?: (croppedDataUrl: string) => void;
  setCurrentPage?: (page: number) => void;
  setCroppedImage: (image: string | null) => void;
  image: File | null | string;
  imageType?: "backgroundImage" | "image";
  setOpen?: (open: boolean) => void;
}) {
  const cropperRef = useRef<CropperImageElement>(null);
  const cropImage = () => {
    if (cropperRef.current && cropperRef.current !== null) {
      const imageElement: CropperImageElement | null = cropperRef.current;
      const cropper: Cropper | undefined = imageElement.cropper;
      if (cropper) {
        const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
        setCroppedImage(croppedDataUrl);
        handleSubmit ? handleSubmit(croppedDataUrl) : null;
      }
    }
  };

  const completeCrop = () => {
    cropImage();
    setCurrentPage ? setCurrentPage(1) : null;
  };

  const cancelCrop = () => {
    setCurrentPage ? setCurrentPage(1) : null;
    setOpen ? setOpen(false) : null;
  };

  return (
    <div className="sm:flex sm:items-start">
      <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
        {image && (
          <div className="mt-5">
            <Cropper
              src={image instanceof File ? URL.createObjectURL(image) : image}
              style={{ height: "100%", width: "100%" }}
              aspectRatio={imageType === "image" ? 1 : 16 / 9}
              guides={false}
              ref={cropperRef}
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary-gray" size="lg" onClick={cancelCrop}>
                cancel
              </Button>
              <Button variant="primary" size="lg" onClick={completeCrop}>
                Crop Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
