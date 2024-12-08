import { useSelector } from 'react-redux';
import { useGetAllAgentTicketsQuery, useGetAllTicketsQuery } from '../redux/api/ticketApi'
import { useGetAllUsersQuery } from '../redux/api/userApi';
import Loader from '../components/Loader';

const Home = () => {

  
  const {user} = useSelector((state)=>state.userReducer);
  const { data: allTicketsData, isLoading, isError } = useGetAllTicketsQuery();
  const { data: allAgentTickets, isLoading:agentTicketIsloading, isError:agentIsError } = useGetAllAgentTicketsQuery({id:user._id});
  const {data : allUsers, isLoading : userIsLoading, isError : userIsError} = useGetAllUsersQuery();
  
// Error handling if the query fails
if (isError) {
  return <div>Error fetching tickets. Please try again later.</div>;
}
if (userIsError) {
  return <div>Error fetching users. Please try again later.</div>;
}
if (agentIsError) {
  return <div>Error fetching agents. Please try again later.</div>;
}
  

  return (
    isLoading || userIsLoading || agentTicketIsloading ? <Loader/> :
    <>
    <div className="min-h-screen w-full p-6 ">        
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
            
            <h2 className="text-lg font-bold">Total Tickets</h2>
            <p className="text-3xl">{user.role==='admin' ? allTicketsData?.totalDocuments : allAgentTickets?.totalDocuments}</p>
          </div>
          <div className={`${user.role==='admin'?'block':'hidden'} bg-pink-400 text-white p-4 rounded-lg shadow-md`}>
            
            <h2 className="text-lg font-bold">Total Users</h2>
            <p className="text-3xl">{allUsers.totalDocuments}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
            
            <h2 className="text-lg font-bold">Total Active Tickets</h2>
            <p className="text-3xl">{(user.role==="admin"?allTicketsData : allAgentTickets).showAllTickets.filter((val)=>val.status==='active').length}</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
            
            <h2 className="text-lg font-bold">Total Unsolved Tickets</h2>
            <p className="text-3xl">{(user.role==="admin"?allTicketsData : allAgentTickets).showAllTickets.filter((val)=>val.status==='pending').length}</p>
          </div>
          <div className="bg-orange-300 text-white p-4 rounded-lg shadow-md">
            
            <h2 className="text-lg font-bold">Total Closed Tickets</h2>
            <p className="text-3xl">{(user.role==="admin"?allTicketsData : allAgentTickets).showAllTickets.filter((val)=>val.status==='closed').length}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home