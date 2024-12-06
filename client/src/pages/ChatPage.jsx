import Messages from "../components/Messages";
import { Link, useParams } from "react-router-dom";
import { useGetSingleTicketQuery } from "../redux/api/ticketApi";
import Loader from "../components/Loader";

const ChatPage = () => {
  const { id } = useParams();
  const { data: ticketData, isLoading: ticketIsLoading, isError: ticketIsError } = useGetSingleTicketQuery(id);

  // Error handling if the query fails
  if (ticketIsError) {
    return <div>Error fetching messages. Please try again later.</div>;
  }

  return ticketIsLoading ? (
    <Loader/>
  ) : (
    <div className="min-h-screen flex flex-col w-full md:w-3/4 lg:w-2/4 mx-auto bg-white shadow-lg rounded-lg">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl">Chat</h1>
        <Link to="/my-tickets" className="underline">Back</Link>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {ticketData?.ticket?.notes ?.filter((val) => val.note !== undefined || val.attachments.length > 0).map((msg, i) => (
            <Messages
              key={i}
              sender={msg.author.role}
              note={msg.note}
              attachments={msg.attachments}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
