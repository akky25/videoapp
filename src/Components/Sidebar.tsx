import { useRouter } from "next/router";
import {
  Lock,
  Brush,
  ClockRewind,
  Close,
  Folder,
  HelpCircle,
  Home,
  MessagePlusSquare,
  Settings,
  ThumbsUp,
  User,
  UserCheck,
  VideoRecorder,
  File,
  LogOut,
  Logo,
} from "./Icons/Icons";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "./Button/Buttons";
import { UserImage } from "./Components";
import { useTheme } from "./ThemeProvider";

interface SidebarProps {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  closeSidebar?: boolean;
}

interface NavigationItem {
  name: string;
  path?: string;
  icon: (className: string) => JSX.Element;
  current: boolean;
}

export default function Sidebar({
  isOpen,
  setSidebarOpen,
  closeSidebar,
}: SidebarProps) {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const { darkMode } = useTheme();

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const DesktopNavigation: NavigationItem[] = [
    {
      name: "Home",
      path: `/`,
      icon: (className) => <Home className={className} />,
      current: router.pathname === `/`,
    },
    {
      name: "Liked Videos",
      path: userId ? `/playlist/LikedVideos` : "sign-in",
      icon: (className) => <ThumbsUp className={className} />,
      current: router.pathname === `/playlist/LikedVideos`,
    },
    {
      name: "History",
      path: userId ? `/playlist/History` : "sign-in",
      icon: (className) => <ClockRewind className={className} />,
      current: router.pathname === `/playlist/History`,
    },
    {
      name: "Your Videos",
      path: userId ? `/${String(userId)}/ProfileVideos` : "sign-in",
      icon: (className) => <VideoRecorder className={className} />,
      current: router.asPath === `/${String(userId)}/ProfileVideos`,
    },
    {
      name: "Library",
      path: userId ? `/${String(userId)}/ProfilePlaylists` : "sign-in",
      icon: (className) => <Folder className={className} />,
      current: router.asPath === `/${String(userId)}/ProfilePlaylists`,
    },
    {
      name: "Following",
      path: userId ? `/${String(userId)}/ProfileFollowing` : "sign-in",
      icon: (className) => <UserCheck className={className} />,
      current: router.asPath === `/${String(userId)}/ProfileFollowing`,
    },
  ];

  const SignedInMobileNavigation: NavigationItem[] = [
    {
      name: "Profile",
      path: `/${String(userId)}/ProfileVideos`,
      icon: (className) => <User className={className} />,
      current: router.pathname === `/Profile`,
    },
    {
      name: "Creator Studio",
      path: `/Dashboard`,
      icon: (className) => <Brush className={className} />,
      current: router.pathname === `/CreatorStudio`,
    },
    {
      name: "Help",
      path: `/Blog/Help`,
      icon: (className) => <HelpCircle className={className} />,
      current: router.pathname === `/Blog/Help`,
    },
    {
      name: "Settings",
      path: `/Settings`,
      icon: (className) => <Settings className={className} />,
      current: router.pathname === `/Settings`,
    },
    {
      name: "Feedback",
      path: `mailto:vidapp@vidapp.com`,
      icon: (className) => <MessagePlusSquare className={className} />,
      current: router.pathname === `/Feedback`,
    },
  ];
  const SignedOutMobileNavigation: NavigationItem[] = [
    {
      name: "Help",
      path: `/Blog/Help`,
      icon: (className) => <HelpCircle className={className} />,
      current: router.pathname === `/Blog/Help`,
    },
    {
      name: "Feedback",
      path: `mailto:vidapp@vidapp.com`,
      icon: (className) => <MessagePlusSquare className={className} />,
      current: router.pathname === `/Feedback`,
    },
  ];

  const mobileNavigation = sessionData
    ? SignedInMobileNavigation
    : SignedOutMobileNavigation;

  useEffect(() => {
    DesktopNavigation.forEach((nav) => {
      nav.current = nav.path === router.pathname;
    });
    mobileNavigation.forEach((nav) => {
      nav.current = nav.path === router.pathname;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  return (
    <>
      <div
        className={classNames(
          closeSidebar ? "lg:w-20" : "lg:w-56",
          "bottom-0 top-16 hidden lg:fixed lg:z-40 lg:flex lg:flex-col",
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border border-gray-200 bg-background  px-6 pb-4">
          <nav className="flex flex-1 flex-col pt-8">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {DesktopNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.path === "sign-in") {
                            void signIn();
                          } else {
                            void router.push(item.path ?? "/");
                          }
                        }}
                        className={classNames(
                          item.current
                            ? "bg-gray-50 text-primary-600"
                            : "hover:bg-gray50 text-gray-700 hover:text-primary-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                        )}
                      >
                        {item.current
                          ? item.icon("h-5 w-5 shrink-0 stroke-primary-600")
                          : item.icon(
                              "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600",
                            )}
                        <p className={classNames(closeSidebar ? "hidden" : "")}>
                          {item.name}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    {
                      sessionData
                        ? void router.push("/Settings")
                        : void signIn();
                    }
                  }}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <Settings className="h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600" />
                  <p className={classNames(closeSidebar ? "hidden" : "")}>
                    Setting
                  </p>
                </Link>
                <Link
                  href="/Blog/Help"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  <HelpCircle
                    className={
                      "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600"
                    }
                  />
                  <p className={classNames(closeSidebar ? "hidden" : "")}>
                    Help
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-50"
            enterTo="opacity-80"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-80"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-200 opacity-80" />
          </Transition.Child>
          <div className="fixed inset-0 mb-16 flex">
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <Close className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className=" flex grow  flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-background   px-6 pb-4">
                  <nav className="flex flex-1 flex-col pt-4">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <Logo
                        className="w-32"
                        theme={darkMode ? "dark" : "light"}
                      />
                      <li className="border-t">
                        <ul role="list" className="-mx-2 space-y-1  pt-3 ">
                          {mobileNavigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (item.path === "sign-in") {
                                    void signIn();
                                  } else {
                                    void router.push(item.path ?? "/");
                                  }
                                }}
                                className={classNames(
                                  item.current
                                    ? "bg-gray-50 text-primary-600"
                                    : "hover:bg-gray50 text-gray-700 hover:text-primary-600",
                                  "group flex gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-6",
                                )}
                              >
                                {item.current
                                  ? item.icon(
                                      "h-5 w-5 shrink-0 stroke-primary-600",
                                    )
                                  : item.icon(
                                      "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600",
                                    )}
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto border-b">
                        <Link
                          href="/Blog/Privacy"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                        >
                          <Lock
                            className={
                              "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600"
                            }
                          />
                          Privacy
                        </Link>
                        <Link
                          href="/Blog/TOS"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                        >
                          <File
                            className={
                              "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600"
                            }
                          />
                          <p
                            className={classNames(closeSidebar ? "hidden" : "")}
                          >
                            Terms of Service
                          </p>
                        </Link>
                      </li>
                      {sessionData ? (
                        <div className="my-2 flex flex-row ">
                          <UserImage image={sessionData?.user.image ?? ""} />
                          <div className="ml-2 flex w-full flex-col  justify-start truncate text-sm ">
                            <p className="font-semibold text-gray-700">
                              {sessionData && (
                                <span>{sessionData.user?.name}</span>
                              )}
                            </p>
                            <p className=" text-gray-600">
                              {sessionData && (
                                <span>{sessionData.user?.email}</span>
                              )}
                            </p>
                          </div>
                          <Button
                            variant="tertiary-gray"
                            href="#"
                            size="lg"
                            onClick={() => signOut()}
                          >
                            <LogOut className="w-5 stroke-gray-600" />
                          </Button>
                        </div>
                      ) : (
                        <li className="space-y-2">
                          <Button
                            variant="primary"
                            size="2xl"
                            className="w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              {
                                void signIn();
                              }
                            }}
                          >
                            {" "}
                            Sign Up
                          </Button>
                          <Button
                            variant="secondary-gray"
                            size="2xl"
                            className="w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              {
                                void signIn();
                              }
                            }}
                          >
                            {" "}
                            Log In
                          </Button>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
