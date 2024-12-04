import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogOut } from "../redux/reducers/userReducer";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import axios from "axios";

const CustomerHeader = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {

      const option = {
        url: "http://localhost:3000/api/v1/user/logOut",
        method: "GET",
        withCredentials: true,
      };

      const responseData = await axios(option);

      if (responseData?.status === 200) {
        toast.success(responseData?.data?.message);
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
        dispatch(userLogOut());
      }

    } catch (error) {
      console.log(error);
      const { data } = error?.response;
      toast.error(data.message);
    }

    Navigate("/", { replace: true });
    
  };

  return (
    <header className="bg-indigo-600 text-white p-4 mb-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/"> Helpdesk App </Link>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 py-2 px-4 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default CustomerHeader;
