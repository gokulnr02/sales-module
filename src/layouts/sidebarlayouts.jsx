"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../app/Components/Sidebar";
import { X } from "lucide-react";

export default function Salesmodulelayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState(null);

  useEffect(() => {
    if (pathname !== "/dashboard" && pathname !== "/") {
      const parts = pathname.split("/").filter(Boolean);
      const name = parts[parts.length - 1];
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      const menu = { name: formattedName, link: pathname };

      setSelectedMenus((prev) => {
        const exists = prev.some((m) => m.link === menu.link);
        const updated = exists ? prev : [...prev, menu];
        setActivePath(menu.link);
        return updated;
      });
    } else {
      setActivePath(null);
    }
  }, [pathname]);

  const handleSelectActiveMenu = (menu) => {
    if (menu.link !== pathname) {
      setActivePath(menu.link);
      router.push(menu.link);
    }
  };

  const handleRemoveMenu = (menuToRemove) => {
    setSelectedMenus((prev) => {
      const updated = prev.filter((menu) => menu.link !== menuToRemove.link);
      if (pathname === menuToRemove.link) {
        router.push(updated.length ? updated[updated.length - 1].link : "/dashboard");
      }
      return updated;
    });
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed((prev) => !prev)}
        onMenuSelect={(menu) => {
          setSelectedMenus((prev) => {
            const exists = prev.some((m) => m.link === menu.link);
            return exists ? prev : [...prev, menu];
          });
          handleSelectActiveMenu(menu);
        }}
      />

      <div className="flex-1 flex flex-col h-full bg-gray-100 overflow-hidden">
        {/* Tab Bar */}
        <div className="flex items-center bg-white overflow-x-auto whitespace-nowrap border-b  space-x-2">
          {selectedMenus.map((menu, index) => {
            const isActive = activePath === menu.link;
            return (
              <div
                key={index}
                className={`flex items-center  cursor-pointer transition-all text-sm font-medium border-b-2 ${
                  isActive
                    ? "border-red-500 bg-gray-100"
                    : "border-transparent hover:text-black hover:bg-gray-200"
                }`}
                style={{ color: isActive ? "blue" : "gray" ,height: "30px", padding: "0 10px" }}
                onClick={() => handleSelectActiveMenu(menu)}
              >
                <span>{menu.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveMenu(menu);
                  }}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" style={{ color: "red" }} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Breadcrumb */}
        <div className="px-3 py-1 font-medium bg-white border-b text-gray-700" style={{fontSize: "11px"}}>
          {activePath
            ? activePath
                .split("/")
                .filter(Boolean)
                .map((part, idx, arr) => (
                  <span key={idx}>
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                    {idx < arr.length - 1 && <span className="mx-1">{" > "}</span>}
                  </span>
                ))
            : ""}
        </div>

        {/* Main Content */}
        <div className="flex-1 ">{children}</div>
      </div>
    </div>
  );
}
