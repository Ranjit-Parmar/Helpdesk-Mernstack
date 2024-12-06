import { useState } from 'react';
import Edit_Icon from '../assets/Edit_Icon.svg';
import Delete_Icon from '../assets/Delete_Icon.svg';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { useDeleteUserMutation, useGetAllUsersQuery } from '../redux/api/userApi';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const User = () => {

  const [userRole, setUserRole] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetAllUsersQuery({role:userRole,page:page});
  const [ deleteUser ] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
   
      const responseData = await deleteUser(id);

      if (responseData?.data?.success) {
        toast.success(responseData?.data?.message);

      }else{
        console.log(responseData);
        toast.error('something went wrong! please try again');
      }
  }

  const setPageNumberHandler = (val) => {
    setPage(val);
  }
  
  
  // Error handling if the query fails
if (isError) {
  return <div>Error fetching users. Please try again later.</div>;
}

  return (
    isLoading ? <Loader/> :
    <div className="min-h-screen w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <select onChange={(e) => setUserRole(e.target.value)} className="p-2 border border-gray-300 rounded w-full md:w-auto">
          <option value="">Role</option>
          <option value="customer">Customer</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 overflow-x-auto">
        {data?.length === 0? ( <p>No tickets found.</p>) : (

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {data?.getAllUser?.map((user, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">{user._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-6">
                    <Link to={`/dashboard/edit-profile/${user._id}`}>
                  <img src={Edit_Icon} className='h-6 cursor-pointer' alt="edit icon"/>
                    </Link>
                    <div onClick={()=>{deleteHandler(user._id)}}>
                  <img src={Delete_Icon} className='h-6 cursor-pointer' alt="delete icon"/>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
            
          </table>
        )}
      </div>

      <Pagination totalDocuments={data && data.totalDocuments} setPageNumberHandler={setPageNumberHandler}  itemPerPage={data && data.itemPerPage}/>
    </div>
  );
};

export default User;
