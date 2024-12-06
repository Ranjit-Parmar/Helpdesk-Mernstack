import React, { useState } from "react";

const Pagination = ({totalDocuments, setPageNumberHandler, itemPerPage}) => {
  
  const [currentPage, setCurrentPage] = useState(1);

  // for previous page
  const prevPage = () => {
    setCurrentPage(currentPage-1);
    setPageNumberHandler(currentPage-1)
  }

  // for Active page
  const setActivePage = (e) => {
    setCurrentPage(e.target.value);
    setPageNumberHandler(e.target.value)
  }
  
  // for next page
  const nextPage = () => {
    setCurrentPage(currentPage+1);
    setPageNumberHandler(currentPage+1)
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalDocuments / itemPerPage);
  
  const previousRemainingButtons = Array.from({length:2},(_,index)=> currentPage - 1 - index ).filter((val)=>val>0).reverse();
  const nextRemainingButtons = Array.from({length:3},(_,index)=> currentPage + index).filter((val)=>val <= totalPages);
  const showPageButtons = [...previousRemainingButtons, ...nextRemainingButtons];
  
  return (
    <>
    <div className={`${totalDocuments===0? 'hidden':'block'}`}>

    <div className="max-w-4xl mx-auto p-6">
    </div>
    <div className="flex w-full gap-1 justify-center">
      <button className={`${currentPage===1?'pointer-events-none bg-gray-400':''} px-4 bg-blue-500 text-white rounded-l-full hover:bg-blue-600`} onClick={prevPage}>Prev</button>
      <ul className="flex gap-1">
        {showPageButtons.map((val, i ) => <li key={i} className={`${val===currentPage? 'bg-blue-900 text-white' : '' } bg-blue-500 p-2 px-4 rounded-md`} value={val} onClick={setActivePage}>{val}</li>
        )}      
      </ul>
      <button className={`${currentPage===totalPages?'pointer-events-none bg-gray-400':''} px-4 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 `} onClick={nextPage}>Next</button>
    </div>
        </div>
        </>
  );
};

export default Pagination;
