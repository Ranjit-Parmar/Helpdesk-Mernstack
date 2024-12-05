import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogIn } from "../redux/reducers/userReducer";
import { useCreateUserMutation } from "../redux/api/userApi";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const SignUp = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [createUser] = useCreateUserMutation();
  const [disableButton, setDisableButton] = useState(false);
  const [userSignupData, setUserSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const inputChangeHandler = (e) => {
    setUserSignupData((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setDisableButton(true)

      const responseData = await createUser(userSignupData);

      if (responseData?.data?.success) {
        const { data } = responseData;
        dispatch(userLogIn(data?.user));
        toast.success("user created successfully");
        setDisableButton(false);
        Navigate("/", { replace: true });
      } else {
        const { data } = responseData?.error;
        toast.error(data.error);
        setDisableButton(false);
      }
    } catch (error) {
      console.log("fail ", error);
      setDisableButton(false);
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-bold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={inputChangeHandler}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={inputChangeHandler}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={inputChangeHandler}
              />
            </div>
            <button
              type="submit"
              className={`${
                disableButton ? "pointer-events-none opacity-80" : ""} w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition-colors`}
            >
              {disableButton ? <ClipLoader color="#ffffff" size={20} /> : "Sign Up"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-700 mr-2">Already have an account?</span>
            <Link to="/" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
