"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { hideLinearBar } from '../redux/reducers/linearProgressSlice';
import axios from 'axios';
import { backendBaseUrl } from '../api/api';
import { Skeleton } from '@mui/material';


export default function Transactions() {
  const dispatch = useDispatch();
  let [transactionsArray, setTransactionsArray] = useState();


  useEffect(() => {
    dispatch(hideLinearBar());
    fetchTransactions();
  }, [])

  let fetchTransactions = () => {
    console.log('i am fetch transactions function');
    axios.get(`${backendBaseUrl}/order/view-transactions`)
      .then(res => res.data)
      .then(finalRes => {
        console.log(finalRes.message);
        console.log(finalRes.data);
        setTransactionsArray(finalRes.data.reverse());
      }).catch((error) => {
        console.log(error);
        console.log("something went xrong in frontend");
      })
  }



  return (
    <>
      <div>
      <h1 className='font-bold text-[22px] mb-[20px]'>Transactions</h1>
        {transactionsArray ?
          <table className='w-full text-center'>
            <thead className='bg-gray-200'>
              <tr>
                <th className=' py-[8px]'>Order ID</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionsArray.map((v, i) => <TransactionRow prop={v} index={i} key={i} />)}
              {/* {transactionsArray.map((v, i) => )} */}
            </tbody>
          </table>
          :
          <>
            {Array.from({ length: 4 }).map((_, i) => <Skeleton variant="rectangular" height={40} key={i} className='my-[20px]' />)}
          </>
        }
      </div>
    </>
  )
}

function TransactionRow({ prop }) {
  let DateObj = new Date(prop?.createdAt);
  let date = DateObj.toDateString();
  let time = DateObj.toTimeString().split(" ")[0];
  return (
    <tr className='bg-gray-50 border-y-2 border-y-gray-400'>
      <td className=' py-[10px]'>{prop.orderId}</td>
      <td className=' py-[10px] text-blue-500'>{prop.transactionDetails.razorpay_payment_id}</td>
      <td>&#8377; {prop.finalAmtToPay}</td>
      <td>{date} {time}</td>
      <td>
        { prop.isTransactionValid ?
          <h1 className='bg-green-500 text-white rounded-[15px] w-[100px] mx-auto'>Paid</h1>
          :
          <h1 className='bg-red-500 text-white rounded-[15px] w-[100px] mx-auto'>Failed</h1>
        }
        {/* <h1 className='bg-yellow-400 text-white rounded-[15px] w-[100px] mx-auto'>Pending</h1> */}
      </td>

    </tr>
  )
}


