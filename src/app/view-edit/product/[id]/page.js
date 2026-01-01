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

export default function ViewEditProduct() {
  let [previewSrc, setPreviewSrc] = useState('https://cdn-icons-png.flaticon.com/512/8136/8136031.png');
  const router = useRouter()
  const dispatch = useDispatch();
  const { id } = useParams();

  let [categoryArrray, setCategoryArray] = useState([]);
  let [product, setProduct] = useState({});
  let [isEdited, setIsEdited] = useState(false);
  let [trackEdit, setTrackEdit] = useState({});

  useEffect(() => {
    dispatch(hideLinearBar());
    getCategories();
    axios.get(`${backendBaseUrl}/product/view-product/${id}`)
      .then(res => res.data)
      .then(finalRes => {
        console.log(finalRes.message);
        console.log(finalRes);
        setProduct(finalRes.data);
        setTrackEdit(finalRes.data);
      }).catch((error) => {
        console.log(error);
        console.log("something went xrong in frontend");
      })
  }, [])

  useEffect(() => {
    // console.log("below is product state variable");
    // console.log(product);

    if (Object.keys(product).length != 0 && !productThumbnail.files.length) {
      setPreviewSrc(product.thumbnail.startsWith("http") ? `${product.thumbnail}` : `${backendBaseUrl}/uploads/${product.thumbnail}`);
    }
    CheckEditStatus();
  }, [product]);

  function CheckEditStatus() {
    let isImageSelected = [...document.querySelectorAll('input[type="file"]')]
    .some(input => input.files.length > 0);
    
    if (product.title != trackEdit.title
      || product.description != trackEdit.description
      || product.mrp != trackEdit.mrp
      || product.discountPercentage != trackEdit.discountPercentage
      || product.brand != trackEdit.brand
      || product.warrantyInformation != trackEdit.warrantyInformation
      || product.shippingInformation != trackEdit.shippingInformation
      || ((typeof product.category === 'object' && product.category != null)
        ?
        (product.category != trackEdit.category)
        :
        (product.category != trackEdit.category?._id))
      || product.availabilityStatus != trackEdit.availabilityStatus
      || isImageSelected
    ) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }


  let handleChange = (e) => {
    console.log("change detected");
    let temp = { ...product };
    // console.log(e.target.name);
    if (e.target.name == 'availabilityStatus') {
      if (e.target.value == 'In Stock') {
        temp[e.target.name] = true;
      } else {
        temp[e.target.name] = false;
      }
    } else {
      temp[e.target.name] = e.target.value;
    }
    setProduct(temp);
  }

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
    console.log(categoryArrray);
  }, [categoryArrray]);



  let handlePreview = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setPreviewSrc(e.target.result);
      }
      reader.readAsDataURL(file);
    }
    console.log("file change detected");
    // console.log(categoryThumbnailInp.files.length);
    if (!productThumbnail.files.length) {
      setPreviewSrc(`${backendBaseUrl}/uploads/${product.thumbnail}`);
    }
    CheckEditStatus();
  }
  let handleCancelBtn = () => {
    dispatch(showLinearBar());
    router.push('/products');
  }
  // let objectFromFormData = {};
  let handleEditProduct = (event) => {
    event.preventDefault();
    dispatch(showLinearBar());
    console.log("Add Btn Clicked");
    const formData = new FormData(event.target);
    axios.post(`${backendBaseUrl}/product/edit-product/${product._id}`, formData)
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
        <h1 className='font-bold text-[22px] mb-[20px]'>View/Edit Product</h1>
        <form className='px-[50px] mb-[100px]' onSubmit={handleEditProduct}>

          {
            Object.keys(product).length === 0 ?
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
                    Title
                    <input value={product.title ?? ''} onChange={handleChange} type='text' name='title' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
                  </label>
                  <label className='flex flex-col gap-[5px]'>
                    Description
                    <textarea value={product.description ?? ''} onChange={handleChange} name='description' className='border-2 border-gray-500 outline-none px-[10px] py-[4px] resize-none' required />
                  </label>


                  <div className='flex justify-between'>
                    <label className='flex flex-col gap-[5px] basis-[25%]'>
                      Mrp
                      <input value={product.mrp ?? ''} onChange={handleChange} type='text' name='mrp' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
                    </label>
                    <label className='flex flex-col gap-[5px] basis-[25%]'>
                      Discount(%)
                      <input value={product.discountPercentage ?? ''} onChange={handleChange} type='text' name='discountPercentage' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
                    </label>
                    <label className='flex flex-col gap-[5px] basis-[25%]'>
                      Brand
                      <input value={product.brand ?? ''} onChange={handleChange} type='text' name='brand' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
                    </label>

                  </div>

                  <div className='flex justify-between'>
                    <label className='flex flex-col gap-[5px] basis-[25%]'>
                      Warranty Information
                      <input value={product.warrantyInformation ?? ''} onChange={handleChange} type='text' name='warrantyInformation' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
                    </label>

                    <label className='flex flex-col gap-[5px] basis-[25%]'>
                      Shipping Information
                      <input value={product.shippingInformation ?? ''} onChange={handleChange} type='text' name='shippingInformation' className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required />
                    </label>

                    <label className='flex flex-col gap-[5px] basis-[25%]'>
                      Category
                      <select name='category' onChange={handleChange} className='border-2 border-gray-500 outline-none px-[10px] py-[4px]' required>
                        <option value={trackEdit.category?._id}>{trackEdit.category?.categoryName}</option>
                        {categoryArrray.map((v, i) => {
                          if (v._id != trackEdit.category?._id) {
                            return <option value={v._id} key={i}>{v.categoryName}</option>
                          }
                        }
                        )}

                      </select>
                    </label>
                  </div>

                  <label className='flex flex-col gap-[5px]'>
                    Status
                    <div className='flex gap-[20px] items-center mx-[20px]'>
                      <div><input checked={product.availabilityStatus ?? false} onChange={handleChange} type='radio' className='outline-none' name='availabilityStatus' value='In Stock' required />  In Stock</div>
                      <div><input checked={product.availabilityStatus === undefined ? false : !product.availabilityStatus} onChange={handleChange} type='radio' className='outline-none' name='availabilityStatus' value='Out Of Stock' required />  Out Of Stock</div>
                    </div>
                  </label>

                  <div className='flex justify-between'>

                    <div>
                      <div className='flex flex-col'>
                        Thumbnail
                        <input type='file' name='productThumbnail' id='productThumbnail' className='mx-[20px] text-blue-500 w-[250px]' accept=".jpeg,.jpg,.png" onChange={handlePreview} />
                      </div>
                      <img src={previewSrc} name='productTPreview' className='w-[180px] h-[180px] bg-gray-200' />
                    </div>

                    <div className='flex flex-col items-start gap-[10px]'>
                      <AddImage index={1} product={product} CheckEditStatus={CheckEditStatus}/>
                      <AddImage index={2} product={product} CheckEditStatus={CheckEditStatus}/>
                      <AddImage index={3} product={product} CheckEditStatus={CheckEditStatus}/>
                    </div>

                    <div className='flex flex-col items-start gap-[10px]'>
                      <AddImage index={4} product={product} CheckEditStatus={CheckEditStatus}/>
                      <AddImage index={5} product={product} CheckEditStatus={CheckEditStatus}/>
                      <AddImage index={6} product={product} CheckEditStatus={CheckEditStatus}/>
                    </div>

                  </div>



                </div>
                <div className='flex gap-[20px] justify-end items-center'>
                  <button type='button' onClick={handleCancelBtn} className='cursor-pointer border-2 border-gray-400 text-gray-400 w-[120px] py-[4px]'>Cancel</button>
                  <button className={`${isEdited ? 'bg-green-500 cursor-pointer border-green-500' : 'bg-green-100 border-green-100'} border-2 text-white w-[120px] py-[4px] cursor-pointer`} disabled={!isEdited}>Update</button>
                </div>
              </>
          }




        </form>
      </div>
    </>
  )
}

function AddImage({ index, product, setMiniImageEdit, CheckEditStatus }) {
  let [miniPreviewSrc, setMiniPreviewSrc] = useState('https://cdn-icons-png.flaticon.com/512/8136/8136031.png');

  useEffect(() => {
    const fileInput = document.querySelector(`#miniImage${index}`);
    // console.log("below is product state variable from addImage function");
    // console.log(product);
    // console.log(Object.keys(product));

    if (Object.keys(product)?.length != 0 && !fileInput.files.length) {
      setMiniPreviewSrc(product.images[index - 1].startsWith("http") ? `${product.images[index - 1]}` : `${backendBaseUrl}/uploads/${product.images[index - 1]}`);
    }

    // CheckEditStatus();
  }, [product]);

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
    console.log("file change detected");
    if (!e.target.files.length) {
      setMiniPreviewSrc(product.images[index - 1].startsWith("http") ? `${product.images[index - 1]}` : `${backendBaseUrl}/uploads/${product.images[index - 1]}`);
    }
    CheckEditStatus();
  }
  return (
    <div className='flex gap-[12px]'>
      <img src={miniPreviewSrc} name='miniImagesPreview' className='w-[60px] h-[60px] bg-gray-200' />
      <div className='flex flex-col text-[13px]'>
        Image {index}
        <input type='file' name={`miniImageInp${index}`} id={`miniImage${index}`} className='text-blue-500 w-[250px]' accept=".jpeg,.jpg,.png" onChange={handlePreview} />
      </div>
    </div>
  )
}