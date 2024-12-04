import { useContext } from "react";
import { FaBars } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const { isOpen, setIsOpen } = useContext(AuthContext);

  return (
    <>
      <button
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-800 rounded-lg sm:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <FaBars />
      </button>

      <aside
        className={`${isOpen? 'w-full':'w-0 -left-7'} h-screen z-30 md:w-64 fixed top-0 md:left-0 transition-all ease-linear duration-150`}
      >
        <Sidebar />
      </aside>

      <div className="p-4 md:ml-60">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
