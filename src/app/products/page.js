"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { hideLinearBar, showLinearBar } from '../redux/reducers/linearProgressSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { backendBaseUrl } from '../api/api';
import { error, success } from '../functions/notifyUser';
import { toast, ToastContainer } from 'react-toastify';


export default function Products() {
  const router = useRouter();
  const dispatch = useDispatch();
  let [productArray, setProductArray] = useState([]);


  useEffect(() => {
    dispatch(hideLinearBar());
    getProducts();
  }, [])

  function getProducts() {
    axios.get(`${backendBaseUrl}/product/view-product`)
      .then(res => res.data)
      .then(finalRes => {
        console.log(finalRes.message);
        setProductArray(finalRes.data);
      }).catch((error) => {
        console.log(error);
        console.log("something went xrong in frontend");
      })
  }

  let handleAddCategoryBtn = () => {
    dispatch(showLinearBar());
    router.push('/add/product');
  }



  return (
    <>
      <div>
        <ToastContainer />
        <div className='flex justify-between items-center mb-[20px]'>
        <h1 className='font-bold text-[22px] mb-[20px]'>Products</h1>
          <button className='bg-black text-white py-[4px] rounded-[15px] px-[10px] cursor-pointer' onClick={handleAddCategoryBtn}>+Add Product</button>
        </div>
        <table className='w-full text-center'>
          <thead className='bg-gray-200'>
            <tr>
              <th className=' py-[8px]'>Id</th>
              <th>Product Name</th>
              <th>Thumbnail</th>
              <th>Price</th>
              <th>Discount Percent</th>
              <th>Category</th>
              {/* <th className='w-[300px] text-[13px]'>Description</th> */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productArray.length != 0
              ?
              productArray.map((v, i) => <ProductRow prop={v} index={i} key={i} getProductsFunction={getProducts} />)
              :
              <tr><td colSpan={8} className='text-center py-[100px]'>No products found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

function ProductRow({ prop, index, getProductsFunction }) {
  const dispatch = useDispatch();
  const router = useRouter();

  let handleProductDelete = () => {
    dispatch(showLinearBar());
    console.log("delete button clicked");
    // console.log(prop._id);
    axios.post(`${backendBaseUrl}/product/delete-product`, { id: prop._id })
      .then(res => res.data)
      .then(finalRes => {
        dispatch(hideLinearBar());
        if (finalRes.status) {
          success(toast, finalRes.message);
          getProductsFunction();
        } else {
          error(toast, finalRes.message);
        }
      })
  }

  let handleProductViewEdit = () => {
    dispatch(showLinearBar());
    router.push(`/view-edit/product/${prop._id}`);
  }

  return (
    <tr className='bg-gray-50 border-y-2 border-y-gray-400'>
      <td className=' py-[10px]'>{index + 1}</td>
      <td className=' py-[10px]'>{prop.title}</td>
      <td className='flex justify-center'><img src={prop.thumbnail.startsWith("http") ? `${prop.thumbnail}` : `${backendBaseUrl}/uploads/${prop.thumbnail}`} className='w-[80px] h-[80px] my-[20px]' /></td>
      <td>{Math.floor(prop.mrp)}</td>
      <td>{prop.discountPercentage}%</td>
      <td>{prop.category.categoryName}</td>
      <td>{prop.availabilityStatus ? 'In Stock' : 'Out Of Stock'}</td>
      <td>
        <div className='flex flex-col gap-[10px] justify-center items-center'>
          <button className='bg-blue-500 text-white py-[3px] text-[13px] w-[80px] cursor-pointer' onClick={handleProductViewEdit}>View/Edit</button>
          <button className='bg-red-500 text-white py-[3px] text-[13px] w-[80px] cursor-pointer' onClick={handleProductDelete}>Delete</button>
        </div>
      </td>
    </tr>
  )
}



