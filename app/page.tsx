"use client";
import { ChevronLeft, MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/app/utils/index";
export default function Sidebar() {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  let isResizingRef = useRef(false);
  let sidebarRef = useRef<ElementRef<"main">>(null);
  let navbarRef = useRef<ElementRef<"div">>(null);

  const [isReseting, setReseting] = useState(false);
  const [collapsed, setCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      onCollapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);
  useEffect(() => {
    if (isMobile) {
      onCollapse();
    }
  }, [pathname, isMobile]);

  function onMouseDown(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
  function handleMouseMove(event: React.MouseEvent) {
    if (!isResizingRef.current) return;

    let newWidth = event.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.width = `calc(100%-${newWidth}px)`;
      navbarRef.current.style.left = `${newWidth}px`;
    }
  }
  const handleMouseUp = () => {
    isResizingRef.current = false;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  function resetWidth() {
    console.log("hhhh");

    if (sidebarRef.current && navbarRef.current) {
      setCollapsed(false);
      setReseting(true);
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.width = isMobile ? "0" : "calc(100%-240px)";
      navbarRef.current.style.left = isMobile ? "100%" : "240px";
      setTimeout(() => setReseting(false), 300);
    }
  }
  function onCollapse() {
    if (sidebarRef.current && navbarRef.current) {
      setCollapsed(true);
      setReseting(true);
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.left = "0";
      navbarRef.current.style.width = "100%";
      setTimeout(() => setReseting(false), 300);
    }
  }

  return (
    <>
      <main
        ref={sidebarRef}
        className={cn(
          "z-[99999] flex flex-col w-60 relative group/sidebar h-full bg-red-300 ",
          isReseting && "transition-all duration-300 ease-in-out",
          isMobile && "w-0"
        )}
      >
        <div
          className={cn(
            "absolute top-0 right-10 opacity-0 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100"
          )}
          // onClick={onResize}
        >
          <ChevronLeft onClick={onCollapse} />
        </div>
        <div
          onClick={resetWidth}
          onMouseDown={onMouseDown}
          className="absolute top-0 right-0 w-1 h-full bg-gray-300 cursor-ew-resize opacity-0 group-hover/sidebar:opacity-100 transition"
        />
      </main>
      <div
        ref={navbarRef}
        className={cn(
          "z-[99999] absolute bg-blue-300  top-0 left-60 w-[calc(100%-240px)]",
          isReseting && "transition-all duration-300 ease-in-out",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className="bg-transparent w-full">
          {collapsed && (
            <MenuIcon onClick={resetWidth} className="h-6 w-6 bg-red-700" />
          )}
        </nav>
      </div>
    </>
  );
}
