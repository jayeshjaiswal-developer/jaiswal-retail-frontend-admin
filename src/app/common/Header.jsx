import { Avatar, LinearProgress } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux'

export default function Header() {
  const isClicked = useSelector((state) => state.linearProgress.isClicked)

  return (
    <div className='bg-black sticky top-0 z-[99]'>
      <div className="mx-auto max-w-[1515px]">
        <div className='flex justify-between items-center py-[5px] px-[10px]'>
          <Image src='/images/jaiswal-retail-hz.png' alt='logo-hz' width={230} height={100} />
          <Avatar src="/broken-image.jpg" className='' />
        </div>
        {isClicked?
          <LinearProgress sx={{ height: 4 }} />
          :
          <div className="bg-black h-[4px]"></div>
        }
      </div>
    </div>
  )
}
