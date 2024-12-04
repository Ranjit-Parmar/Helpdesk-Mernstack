import { Link, Navigate } from 'react-router-dom';
import CustomerHeader from '../components/CustomerHeader';
import { useSelector } from 'react-redux';

const CustomerHomePage = () => {

  const {user} = useSelector((state)=>state.userReducer);

 
      if(user.role === 'admin' || user.role === 'agent'){
        return <Navigate to="/dashboard" replace={true} />;
      } 


  return (
    <>
    <CustomerHeader/>
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Welcome to Helpdesk</h2>
      <p className="mb-6">How can we assist you today?</p>
      <div className="flex flex-col space-y-4">
        <Link to="/create-ticket" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center">
          Create New Ticket
        </Link>
        <Link to="/my-tickets" className="w-full bg-gray-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center">
          View My Tickets
        </Link>
      </div>
    </div>
    </>
  );
};

export default CustomerHomePage;
