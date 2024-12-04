import React, { useState } from 'react';
import Edit_Icon from '../assets/Edit_Icon.svg';  
import Delete_Icon from '../assets/Delete_Icon.svg';  
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { useDeleteTicketMutation, useGetAllAgentTicketsQuery, useGetAllTicketsQuery } from '../redux/api/ticketApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { FaReply } from 'react-icons/fa';
import Loader from '../components/Loader';

const Tickets = () => {


  const {user} = useSelector((state)=>state.userReducer);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
 

  const { data: ticketData, isLoading, isError } = useGetAllTicketsQuery({status: statusFilter, tags: tagFilter, page:page});
  const { data: allAgentTickets, isLoading:agentTicketIsloading, isError:agentIsError } = useGetAllAgentTicketsQuery({id:user._id, status: statusFilter, tags: tagFilter, page:page});
  const [ deleteTicket ] = useDeleteTicketMutation();

  const deleteHandler = async (id) => {
   
    const responseData = await deleteTicket(id);

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
if (isError || agentIsError) {
  return <div>Error fetching tickets. Please try again later.</div>;
}

  
  return (
    isLoading || agentTicketIsloading? <Loader/> : <>
   <h1 className="text-2xl font-bold mb-4 md:ml-4">Tickets</h1>
<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4 md:ml-4">
      <select onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border border-gray-300 rounded w-full md:w-auto">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="closed">Closed</option>
      </select>
      <select onChange={(e) => setTagFilter(e.target.value)} className="p-2 border border-gray-300 rounded w-full md:w-auto">
        <option value="">All Tags</option>
        <option value="Technical">Technical</option>
        <option value="Billing">Billing</option>
        <option value="General">General</option>
        <option value="Account">Account</option>
      </select>
    </div>
   <div className="p-4 ">
   <div className="bg-white p-4 rounded-lg shadow-md mb-4 overflow-x-auto">
   {(user.role==='admin'?ticketData:allAgentTickets)?.allTickets?.length === 0 ? (
            <p>No tickets found.</p>
          ) : (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {(user.role==='admin'?ticketData:allAgentTickets)?.allTickets?.map((ticket,i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket?._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket?.title}</td>
                    <td>
                      <span className={`${ticket?.status==='active'?'bg-green-600':ticket?.status==='pending'?'bg-orange-400':'bg-red-500'} px-3 py-1 text-white  whitespace-nowrap rounded-lg`}>
                      {ticket?.status}
                      </span>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.role==='admin'?(ticket?.customerId?.username):(ticket?.assignee?.username)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket?.lastUpdated?.split('T')[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ticket?.tags}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-6">
                      <Link to={`/dashboard/getTicket/${ticket._id}`}>
                    <img src={Edit_Icon} className='h-8 cursor-pointer' alt="edit icon"/>
                      </Link>
                      <div onClick={()=>{deleteHandler(ticket._id)}}>
                  <img src={Delete_Icon} className='h-8 cursor-pointer' alt="delete icon"/>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/messages/${ticket._id}`}>
                    <FaReply />
                      </Link>
                    </td>
                  </tr>
                ))}
        </tbody>
      </table>)}
    </div>
    {user.role==='admin'? <Pagination totalTickets={ticketData && ticketData.totalDocuments} setPageNumberHandler={setPageNumberHandler}  itemPerPage={ticketData && ticketData.itemPerPage}/> : <Pagination totalTickets={allAgentTickets && allAgentTickets.totalDocuments} setPageNumberHandler={setPageNumberHandler} itemPerPage={allAgentTickets && allAgentTickets.itemPerPage}/>}
   </div>
   </>
      
  );
};

export default Tickets;




