import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { userLogOut } from "../redux/reducers/userReducer";
import axios from "axios";
import toast from "react-hot-toast";
import {
  useGetAllAgentTicketsQuery,
  useGetAllTicketsQuery,
} from "../redux/api/ticketApi";
import Loader from "./Loader";

const Sidebar = () => {
  const { setIsOpen } = useContext(AuthContext);

  const { user } = useSelector((state) => state.userReducer);
  const { data: allTicketsData, isLoading, isError } = useGetAllTicketsQuery();
  const {
    data: allAgentTickets,
    isLoading: agentTicketIsloading,
    isError: agentIsError,
  } = useGetAllAgentTicketsQuery({ id: user._id });

  const dispatch = useDispatch();

  const Navigate = useNavigate();

  const logOutHandler = async () => {
    try {
      const option = {
        url: `${import.meta.env.VITE_BASE_URL}/api/v1/user/logOut`,
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

    setIsOpen(false)
    Navigate("/", { replace: true });
  };

  // Error handling if the query fails
  if (isError) {
    return <div>Error fetching tickets. Please try again later.</div>;
  }
  if (agentIsError) {
    return <div>Error fetching agents. Please try again later.</div>;
  }

  return isLoading || agentTicketIsloading ? (
    <Loader />
  ) : (
    <>
      
      <div className="h-full px-3 py-4 overflow-y-auto text-white bg-gray-800">
        
        <button
          className="focus:ring-gray-200 md:hidden focus:rounded-md focus:outline-none focus:ring-2 float-end mr-2"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          
          <FaTimes />
        </button>
        <Link to="/dashboard/" className="flex items-center ps-2.5 mb-5">
          
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            
            Help Desk
          </span>
        </Link>
        <ul className="space-y-2 font-medium">
          
          {user.role === "admin" ? (
            <>
              
              <li>
                
                <Link
                  to="/dashboard/"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-600 group"
                >
                  
                  <span
                    className="ms-3"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                
                <Link
                  to="/dashboard/tickets"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-600 group"
                >
                  
                  <span
                    className="flex-1 ms-3 whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    All Tickets
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    
                    {allTicketsData?.length}
                  </span>
                </Link>
              </li>
              <li>
                
                <Link
                  to="/dashboard/users"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-600 group"
                >
                  
                  <span
                    className="flex-1 ms-3 whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    Manage Users
                  </span>
                </Link>
              </li>
              <li>
                
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-600 group">
                  
                  <span
                    className="flex-1 ms-3 whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    All Active Tickets
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    
                    {
                      allTicketsData?.allTickets?.filter(
                        (val) => val.status === "active"
                      ).length
                    }
                  </span>
                </div>
              </li>
              <li>
                
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-600 group">
                  
                  <span
                    className="flex-1 ms-3 whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    All Pending Tickets
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    
                    {
                      allTicketsData?.allTickets?.filter(
                        (val) => val.status === "pending"
                      ).length
                    }
                  </span>
                </div>
              </li>
              <li>
                
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-600 group">
                  
                  <span
                    className="flex-1 ms-3 whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    All Closed Tickets
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    
                    {
                      allTicketsData?.allTickets?.filter(
                        (val) => val.status === "closed"
                      ).length
                    }
                  </span>
                </div>
              </li>
            </>
          ) : (
            <>
              
              <li>
                
                <Link
                  to="/dashboard/"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-600 group"
                >
                  
                  <span
                    className="ms-3"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    Dashboard
                  </span>
                </Link>
              </li>
              <li>
                
                <Link
                  to="/dashboard/tickets"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-600 group"
                >
                  
                  <span
                    className="flex-1 ms-3 whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    All Tickets
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    
                    {allAgentTickets?.length}
                  </span>
                </Link>
              </li>
              <li>
                
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-600 group">
                  
                  <span
                    className="flex-1 ms-3 whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    My Active Tickets
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    
                    {
                      allAgentTickets?.allTickets?.filter(
                        (val) => val.status === "active"
                      ).length
                    }
                  </span>
                </div>
              </li>
              <li>
                
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-600 group">
                  
                  <span
                    className="flex-1 ms-3 whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    My Pending Tickets
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    
                    {
                      allAgentTickets?.allTickets?.filter(
                        (val) => val.status === "pending"
                      ).length
                    }
                  </span>
                </div>
              </li>
              <li>
                
                <div className="flex items-center p-2 rounded-lg hover:bg-gray-600 group">
                  
                  <span
                    className="flex-1 ms-3 whitespace-nowrap"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    
                    My Closed Tickets
                  </span>
                  <span className="inline-flex items-center justify-center w-6 h-6 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                    
                    {
                      allAgentTickets?.allTickets?.filter(
                        (val) => val.status === "closed"
                      ).length
                    }
                  </span>
                </div>
              </li>
            </>
          )}
          <li>
            
            <button
              className="flex items-center p-2 w-full rounded-lg bg-blue-600 hover:bg-blue-700 group"
              onClick={logOutHandler}
            >
              
              <span className="flex-1 ms-3 whitespace-nowrap">
                Log Out
              </span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
