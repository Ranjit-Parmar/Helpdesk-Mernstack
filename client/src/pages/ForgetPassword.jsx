import React, { useState } from "react";
import { useForgotPasswordMutation } from "../redux/api/userApi";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const ForgetPassword = () => {

  const [email, setEmail] = useState('');
  const [forgetPassword] = useForgotPasswordMutation();
  const [buttonDisable, setButtonDisable] = useState(false);

    const handleSubmit = async (e) => {

      setButtonDisable(true);
      e.preventDefault();

      const forgetPasswordResponse = await forgetPassword(email);

      if(forgetPasswordResponse?.data?.success){
        toast.success('reset password link sent to your email');
        setButtonDisable(false);
        setEmail('')
      }else{
        setButtonDisable(false);
        console.log(forgetPasswordResponse);
      }
      
    }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          
          <h2 className="text-2xl font-bold mb-4 text-center">
            Forget Password
          </h2>
          <form onSubmit={handleSubmit}>
            
            <div className="mb-6">
              
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
                required
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e)=>{setEmail(e.target.value)}}
              />
            </div>
            <button
              className={`${buttonDisable?'opacity-80 pointer-events-none':''} w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition-colors`} >
              {buttonDisable ? <ClipLoader color="#ffffff" size={20} /> : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
