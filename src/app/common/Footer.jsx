import React from 'react'
import { FaHeart } from "react-icons/fa";


export default function Footer() {
  return (
    <div className=''>
        <div className='bg-[rgba(247,246,254,255)] flex justify-between items-center h-[60px] px-[20px] text-gray-500 text-[15px]'>
            <h1>Copyright @ 2025, <span className='text-blue-500'>Jaiswal Retail Pvt. Ltd., Indore</span>. All rights reserved.</h1>
            <h2 className='flex justify-center items-center gap-[5px]'>Hand-crafted & made with <FaHeart className='text-red-500' /></h2>
        </div>

    </div>
  )
}
