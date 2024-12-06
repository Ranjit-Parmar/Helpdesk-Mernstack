import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Messages = ({ sender, note, attachments }) => {
  const { user } = useSelector((state) => state.userReducer);

  return user.role === 'customer' ? (
    <div className={`flex ${sender === "agent" || sender === "admin" ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-xs md:max-w-xl xl:max-w-xl p-2 rounded-lg shadow-md ${sender === "agent" || sender === "admin" ? "bg-gray-200" : "bg-blue-200 text-gray-800"}`}>
        <p className="break-words">{note}</p>
        {attachments.length ? (
          <Link to={attachments[0]} className="underline">
            <p className="break-words">{attachments[0]}</p>
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  ) : (
    <div className={`flex ${sender === "agent" || sender === "admin" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs md:max-w-xl xl:max-w-xl p-2 rounded-lg shadow-md ${sender === "agent" || sender === "admin" ? "bg-blue-200" : "bg-gray-200 text-gray-800"}`}>
        <p className="break-words">{note}</p>
        {attachments.length ? (
          <Link to={attachments[0]} className="underline">
            <p className="break-words">{attachments[0]}</p>
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Messages;
