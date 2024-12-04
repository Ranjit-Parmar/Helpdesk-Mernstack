import React from 'react'
import { BeatLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <BeatLoader />
    </div>
  )
}

export default Loader