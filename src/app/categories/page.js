"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { hideLinearBar, showLinearBar } from '../redux/reducers/linearProgressSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { backendBaseUrl } from '../api/api';
import { error, success } from '../functions/notifyUser';
import { toast, ToastContainer } from 'react-toastify';



export default function Categories() {
  const dispatch = useDispatch();
  let [categoryArray, setCategoryArray] = useState([]);
  useEffect(() => {
    dispatch(hideLinearBar());
    getCategories();
  }, [])
  const router = useRouter();

  function getCategories(){
    axios.get(`${backendBaseUrl}/admin/view-category`)
      .then(res => res.data)
      .then(finalRes => {
        console.log(finalRes.message);
        setCategoryArray(finalRes.data);
      }).catch((error) => {
        console.log(error);
        console.log("something went xrong in frontend");
      })
  }

  let handleAddCategoryBtn = () => {
    dispatch(showLinearBar());
    router.push('/add/category');
  }



  return (
    <>
      <div>
      <ToastContainer />
        <div className='flex justify-between items-center mb-[20px]'>
        <h1 className='font-bold text-[22px] mb-[20px]'>Categories</h1>
          <button className='bg-black text-white py-[4px] rounded-[15px] px-[10px] cursor-pointer' onClick={handleAddCategoryBtn}>+Add Category</button>
        </div>
        <table className='w-full text-center'>
          <thead className='bg-gray-200'>
            <tr>
              <th className=' py-[8px]'>Id</th>
              <th>Category Name</th>
              <th>Thumbnail</th>
              <th>Slug</th>
              <th className='w-[300px]'>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoryArray.length != 0
              ?
              categoryArray.map((v, i) => <CategoryRow prop={v} index={i} key={i} getCategoryFunction={getCategories} />)
              :
              <tr><td colSpan={6} className='text-center py-[100px]'>No categories found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

function CategoryRow({ prop, index, getCategoryFunction }) {
  const dispatch = useDispatch();
  const router = useRouter();


  let handleCategoryDelete = () => {
    dispatch(showLinearBar());
    console.log("delete button clicked");
    // console.log(prop._id);
    axios.post(`${backendBaseUrl}/admin/delete-category`,{id:prop._id})
      .then(res => res.data)
      .then(finalRes=>{
        dispatch(hideLinearBar());
        if (finalRes.status) {
          success(toast, finalRes.message);
          getCategoryFunction();
        } else {
          error(toast, finalRes.message);
        }
      })
  }

  let handleCategoryViewEdit=()=>{
    dispatch(showLinearBar());
    router.push(`/view-edit/category/${prop._id}`);
  }
  return (
    <tr className='bg-gray-50 border-y-2 border-y-gray-400'>
      <td className=' py-[10px]'>{index + 1}</td>
      <td className=' py-[10px]'>{prop.categoryName}</td>
      <td className='flex justify-center'><img src={`${backendBaseUrl}/uploads/${prop.thumbnailFilename}`} className='w-[80px] h-[80px] my-[20px]' /></td>
      <td>{prop.categorySlug}</td>
      <td>
        <h1 className='my-[10px] text-justify'>{prop.categoryDesc}</h1>
      </td>
      <td>{prop.categoryStatus?'Active':'Deactive'}</td>
      <td>
        <div className='flex flex-col gap-[10px] justify-center items-center'>
          <button className='bg-blue-500 text-white py-[3px] text-[13px] w-[80px] cursor-pointer' onClick={handleCategoryViewEdit} >View/Edit</button>
          <button className='bg-red-500 text-white py-[3px] text-[13px] w-[80px] cursor-pointer' onClick={handleCategoryDelete}>Delete</button>
        </div>
      </td>

    </tr>
  )
}


