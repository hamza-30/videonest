import { Link } from "react-router-dom";
import { BiHomeAlt } from "react-icons/bi";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineHistory } from "react-icons/md";
import { LuVideo } from "react-icons/lu";
import { FaRegFolder } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }) {
  const [areLabelsVisible, setAreLabelsVisible] = useState(isMobileOpen);
  const [isSidebarWidthCollapsed, setIsSidebarWidthCollapsed] =
    useState(isCollapsed);

  useEffect(() => {
    if (isMobileOpen || isCollapsed) {
      setAreLabelsVisible(isMobileOpen);

      if (isMobileOpen) {
        setIsSidebarWidthCollapsed(false);
        return;
      }

      const collapseTimer = setTimeout(
        () => setIsSidebarWidthCollapsed(true),
        25
      );

      return () => clearTimeout(collapseTimer);
    }

    setIsSidebarWidthCollapsed(false);
    setAreLabelsVisible(false);
    const revealTimer = setTimeout(() => setAreLabelsVisible(true), 25);

    return () => clearTimeout(revealTimer);
  }, [isCollapsed, isMobileOpen]);

  const showLabels = isMobileOpen || areLabelsVisible;
  const linkClassName = `flex items-center bg-white border border-gray-200 rounded-xl h-10 text-[0.92rem] transition-all duration-200 ${
    showLabels ? "w-full gap-x-3 pl-3" : "w-11 justify-center"
  }`;
  const labelClassName = `mt-0.75 overflow-hidden whitespace-nowrap transition-all duration-150 ${
    showLabels
      ? "max-w-40 translate-x-0 opacity-100"
      : "max-w-0 -translate-x-2 opacity-0"
  }`;

  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 top-16 z-30 bg-black/8 lg:hidden ${
          isMobileOpen ? "block" : "hidden"
        }`}
        onClick={onCloseMobile}
        aria-label="Close navigation"
      />
      <div
        className={`fixed inset-y-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 shrink-0 flex-col justify-between bg-[#f5f5f5] border-r border-gray-200 p-3 transition-transform duration-200 lg:static lg:z-auto lg:flex lg:transition-[width] lg:duration-200 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isSidebarWidthCollapsed ? "lg:w-17" : "lg:w-59"}`}
      >
        <div className={`flex flex-col gap-y-2`}>
          <Link className={linkClassName} onClick={onCloseMobile}>
            <BiHomeAlt className={`text-lg`} />
            <span className={labelClassName}>Home</span>
          </Link>
          <Link className={linkClassName} onClick={onCloseMobile}>
            <AiOutlineLike className={`text-lg`} />
            <span className={labelClassName}>Liked Videos</span>
          </Link>
          <Link className={linkClassName} onClick={onCloseMobile}>
            <MdOutlineHistory className={`text-lg`} />
            <span className={labelClassName}>History</span>
          </Link>
          <Link className={linkClassName} onClick={onCloseMobile}>
            <FaRegFolder className={`text-[16px]`} />
            <span className={labelClassName}>My Content</span>
          </Link>
          <Link className={linkClassName} onClick={onCloseMobile}>
            <LuVideo className={`text-lg`} />
            <span className={labelClassName}>Collections</span>
          </Link>
          <Link className={linkClassName} onClick={onCloseMobile}>
            <FiUsers className={`text-[16px]`} />
            <span className={labelClassName}>Subscribers</span>
          </Link>
        </div>

        <div>
          <Link className={linkClassName} onClick={onCloseMobile}>
            <IoSettingsOutline className={`text-[16px]`} />
            <span className={labelClassName}>Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
