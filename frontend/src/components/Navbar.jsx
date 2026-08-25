import { FiMenu, FiX } from "react-icons/fi";
import { RiMenuLine } from "react-icons/ri";
import logo from "../assets/images/logographic.png";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import useAuth from "../hooks/useAuth";
import LogoutModal from "./LogoutModal";

function Navbar({
  isSidebarCollapsed,
  isMobileSidebarOpen,
  onToggleSidebar,
  onToggleMobileSidebar,
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuthContext();
  const { logout, loading } = useAuth();

  const openLogoutModal = () => {
    setIsAvatarMenuOpen(false);
    setIsLogoutModalOpen(true);
  };

  return (
    <div
      className={`flex w-full h-16 items-center justify-between px-4 border-b border-gray-200`}
    >
      <div
        className={`${
          isSearchFocused ? "hidden lg:flex" : "flex"
        } items-center gap-x-2`}
      >
        <button
          type="button"
          className={`inline-flex lg:hidden items-center justify-center w-9 h-9 rounded-lg hover:bg-white/70`}
          onClick={onToggleMobileSidebar}
          aria-label={
            isMobileSidebarOpen ? "Close navigation" : "Open navigation"
          }
          title={isMobileSidebarOpen ? "Close navigation" : "Open navigation"}
        >
          {isMobileSidebarOpen ? <FiX /> : <FiMenu />}
        </button>
        <button
          type="button"
          className={`hidden lg:inline-flex items-center justify-center p-2.5 rounded-[0.6rem] hover:bg-gray-100`}
          onClick={onToggleSidebar}
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <RiMenuLine className={`text-[16px]`} />
        </button>

        <Link to={"/"}>
          <img src={logo} alt="app-logo" className={`h-auto w-10`} />
        </Link>
      </div>

      <div
        className={`flex items-center ${
          isSearchFocused ? "w-[90%] lg:w-[40%]" : "w-[40%]"
        } ${
          isSearchFocused ? "mx-auto lg:mx-0" : ""
        } h-9.5 px-3 border border-gray-300 focus-within:border-transparent focus-within:ring focus-within:ring-[#8132e5] rounded-xl overflow-x-hidden transition-[width] duration-150 ease-in-out`}
      >
        <CiSearch className={`text-[18px] shrink-0`} />
        <input
          type="text"
          name=""
          value={searchQuery}
          placeholder="Search"
          className={`flex-1 min-w-0 min-h-full outline-none text-[14.5px] text-[#3d3d3d] pl-2`}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={`relative`}>
        <div
          className={`${
            isSearchFocused ? "hidden lg:block" : "block"
          } h-9 w-9 overflow-hidden rounded-full border border-gray-100`}
          onClick={() => setIsAvatarMenuOpen((prev) => !prev)}
        >
          <img
            src={user.avatar}
            alt="user-avatar"
            className={`h-full w-full object-cover`}
          />
        </div>

        <div
          className={`${isAvatarMenuOpen ? "absolute" : "hidden"} right-0 top-11 z-50 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60 transition-transform duration-200 ease-in-out`}
        >
          <div className={`flex w-full flex-col p-1.5`}>
            <div
              className={`border-b border-gray-200 px-3 pb-2.5 pt-1.5 text-[14px] font-semibold text-gray-800`}
            >
              {user.fullName}
            </div>
            <Link
              className={`flex h-9 items-center gap-x-3 rounded-lg px-3 mt-1 text-gray-700 transition-colors hover:bg-[#f1edfc] hover:text-[#8132e5] active:bg-[#f1edfc] active:text-[#8132e5]`}
            >
              <FaRegUser className={`text-[15px]`} />
              <span className={`text-[14px]`}>My channel</span>
            </Link>
            <Link
              className={`flex h-9 items-center gap-x-3 rounded-lg px-3 text-gray-700 transition-colors hover:bg-[#f1edfc] hover:text-[#8132e5] active:bg-[#f1edfc] active:text-[#8132e5]`}
            >
              <LuLayoutDashboard className={`text-[15px]`} />
              <span className={`text-[14px]`}>Dashboard</span>
            </Link>
            <Link
              className={`flex h-9 items-center gap-x-3 rounded-lg px-3 text-gray-700 transition-colors hover:bg-[#f1edfc] hover:text-[#8132e5] active:bg-[#f1edfc] active:text-[#8132e5]`}
            >
              <LuSettings className={`text-[15px]`} />
              <span className={`text-[14px]`}>Settings</span>
            </Link>
            <div className={`my-1 border-t border-gray-200`}></div>
            <button
              type="button"
              onClick={openLogoutModal}
              className={`flex h-9 items-center gap-x-3 rounded-lg px-3 text-gray-700 transition-colors hover:bg-[#f1edfc] hover:text-[#8132e5] active:bg-[#f1edfc] active:text-[#8132e5]`}
            >
              <FiLogOut className={`text-[15.5px]`} />
              <span className={`text-[14px]`}>Log out</span>
            </button>
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        loading={loading}
      />
    </div>
  );
}

export default Navbar;
