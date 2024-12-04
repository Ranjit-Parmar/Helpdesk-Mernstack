import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, userLogIn, userLogOut } from "../redux/reducers/userReducer";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./Loader";

const ProtectedRoutes = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector((state) => state.userReducer);
  

  useEffect(() => {

    const token = localStorage.getItem("auth_token");

    if(token){

      getUser().then((res) => {
        if (res?.data?.success) {          
          dispatch(userLogIn(res?.data?.user));
        } else {
          dispatch(userLogOut());
          localStorage.clear('user');
          localStorage.clear('auth_token');
          toast.error('Session expired. Please log in again.');
        }
      });

    }else{
      dispatch(userLogOut());
    }
  }, [dispatch, isLoading]); 

  if (isLoading) {
    return <Loader/>; 
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default ProtectedRoutes;
