import React, { useRef, useState } from "react";
import ProfileIcon from "../assets/profile-icon.png";
import { useAddAssigneeToTicketMutation, useAddNotesToTicketMutation, useGetSingleTicketQuery, useUpdateTicketStatusMutation } from "../redux/api/ticketApi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../redux/api/userApi";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Loader from "../components/Loader";

const AddNote = () => {

  const inputFormRef = useRef();
  const {id} = useParams();
  const { data:ticketData, isLoading:ticketIsLoading, isError:ticketIsError } = useGetSingleTicketQuery(id);
  const [updateTicketStatus] = useUpdateTicketStatusMutation();
  const { data:userData, isLoading:userIsLoading, isError:userIsError } = useGetAllUsersQuery('agent');
  const [ addAssigneeToTicket ] = useAddAssigneeToTicketMutation();
  const [addNotesToTicket] = useAddNotesToTicketMutation();
  
  const {user} = useSelector((state)=>state.userReducer);

  
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [disableOption, setDisableOption] = useState(false);
  const [disableStatusOption, setDisableStatusOption] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);


 
  const handleNoteChange = (value) => {
    setNote(value);
  };
  
  const handleFileChange = (e) => {
    setAttachments(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    setDisableSubmit(true);
    e.preventDefault();

   if(!note && !attachments){
    toast.error("Please enter value before submit");
    setDisableSubmit(false);
    return;
   }
   
   const formData = new FormData();
   formData.append('content', note);
   formData.append('attachments', attachments);
  
   const addNotResponse = await addNotesToTicket({id:id, noteData:formData})

   if(addNotResponse?.data?.success){
    toast.success(addNotResponse.data.message);
    setDisableSubmit(false);
    setNote('')
    if (inputFormRef.current) {
      inputFormRef.current.value = '';
    }
   }else{
    toast.error("something went wrong! please try again");
    setDisableSubmit(false);
     console.log(addNotResponse);
   }
    
  }

  const selectAssigneeHandler = async(e) => {

  setDisableOption(true);
  const userId = e.target.value
  const assignedTicketResponse = await addAssigneeToTicket({id:id, userId:userId});

  if(assignedTicketResponse?.data?.success){

    toast.success(assignedTicketResponse?.data?.message)
    setDisableOption(false);
  }else{

    toast.error("something went wrong! please try again");
    setDisableOption(false);
    console.log(assignedTicketResponse);

  };
  
  };


  const changeTicketStatusHandler = async (e) => {

    setDisableStatusOption(true);
    const status = e.target.value
    const updateTicketStatusResponse = await updateTicketStatus({id:id,status:status});

    if(updateTicketStatusResponse?.data?.success){

      toast.success(updateTicketStatusResponse?.data?.message)
      setDisableStatusOption(false);
    }else{
  
      toast.error("something went wrong! please try again");
      setDisableStatusOption(false);
      console.log(updateTicketStatusResponse);
  
    };

  }



  return (
    ticketIsLoading? <Loader/>:
    <form className="min-h-screen w-full bg-white p-4 md:p-8 rounded-lg shadow-lg" onSubmit={submitHandler}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">
          Add Note to Ticket
          <span className="text-red-700 font-bold text-sm pl-2">{ticketData?.ticket?.status}</span>
        </h2>
        <p className="text-gray-700">
          Assign to:
          <span className="text-blue-600">{`<${ticketData?.ticket?.assignee?.email || 'Not assigned yet'} >`}</span>
        </p>
        <p className="text-gray-700">
          Tag:
          <span className="text-blue-600 ml-1">{ticketData?.ticket?.tags}</span>
        </p>
      </div>
      <div className="w-full">
        <div className="flex flex-wrap md:flex-nowrap mb-4">
          <div className="md:w-3/5 w-full border font-bold  md:text-xl  bg-gray-100 p-2 rounded">
            # {ticketData?.ticket?.title}
          </div>
          <div className="flex w-full border bg-gray-100 rounded p-2">
            <div className="flex flex-1 w-1/2 md:w-auto items-center">
              <img
                src={ProfileIcon}
                className="md:w-16 w-12 h-12 p-1 rounded-full"
                alt="Profile Icon"
              />
              <div className="flex flex-col text-sm justify-center items-start pl-2">
                <span className="font-semibold text-gray-800">
                  {ticketData?.ticket?.customerId?.username}
                </span>
                <span className="text-sm font-bold text-gray-500">
                  Requester
                </span>
              </div>
            </div>
            
            <select className={`${user.role === 'admin'? 'block' : 'hidden'} p-2 flex-1 border border-gray-300 rounded w-full md:w-auto ml-2`} disabled={disableOption} onChange={selectAssigneeHandler}>
              <option value="">Select Assignee</option>
              {!userIsLoading && userData?.getAllAgent?.map((val, i)=><option key={i} value={val._id}>{val.username}</option>)}
            </select>
          </div>
        </div>

        <div className="md:mt-0">
          <textarea
            className="px-4 py-2 h-56 focus:outline-none w-full resize-none border border-gray-300 rounded mb-4"
            placeholder="Add Notes"
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="mb-4 gap-2 md:flex justify-center items-center border">
      <div className="flex-1">
        <label
          htmlFor="attachments"
          className="block text-gray-700 font-bold mb-2"
        >
          Attachments
        </label>
        <input
          type="file"
          id="attachments"
          multiple
          onChange={handleFileChange}
          ref={inputFormRef}
          className="block w-full h-10 text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
        />
      </div>
      <div className="flex-1">
      <label
          htmlFor="Status"
          className="block text-gray-700 font-bold mb-2"
        >
          Status
        </label>
        <select id="Status" className="block w-full h-10 text-sm border border-gray-300 rounded cursor-pointer" disabled={disableStatusOption} onChange={changeTicketStatusHandler}>
          <option value="">Action</option>
          <option value="pending" className="text-yellow-500">Pending</option>
          <option value="closed" className="text-red-500">Close</option>
        </select>
      </div>
      </div>
      <button className={`${disableSubmit?'opacity-80 pointer-events-none' : ' '} ${ticketData?.ticket?.status==='closed'? 'hidden' : 'block'} w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition-colors`}>
      {disableSubmit ? <ClipLoader color="#ffffff" size={20} /> : "Submit Note"}
      </button>
    </form>
  );
};

export default AddNote;
