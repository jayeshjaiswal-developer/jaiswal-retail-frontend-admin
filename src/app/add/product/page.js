"use client"
import { backendBaseUrl } from '@/app/api/api';
import { error, success } from '@/app/functions/notifyUser';
import { hideLinearBar, showLinearBar } from '@/app/redux/reducers/linearProgressSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

export default function AddProduct() {
  let [previewSrc, setPreviewSrc] = useState('https://cdn-icons-png.flaticon.com/512/8136/8136031.png');
  const router = useRouter()
  const dispatch = useDispatch();
    let [categoryArray, setCategoryArray] = useState([]);
  
  useEffect(() => {
    dispatch(hideLinearBar());
    getCategories();
  }, [])

  function getCategories() {
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

   useEffect(() => {
          console.log(categoryArray);
      }, [categoryArray]);
  

  let handlePreview = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setPreviewSrc(e.target.result);
      }
      reader.readAsDataURL(file);
    }
  }
  let handleCancelBtn = () => {
    dispatch(showLinearBar());
    router.push('/products');
  }
  // let objectFromFormData = {};
  let handleAddProductSubmit = (event) => {
    event.preventDefault();
    dispatch(showLinearBar());
    console.log("Add Btn Clicked");
    const formData = new FormData(event.target);
    axios.post(`${backendBaseUrl}/product/add-product`, formData)
      .then(res => res.data)
      .then(finalRes => {
        console.log(finalRes);
        dispatch(hideLinearBar());
        if (finalRes.status) {
          success(toast, finalRes.message);
        } else {
          error(toast, finalRes.message);
        }
      })
    // formData.forEach((v, i) => {
    //     objectFromFormData[i] = v;
    // })

    // console.log(objectFromFormData);
  }
  return (
    <>
      <div>
        <ToastContainer />
        <h1 className='font-bold text-[22px] mb-[20px]'>Add Product</h1>
        <form className='px-[50px] mb-[100px]' onSubmit={handleAddProductSubmit}>
          <div className='flex flex-col gap-[15px]'>
            <label className='flex flex-col gap-[5px]'>
              Title
              <input type='text' name='title' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
            </label>
            <label className='flex flex-col gap-[5px]'>
              Description
              <textarea name='description' className='border-2 border-gray-500 outline-none px-[10px] py-[4px] resize-none' required />
            </label>


            <div className='flex justify-between'>
              <label className='flex flex-col gap-[5px] basis-[25%]'>
                Mrp
                <input type='text' name='mrp' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
              </label>
              <label className='flex flex-col gap-[5px] basis-[25%]'>
                Discount(%)
                <input type='text' name='discountPercentage' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
              </label>
              <label className='flex flex-col gap-[5px] basis-[25%]'>
                Brand
                <input type='text' name='brand' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
              </label>

            </div>

            <div className='flex justify-between'>
              <label className='flex flex-col gap-[5px] basis-[25%]'>
                Warranty Information
                <input type='text' name='warrantyInformation' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
              </label>

              <label className='flex flex-col gap-[5px] basis-[25%]'>
                Shipping Information
                <input type='text' name='shippingInformation' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
              </label>

              <label className='flex flex-col gap-[5px] basis-[25%]'>
                Category
                <select name='category' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required>
                <option>---Select---</option>
                {categoryArray.map((v,i)=><option value={v._id} key={i}>{v.categoryName}</option>)}    
                </select>
              </label>
            </div>

            <label className='flex flex-col gap-[5px]'>
              Status
              <div className='flex gap-[20px] items-center mx-[20px]'>
                <div><input type='radio' className='outline-none' name='availabilityStatus' value='In Stock' required />  In Stock</div>
                <div><input type='radio' className='outline-none' name='availabilityStatus' value='Out Of Stock' required />  Out Of Stock</div>
              </div>
            </label>

            <div className='flex justify-between'>

              <div>
                <div className='flex flex-col'>
                  Thumbnail
                  <input type='file' name='productThumbnail' className='mx-[20px] text-blue-500 w-[250px]' accept=".jpeg,.jpg,.png" onChange={handlePreview} required />
                </div>
                <img src={previewSrc} name='productTPreview' className='w-[180px] h-[180px] bg-gray-200' />
              </div>

              <div className='flex flex-col items-start gap-[10px]'>
                <AddImage index={1} />
                <AddImage index={2} />
                <AddImage index={3} />
              </div>

              <div className='flex flex-col items-start gap-[10px]'>
                <AddImage index={4} />
                <AddImage index={5} />
                <AddImage index={6} />
              </div>

            </div>



          </div>
          <div className='flex gap-[20px] justify-end items-center'>
            <button type='button' onClick={handleCancelBtn} className='cursor-pointer border-2 border-gray-400 text-gray-400 w-[120px] py-[4px]'>Cancel</button>
            <button className='bg-blue-500 text-white w-[120px] py-[4px] cursor-pointer'>Add</button>
          </div>
        </form>
      </div>
    </>
  )
}

function AddImage({ index }) {
  let [miniPreviewSrc, setMiniPreviewSrc] = useState('https://cdn-icons-png.flaticon.com/512/8136/8136031.png');
  let handlePreview = (e) => {
    // console.log(e);
    // console.log(e.target.files);
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setMiniPreviewSrc(e.target.result);
      }
      reader.readAsDataURL(file);
    }
  }
  return (
    <div className='flex gap-[12px]'>
      <img src={miniPreviewSrc} name='miniImagesPreview' className='w-[60px] h-[60px] bg-gray-200' />
      <div className='flex flex-col text-[13px]'>
        Image {index}
        <input type='file' name={`miniImageInp${index}`} className='text-blue-500 w-[250px]' accept=".jpeg,.jpg,.png" onChange={handlePreview} required/>
      </div>
    </div>
  )
}