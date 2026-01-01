"use client"
import React, { useState } from 'react'
import Header from './common/Header'


import { MdDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { GiShoppingCart } from "react-icons/gi";
import { MdCategory } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Footer from './common/Footer';
import { useSelector, useDispatch } from 'react-redux'
import { showLinearBar, hideLinearBar, updateSideMenuClicked } from './redux/reducers/linearProgressSlice';
import Login from './auth/Login';

export default function AdminLayout(props) {
    const isClicked = useSelector((state) => state.linearProgress.isClicked)
    const dispatch = useDispatch()
    // console.log("hello");
    // console.log(isClicked);
    const user = useSelector((state) => state.user.token);


    return (
        <div>
            {
                user ?
                    <>
                        <Header />
                        <div className='mx-auto max-w-[1515px]'>
                            <div className='grid grid-cols-6  border-2 border-black'>
                                <div className='bg-[rgba(51,51,51,255)] text-white '>
                                    <div className='sticky top-[60px]'>
                                        <SideBar />
                                    </div>
                                </div>
                                <div className='col-span-5' >
                                    <div className='p-[20px]  min-h-[640px]'>
                                        {/* Place your main content here */}
                                        {props.children}
                                        {isClicked}

                                    </div>
                                    <Footer />

                                </div>
                            </div>

                        </div>
                    </>
                    :
                    <Login />
            }
        </div>
    )
}


function SideBar() {



    let sideMenusArray = [
        { 'icon': <MdDashboard />, 'label': 'Dashboard', 'link': '/dashboard' },
        { 'icon': <GiShoppingCart />, 'label': 'Orders', 'link': '/orders' },
        { 'icon': <GrTransaction />, 'label': 'Transactions', 'link': '/transactions' },
        { 'icon': <MdCategory />, 'label': 'Categories', 'link': '/categories' },
        { 'icon': <AiFillProduct />, 'label': 'Products', 'link': '/products' },
        { 'icon': <IoSettings />, 'label': 'Account Settings', 'link': '/account-settings' },
    ]

    return (
        <div className='pt-[2px]'>
            <ul className=''>
                {sideMenusArray.map((v, i) => <SideBarMenus v={v} i={i} key={i} />)}
            </ul>
        </div>
    )
}

function SideBarMenus({ v, i }) {
    const dispatch = useDispatch()
    const router = useRouter();

    const isSideMenuClicked = useSelector((state) => state.linearProgress.isSideMenuClicked);
    const isClicked = useSelector((state) => state.linearProgress.isClicked)

    let handleMenuClick = (v, i) => {
        if (isSideMenuClicked != i) {
            dispatch(showLinearBar());
        }
        // dispatch(showLinearBar());
        dispatch(updateSideMenuClicked(i));

        console.log(i);
        router.push(`${v.link}`);

    }

    return (
        <li onClick={() => handleMenuClick(v, i)} className={`${isSideMenuClicked == i ? 'bg-red-500' : ''} px-[10px] py-[5px] cursor-pointer my-[10px] flex gap-[10px] items-center ${isSideMenuClicked == i ? 'hover:bg-red-500' : 'hover:bg-red-400'}`} key={i}>{v.icon}{v.label}</li>
    )
}