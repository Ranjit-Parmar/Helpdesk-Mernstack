// src/pages/Tickets.js
import React, { useState } from 'react';
import Edit_Icon from '../assets/Edit_Icon.svg';
import { FaReply } from "react-icons/fa";
import CustomerHeader from '../components/CustomerHeader';
import { useGetAllCustomerTicketsQuery } from '../redux/api/ticketApi';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';

const CustomerTickets = () => {

  const {user} = useSelector((state)=>state.userReducer);

  if(user.role === 'admin' || user.role === 'agent'){
    return <Navigate to="/dashboard" replace={true} />;
  } 

  const [statusFilter, setStatusFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');


  const {data:customerAllTickets, isLoading, isError} = useGetAllCustomerTicketsQuery({id:user._id,status:statusFilter,tags:tagFilter});
    
// Error handling if the query fails
if (isError) {
  return <div>Error fetching tickets. Please try again later.</div>;
}
  return (
    isLoading ? <Loader/>:
    <>
    <CustomerHeader/>
    <div className="min-h-screen w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <select onChange={(e) => {setStatusFilter(e.target.value)}} className="p-2 border border-gray-300 rounded w-full md:w-auto">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>
        <select onChange={(e) => {setTagFilter(e.target.value)}} className="p-2 border border-gray-300 rounded w-full md:w-auto">
          <option value="">All Tags</option>
          <option value="Technical">Technical</option>
          <option value="Billing">Billing</option>
          <option value="General">General</option>
          <option value="Account">Account</option>
        </select>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 overflow-x-auto">
      {customerAllTickets?.allTickets?.length === 0 ? (
            <p>No tickets found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Add Note</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerAllTickets?.allTickets?.map((ticket, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket?._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket?.title}</td>
                    <td>
                      <span className={`${ticket?.status === 'Active' ? 'bg-green-600' : ticket?.status === 'Pending' ? 'bg-orange-400' : 'bg-red-500'} px-3 py-1 text-white whitespace-nowrap rounded-lg`}>
                        {ticket?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket?.lastUpdated.split('T')[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket?.tags}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/addNote/${ticket._id}`}>
                      <img src={Edit_Icon} alt="edit icon" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/messages/${ticket._id}`}>
                    <FaReply />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
    </>
  );
};

export default CustomerTickets;
