"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { hideLinearBar } from '../redux/reducers/linearProgressSlice';
import { backendBaseUrl } from '../api/api';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { inform, error } from '../functions/notifyUser';

export default function Orders() {
  const dispatch = useDispatch();

  let [ordersArray, setOrdersArray] = useState();

  useEffect(() => {
    dispatch(hideLinearBar());
    fetchOrders();
  }, [])

  let fetchOrders = () => {
    console.log('i am fetch orders function');
    axios.get(`${backendBaseUrl}/order/view-order`)
      .then(res => res.data)
      .then(finalRes => {
        console.log(finalRes.message);
        console.log(finalRes.data);
        setOrdersArray(finalRes.data.reverse());
      }).catch((error) => {
        console.log(error);
        console.log("something went xrong in frontend");
      })
  }




  return (
    <>
      <div>
      <h1 className='font-bold text-[22px] mb-[20px]'>Orders</h1>

        {
          ordersArray ?
            <>
              <ToastContainer />

              <table className='w-full text-center'>

                <thead className='bg-gray-200'>
                  <tr>
                    <th className=' py-[8px]'>Order ID</th>
                    <th>Product Details</th>
                    <th>Shipping Details</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {ordersArray.map((v, i) => <OrderRow prop={v} index={i} key={i} fetchOrders={fetchOrders} />)}
                </tbody>
              </table>
            </>
            :
            <>
              {Array.from({ length: 4 }).map((_, i) => <Skeleton variant="rectangular" height={150} key={i} className='my-[20px]' />)}
            </>
        }
      </div>
    </>
  )
}

function OrderRow({ prop, fetchOrders }) {
  let [statusChanged, setStatusChanged] = useState(false);
  let handleStatusChange = () => {
    setStatusChanged(true);
    console.log('status changed');
  }

  let shippingDetails = prop?.shippingDetails;
  let dateObj = new Date(prop?.createdAt);
  let date = dateObj.toDateString();
  let time = dateObj.toTimeString().split(" ")[0];

  let handleOrderUpdate = (orderId) => {
    console.log("Update btn clicked");
    // console.log(orderId);
    // console.log(document.querySelector(`#orderStatus${orderId}`).value);
    let status = document.querySelector(`#orderStatus${orderId}`).value;
    UpdateOrderStatus(orderId, status);

  }

  let handleOrderCancel = (orderId) => {
    // console.log(orderId);
    console.log("Cancel order clicked");
    UpdateOrderStatus(orderId, 5);
  }

  function UpdateOrderStatus(orderId, status) {
    // console.log('')
    axios.get(`${backendBaseUrl}/order/update-shipment-status/${orderId}/${status}`)
      .then(res => res.data)
      .then(finalRes => {
        console.log(finalRes.message);
        fetchOrders();
        // setOrderDetails(finalRes.data);
        inform(toast, <h1>Order status updated</h1>);
        setStatusChanged(false);
      }).catch((error) => {
        console.log(error);
        console.log("something went xrong in frontend");
        error(toast, <h1>Order status updated</h1>);


      })
  }

  return (
    <tr className='bg-gray-50 border-y-2 border-y-gray-400'>
      <td className=' py-[10px]'>{prop.orderId}</td>
      <td>
        <div className='my-[20px]'>
          {
            prop.cart.map((v, i) => <OrderItem prop={v} key={i} index={i} />)
          }
        </div>
      </td>
      <td>
        {/* <div className='border-2 border-red-500'>hello</div> */}
        <div className='text-left w-[80%] mx-auto my-[10px]'>
          <div>
            <h1>{shippingDetails.name}</h1>
            <h1>{shippingDetails.phone}</h1>
            <h1>{shippingDetails.email}</h1>
          </div>
          <br />
          <div>
            <h1>{shippingDetails.flatHouseNo}, {shippingDetails.areaStreet},</h1>
            <h1>({shippingDetails.landmark}) {shippingDetails.pincode}</h1>
            <h1>{shippingDetails.city}, {shippingDetails.state}</h1>
            <h1>{shippingDetails.country}</h1>
          </div>
        </div>
      </td>
      <td><h1>{date}</h1><h1>{time}</h1></td>
      <td>
        &#8377; {prop.finalAmtToPay}
        {prop.isPaymentModeOnline ?
          <h1 className='bg-green-500 text-white rounded-[20px] text-[11px] w-[50px] mx-auto'>Prepaid</h1>
          :
          <h1 className='bg-yellow-500 text-white rounded-[20px] text-[11px] w-[50px] mx-auto'>COD</h1>
        }


      </td>
      <td colSpan={prop.shipmentStatus == 5 ? 2: 1} className={`${prop.shipmentStatus == 5 ? '': ''}`} >
        {
          prop.shipmentStatus == 5 ?
            <h1 className='flex justify-end items-center'><img src='/images/cancelled.png' className='w-[120px]' /></h1>
            :
            <select id={`orderStatus${prop.orderId}`} className={`outline-none px-[10px] py-[3px]`} onChange={handleStatusChange}>
              <option value={prop.shipmentStatus}>{getOrderStatus(prop.shipmentStatus)}</option>
              {Array.from({ length: 6 }).map((_, i) => i != prop.shipmentStatus ? <option value={i} key={i} index={i}>{getOrderStatus(i)}</option> : null)}
            </select>
        }

      </td>

      {
        prop.shipmentStatus == 5 ?
          null :
          <td>
            <div className='flex flex-col gap-[10px] justify-center items-center'>
              <>
                <button onClick={() => handleOrderUpdate(prop.orderId)} disabled={!statusChanged} className={`${statusChanged ? 'bg-blue-500 cursor-pointer' : 'bg-blue-200'} text-white py-[3px] text-[13px] w-[80px] `}>Update</button>
                <button onClick={() => handleOrderCancel(prop.orderId)} className='bg-red-500 text-white py-[3px] text-[13px] w-[80px] cursor-pointer'>Cancel</button>
              </>

            </div>
          </td>
      }
    </tr>
  )
}

function OrderItem({ prop }) {
  return (
    <div className='border-b-2 border-b-gray-300 w-[90%] mx-auto my-[5px]'>
      <div className='flex items-center gap-[20px]'>
        <div>
          <img src={prop.thumbnail.startsWith("http") ? `${prop.thumbnail}` : `${backendBaseUrl}/uploads/${prop.thumbnail}`} className='w-[80px] h-[80px]' />
        </div>
        <div className='text-left text-[13px]'>
          <h1 className='text-[15px]'>{prop.title}</h1>
          <h2>Mrp:&#8377;{Math.floor(prop.mrp)}</h2>
          <h2>Order price:&#8377;{Math.floor(prop.mrp - (prop.mrp * prop.discountPercentage / 100))}</h2>
          <h2>Qty:{prop.qty}</h2>
        </div>
      </div>
    </div>
  )
}



function getOrderStatus(statusCode) {
  const statusEnum = {
    0: "Pending",
    1: "Prepare To Ship",
    2: "Shipped",
    3: "Out for Delivery",
    4: "Delivered",
    5: "Cancelled"
  };
  return statusEnum[statusCode] || "Invalid Status";
}