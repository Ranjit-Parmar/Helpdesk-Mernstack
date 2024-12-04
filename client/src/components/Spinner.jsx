import React from 'react';
import { MoonLoader } from 'react-spinners';

const Spinner = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <MoonLoader size={30} />
    </div>
  );
};


export default Spinner;
