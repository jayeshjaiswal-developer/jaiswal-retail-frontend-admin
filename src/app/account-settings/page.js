"use client"
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { hideLinearBar } from '../redux/reducers/linearProgressSlice';

export default function AccountSetting() {
    const dispatch = useDispatch();
     useEffect(()=>{
            dispatch(hideLinearBar());
        },[dispatch])
  return (
    <>Account settings</>
  )
}
