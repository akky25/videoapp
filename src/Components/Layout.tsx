import { useState } from "react";
import { Menu } from "./Icons/Icons";
import Navbar from "./Navbar";
import { Footer, Sidebar } from "./Components";

interface LayoutProps {
  children: JSX.Element;
  closeSidebar?: boolean;
}

export default function Layout({ children, closeSidebar }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Navbar>
        <button
          type="button"
          className="-mx-2 inline-flex items-center justify-center rounded-md p-2 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 stroke-gray-400" aria-hidden="true" />
        </button>
      </Navbar>
      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="lg:hidden">
        <Footer />
      </div>
      <div className={classNames(closeSidebar ? "lg:pl-20" : "lg:pl-56")}>
        <main className="py-24">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-x-4">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
