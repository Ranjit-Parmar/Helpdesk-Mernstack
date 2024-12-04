import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getUser, userLogIn, userLogOut } from "../redux/reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "./Loader";

const ProtectedAdminRoutes = ({ children }) => {
  const dispatch = useDispatch();
  const {isLoading, isLoggedIn, user} = useSelector((state)=>state.userReducer);

  useEffect(()=>{
    const token = localStorage.getItem('auth_token');
    if(token){
      getUser().then((res)=>{
        if(res?.data?.success){
          const {data} = res;
          dispatch(userLogIn(data?.user));
        }else{
          dispatch(userLogOut());
          localStorage.clear('auth_token');
          localStorage.clear('user');
          toast.error('Session expired. Please log in again.');
        }
      })
    }else{
      dispatch(userLogOut());
    }
  },[dispatch, isLoading])

  if (isLoading) {
    return <Loader/>; 
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }
    
  if(user.role === 'admin' || user.role === 'agent'){ 
    return children;
  }
  return <Navigate to="/" replace={true} />;
};

export default ProtectedAdminRoutes;
