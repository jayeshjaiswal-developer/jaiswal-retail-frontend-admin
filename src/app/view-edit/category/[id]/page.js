"use client"
import { backendBaseUrl } from '@/app/api/api';
import { error, success } from '@/app/functions/notifyUser';
import { hideLinearBar, showLinearBar } from '@/app/redux/reducers/linearProgressSlice';
import { Skeleton } from '@mui/material';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

export default function ViewEditCategory() {
    const router = useRouter()
    const dispatch = useDispatch();
    const { id } = useParams();
    // console.log("id is: " + id);
    let [category, setCategory] = useState({});
    let [previewSrc, setPreviewSrc] = useState('https://cdn-icons-png.flaticon.com/512/8136/8136031.png');
    let [isEdited, setIsEdited] = useState(false);
    let [trackEdit, setTrackEdit] = useState({});

    useEffect(() => {
        dispatch(hideLinearBar());
        axios.get(`${backendBaseUrl}/admin/view-category/${id}`)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes.message);
                console.log(finalRes);
                setCategory(finalRes.data);
                setTrackEdit(finalRes.data);
            }).catch((error) => {
                console.log(error);
                console.log("something went xrong in frontend");
            })
    }, [])

    useEffect(() => {
        console.log(category);
        if(Object.keys(category).length != 0 && !categoryThumbnailInp.files.length){
            setPreviewSrc(`${backendBaseUrl}/uploads/${category.thumbnailFilename}`);
        }
        CheckEditStatus();
    }, [category]);

    function CheckEditStatus() {
        if (category.categoryName != trackEdit.categoryName
            || category.categorySlug != trackEdit.categorySlug
            || category.categoryDesc != trackEdit.categoryDesc
            || category.categoryStatus != trackEdit.categoryStatus
            || (Object.keys(category).length != 0 && categoryThumbnailInp.files.length > 0)
        ) {
            setIsEdited(true);
        } else {
            setIsEdited(false);
        }
    }

    let handlePreview = () => {
        const file = categoryThumbnailInp.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                setPreviewSrc(e.target.result);
            }
            reader.readAsDataURL(file);
        }
        console.log("file change detected");
        // console.log(categoryThumbnailInp.files.length);
        if (!categoryThumbnailInp.files.length) {
            setPreviewSrc(`${backendBaseUrl}/uploads/${category.thumbnailFilename}`);
        }
        CheckEditStatus();

    }
    let handleCancelBtn = () => {
        dispatch(showLinearBar());
        router.push('/categories');
    }

    let handleEditCategory = (event) => {
        event.preventDefault();
        dispatch(showLinearBar());
        console.log("Edit Btn Clicked");
        const formData = new FormData(event.target);
        axios.post(`${backendBaseUrl}/admin/edit-category/${id}`, formData)
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
    }
    let handleChange = (e) => {
        console.log("change detected");
        let temp = { ...category };
        // console.log(e.target.name);
        if (e.target.name == 'categoryStatus') {
            if (e.target.value == 'Active') {
                temp[e.target.name] = true;
            } else {
                temp[e.target.name] = false;
            }
        } else {
            temp[e.target.name] = e.target.value;
        }
        setCategory(temp);
    }
    return (
        <>
            <div>
                <ToastContainer />
                <h1 className='font-bold text-[22px] mb-[20px]'>View/Edit Category</h1>
                <form className='px-[50px] mb-[100px]' onSubmit={handleEditCategory}>
                    {
                        Object.keys(category).length === 0 ?
                            <div className='flex flex-col gap-[15px]'>
                                <Skeleton variant="text" sx={{ fontSize: '4rem' }} />
                                <Skeleton variant="text" sx={{ fontSize: '4rem' }} />
                                <Skeleton variant="text" sx={{ fontSize: '5rem' }} />
                                <Skeleton variant="text" sx={{ fontSize: '4rem' }} width={210} />
                                <Skeleton variant="rectangular" width={300} height={250} />
                                <div className='flex justify-end'>
                                    <Skeleton variant="text" sx={{ fontSize: '4rem' }} width={210} />
                                </div>
                            </div>
                            :
                            <>
                                <div className='flex flex-col gap-[15px]'>

                                    <label className='flex flex-col gap-[5px]'>
                                        Category Name
                                        <input value={category.categoryName ?? ''} onChange={handleChange} type='text' name='categoryName' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />

                                    </label>
                                    <label className='flex flex-col gap-[5px]'>
                                        Category Slug
                                        <input value={category.categorySlug ?? ''} onChange={handleChange} type='text' name='categorySlug' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
                                    </label>
                                    <label className='flex flex-col gap-[5px]'>
                                        Category Description
                                        <textarea value={category.categoryDesc ?? ''} onChange={handleChange} name='categoryDesc' className='border-2 border-gray-500 outline-none px-[10px] py-[4px] resize-none' required />
                                    </label>
                                    <label className='flex flex-col gap-[5px]'>
                                        Category Status
                                        <div className='flex gap-[20px] items-center mx-[20px]'>
                                            <div><input type='radio' checked={category.categoryStatus ?? false} onChange={handleChange} className='outline-none' name='categoryStatus' value='Active' required />  Active</div>
                                            <div><input type='radio' checked={category.categoryStatus === undefined ? false : !category.categoryStatus} onChange={handleChange} className='outline-none' name='categoryStatus' value='Deactive' required />  Deactive</div>
                                        </div>
                                    </label>

                                    <div className='flex flex-col'>
                                        Category Thumbnail
                                        <input type='file' name='categoryThumbnail' id='categoryThumbnailInp' className='mx-[20px] text-blue-500 w-[250px]' accept=".jpeg,.jpg,.png" onChange={handlePreview} />
                                    </div>
                                    <img src={previewSrc} name='categoryTPreview' className='w-[180px] h-[180px] bg-gray-200' />

                                </div>
                                <div className='flex gap-[20px] justify-end items-center'>
                                    <button type='button' onClick={handleCancelBtn} className='cursor-pointer border-2 border-gray-400 text-gray-400 w-[120px] py-[4px]'>Cancel</button>
                                    <button className={`${isEdited ? 'bg-green-500 cursor-pointer border-green-500' : 'bg-green-100 border-green-100'} border-2  text-white w-[120px] py-[4px] `} disabled={!isEdited}>Edit</button>
                                </div>
                            </>
                    }
                </form>
            </div>
        </>
    )
}
