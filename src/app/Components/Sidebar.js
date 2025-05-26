"use client";
import {
  ChevronDown,
  ChevronUp,
  Menu,
  LogOut, DatabaseZap, UserRoundPlus, BadgeIndianRupee,
  
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoFolderOutline } from "react-icons/io5";


export default function Sidebar({ isCollapsed, toggleCollapse, onMenuSelect }) {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});
  const [hoveredMenu, setHoveredMenu] = useState(null);
  console.log(hoveredMenu,'hoveredMenu')
  const menu = [
    {
      menuName: "Masters",
      Icon: DatabaseZap,
      visibile: true,
      subMenu: [{ name: "Customer", Icon: UserRoundPlus, visibile: true, link: "/Masters/Supplier" }],
    },
    {
      menuName: "Transaction",
      Icon: IoFolderOutline,
      visibile: true,
      subMenu: [{ name: "Sales", Icon: BadgeIndianRupee, visibile: true, link: "/Transaction/Sales" }],
    },
    // others...
  ];


  const toggleSubMenu = (item) => {
    const hasSubMenu = item.subMenu && item.subMenu.length > 0;

    if (!hasSubMenu) {
      toggleCollapse()
      onMenuSelect({
        menuName: item.menuName,
        link: item.link,
        parent: null,
      });
      if (item.link) router.push(item.link);
    } else {
      if (isCollapsed) {
        toggleCollapse();
      }

      setOpenMenus((prev) => ({
        ...prev,
        [item.menuName]: !prev[item.menuName],
      }));
    }
  };

  const handleLogout = () => {
    alert("Logging out...");
    router.push("/login");
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out h-screen bg-white shadow-xl flex flex-col relative ${isCollapsed ? "w-[50px]" : "w-[250px]"
        }`}
    >
      {/* Top Bar */}
      <div className="h-12 px-2 flex items-center justify-center border-b border-gray-200">
        {!isCollapsed ? (
          <Image
            src="/images/BrandLogo.jpg"
            alt="Brand Logo"
            width={170}
            height={0}
            className="w-[120px] sm:w-[140px] md:w-[170px]"
          />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" onClick={toggleCollapse} />
        )}

      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-4">
        {menu
          .filter((item) => item.visibile)
          .map((item, idx) => {
            const isActive =
              pathname === item.link ||
              item?.subMenu?.some((sub) => pathname === sub.link);

            return (
              <div
                key={idx}
                className="mb-1 relative"
                onMouseEnter={() => setHoveredMenu(item.menuName)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <div
                  className={`flex items-center justify-between p-[6px] rounded-lg transition-colors group cursor-pointer ${isActive
                    ? "bg-gray-100 text-primary font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                    }`}
                  onClick={() => toggleSubMenu(item)}
                >
                  <div className="flex items-center gap-3 relative">
                    <item.Icon className="w-5 h-5 text-gray-500 group-hover:text-primary" title={item.menuName} />
                    {!isCollapsed && (
                      <span className="text-sm">{item.menuName}</span>
                    )}
                  </div>
                  {!isCollapsed &&
                    item.subMenu &&
                    item.subMenu.length > 0 &&
                    (openMenus[item.menuName] ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ))}
                </div>

                {/* Submenus */}
                {!isCollapsed &&
                  item.subMenu &&
                  openMenus[item.menuName] &&
                  item.subMenu.length > 0 && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.subMenu.map((sub, subIdx) => (
                        <li key={subIdx}>
                          <button
                            onClick={() => {
                              toggleCollapse();
                              onMenuSelect({
                                name: sub.name,
                                link: sub.link,
                                parent: item.menuName,
                              });
                              router.push(sub.link);
                            }}
                            className={`flex items-center w-full text-sm text-left text-gray-600 hover:bg-gray-100 px-2 py-1 rounded-md ${pathname === sub.link
                              ? "bg-gray-200 font-medium"
                              : ""
                              }`}
                          >
                            <sub.Icon className="w-4 h-4 mr-2" />
                            {sub.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            );
          })}
      </div>

      {/* Logout */}
      <div className="px-2 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
