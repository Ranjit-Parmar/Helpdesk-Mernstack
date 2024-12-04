import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../redux/api/userApi";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const ResetPassword = () => {

  const Navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [password, setPassword] = useState('');
  const {token} = useParams();
    const handleSubmit = async (e) => {

      setButtonDisable(true);
      e.preventDefault();

      const resetPasswordResponse = await resetPassword({id:token, password:password});
      
      if(resetPasswordResponse?.data?.success){
        toast.success(resetPasswordResponse?.data?.message);
        setButtonDisable(false);
        Navigate('/login', {replace:true});
      }else{
        toast.error(resetPasswordResponse?.error?.data?.message)
        setButtonDisable(false);
        console.log(resetPasswordResponse);
        
      }
    }
  return (
    <>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          
          <h2 className="text-2xl font-bold mb-4 text-center">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit}>
            
            <div className="mb-4">
              
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="New Password"
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e)=>{setPassword(e.target.value)}}
              />
            </div>
           
            <button
              type="submit"
              className={` ${buttonDisable?'opacity-80 pointer-events-none':''} w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition-colors`}
            >
              {buttonDisable ? <ClipLoader color="#ffffff" size={20} /> : "Reset Password"}
              
            </button>
          </form>
        </div>
      </div>
    </>
  )
};

export default ResetPassword;
