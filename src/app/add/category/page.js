"use client"
import { backendBaseUrl } from '@/app/api/api';
import { error, success } from '@/app/functions/notifyUser';
import { hideLinearBar, showLinearBar } from '@/app/redux/reducers/linearProgressSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';


export default function AddCategory() {
    let [previewSrc, setPreviewSrc] = useState('https://cdn-icons-png.flaticon.com/512/8136/8136031.png');
    const router = useRouter()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hideLinearBar());
    }, [])

    let handlePreview = () => {
        const file = categoryThumbnailInp.files[0];

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
        router.push('/categories');
    }
    // let objectFromFormData = {};
    let handleAddCategorySubmit = (event) => {
        event.preventDefault();
        dispatch(showLinearBar());
        console.log("Add Btn Clicked");
        const formData = new FormData(event.target);
        axios.post(`${backendBaseUrl}/admin/add-category`, formData)
            .then(res => res.data)
            .then(finalRes => {
                // console.log(finalRes);
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
                <h1 className='font-bold text-[22px] mb-[20px]'>Add Category</h1>
                <form className='px-[50px] mb-[100px]' onSubmit={handleAddCategorySubmit}>
                    <div className='flex flex-col gap-[15px]'>
                        <label className='flex flex-col gap-[5px]'>
                            Category Name
                            <input type='text' name='categoryName' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
                        </label>
                        <label className='flex flex-col gap-[5px]'>
                            Category Slug
                            <input type='text' name='categorySlug' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
                        </label>
                        <label className='flex flex-col gap-[5px]'>
                            Category Description
                            <textarea name='categoryDesc' className='border-2 border-gray-500 outline-none px-[10px] py-[4px] resize-none' required />
                        </label>
                        <label className='flex flex-col gap-[5px]'>
                            Category Status
                            <div className='flex gap-[20px] items-center mx-[20px]'>
                                <div><input type='radio' className='outline-none' name='categoryStatus' value='Active' required />  Active</div>
                                <div><input type='radio' className='outline-none' name='categoryStatus' value='Deactive' required />  Deactive</div>
                            </div>
                        </label>

                        <div className='flex flex-col'>
                            Category Thumbnail
                            <input type='file' name='categoryThumbnail' id='categoryThumbnailInp' className='mx-[20px] text-blue-500 w-[250px]' accept=".jpeg,.jpg,.png" onChange={handlePreview} required />
                        </div>
                        <img src={previewSrc} name='categoryTPreview' className='w-[180px] h-[180px] bg-gray-200' />

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
