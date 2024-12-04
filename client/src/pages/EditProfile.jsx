import { useNavigate, useParams } from "react-router-dom";
import { useUpdateUserRoleMutation } from "../redux/api/userApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const EditProfile = () => {
  
    const Navigate = useNavigate();

    const {id} = useParams();
    const [ role, setRole ] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    
    const [ updateUserRole ] = useUpdateUserRoleMutation();

    const handleSubmit = async(e) => {
      
          e.preventDefault();
          setDisableButton(true)
          
          const updatedUserResponse = await updateUserRole({id, role});
          
          if(updatedUserResponse?.data?.success){
            toast.success(updatedUserResponse.data.message)
            setDisableButton(false)
            Navigate('/dashboard/users', {replace:true})
          }else{ 
            console.log(updatedUserResponse);
            toast.error("something went wrong! please try again");
            setDisableButton(false)
          }
          
        
    }

  return (
    <div className="w-full max-w-lg mt-7 mx-auto p-6 bg-white border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Edit User Role</h2>
      <form onSubmit={handleSubmit}>
    
        {/* Role Field */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700">Role</label>
          <select
            id="role"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e)=>{setRole(e.target.value)}}
          >
            <option value="">Roles</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            className={`${disableButton ? "pointer-events-none opacity-80" : ""} px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600`}
            disabled={disableButton}
          >
            {disableButton ? <ClipLoader color="#ffffff" size={20} /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
