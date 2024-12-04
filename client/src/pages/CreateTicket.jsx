import React, { useRef, useState } from "react";
import CustomerHeader from "../components/CustomerHeader";
import { useCreateTicketMutation } from "../redux/api/ticketApi";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateTicket = () => {
  const [ticketInputData, setTicketInputData] = useState({
    title: "",
    tags: "",
    content: "",
  });

  const Navigate = useNavigate();
  const inputFormRef = useRef();
  const [disableButton, setDisableButton] = useState(false);
  const { user } = useSelector((state) => state.userReducer);

  const [createTicket] = useCreateTicketMutation();

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {
      setTicketInputData({ ...ticketInputData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisableButton(true)

    const formData = new FormData();
    formData.append('title', ticketInputData.title);
    formData.append('tags', ticketInputData.tags);
    formData.append('content', ticketInputData.content);
    formData.append('customerId', user._id);

    if(file){
      formData.append('attachments', file);
    }

    const ticketResponse = await createTicket(formData);

    setDisableButton(true);

    if(ticketResponse?.data?.success){
      toast.success(ticketResponse.data.message);
      setDisableButton(false)
      setTicketInputData({
        title: '',
        tags: '',
        content: ''
      })

      if (inputFormRef.current) {
        inputFormRef.current.value = '';
      }

      Navigate('/my-tickets', {replace:true});
    }else{
      toast.error("something went wrong! please try again");
      console.log(ticketResponse);
      setDisableButton(false);
    }
  };

  return (
    <>
      <CustomerHeader />
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Submit a request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              name="title"
              value={ticketInputData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Type of Issue
            </label>
            <select
              name="tags"
              value={ticketInputData.tags}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Account">Account</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="content"
              value={ticketInputData.content}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="attachments"
              className="block text-gray-700 font-bold mb-2"
            >
              Attachments
              <span className="text-sm font-normal ml-2">(Optional)</span>
            </label>
            <input
              type="file"
              id="attachments"
              ref={inputFormRef}
              multiple
              onChange={handleChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <button
              className={`${
                disableButton ? "pointer-events-none opacity-80" : ""} w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              disabled={disableButton}
            >
              {disableButton ? <ClipLoader color="#ffffff" size={20} /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTicket;
