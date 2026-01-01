"use client"
import React, { useEffect } from 'react'
import BasicDemo from '../prime-react-Components/BasicDemo'
import DoughnutChartDemo from '../prime-react-Components/DoughnutChartDemo'
import VerticalBarDemo from '../prime-react-Components/VerticalBarDemo'
import { TiShoppingCart } from "react-icons/ti";
import { FaBoxOpen } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { useDispatch } from 'react-redux'
import { hideLinearBar } from '../redux/reducers/linearProgressSlice';





export default function Dashboard() {
    const dispatch = useDispatch();
     useEffect(()=>{
            dispatch(hideLinearBar());
        },[])

        
    let dashboardCardsData = [
        { "count": 1558876, "label": "Total orders", "icon": <TiShoppingCart />, "cardColor": "rgba(255,0,0,255)" },
        { "count": 1558876, "label": "Processing", "icon": <FaBoxOpen />, "cardColor": "rgba(255,196,0,255)" },
        { "count": 1558876, "label": "Shipped", "icon": <FaBoxes />, "cardColor": "rgba(0,210,71,255)" },
        { "count": 1558876, "label": "Delivered", "icon": <TbTruckDelivery />, "cardColor": "rgba(38,105,255,255)" }
    ];
    return (
        <>
            <div className='grid grid-cols-4 gap-[50px]'>
                            {dashboardCardsData.map((v, i) => <DashboardCards prop={v} key={i} />)}


                        </div>
                        <div className="grid grid-cols-3 gap-[40px] mt-[40px]">
                            <div className="col-span-2">
                                <BasicDemo />

                            </div>
                            <div className=''>
                                <DoughnutChartDemo />
                            </div>

                        </div>
                        <div className="grid grid-cols-3 mt-[40px] gap-[50px]">
                            <div className="">
                                <VerticalBarDemo />
                            </div>
                            <div className=''>
                                <VerticalBarDemo />
                            </div>
                            <div className=''>
                                <VerticalBarDemo />
                            </div>

                        </div>
        </>
    )
}



function DashboardCards({ prop }) {

    return (
        <div>
            <div className={`p-[20px]  text-white`} style={{ backgroundColor: prop.cardColor }}>
                <div className='grid grid-cols-3 gap-[5px]'>
                    <div className='col-span-2 flex flex-col gap-[5px] justify-center '>
                        <h1 className='text-[30px] font-bold'>{prop.count}</h1>
                        <h2 className='text-[18px]'>{prop.label}</h2>
                    </div>
                    <div className='flex justify-center items-center text-[80px]'>
                        {prop.icon}

                    </div>

                </div>


            </div>
        </div>
    )
}

