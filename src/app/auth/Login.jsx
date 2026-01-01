"use client"
import React, { useState } from 'react'
import { backendBaseUrl } from '../api/api';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { error, success } from '../functions/notifyUser';
import { showSpinner } from '../functions/respondToUser';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToken } from '../redux/reducers/userSlice';


export default function Login() {
    const router = useRouter()
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.token);




    let [isLoginBtnClicked, setLoginBtnClicked] = useState(false);

    let handleAdminLogin = (event) => {
        event.preventDefault();
        setLoginBtnClicked(true);
        console.log("Login btn clicked");


        const formData = new FormData(event.target);
        const formDataObject = {};
        formData.forEach((value, key) => formDataObject[key] = value);

        console.log(formDataObject);

        //for login
        axios.post(`${backendBaseUrl}/admin/login`, formDataObject)
            .then(res => res.data)
            .then(finalRes => {
                console.log(finalRes);
                if (finalRes.status) {
                    success(toast, finalRes.message);
                    dispatch(addUserToken(finalRes.token));
                    if (user) {
                        console.log("token exists");
                    } else {
                        console.log("token is null");
                    }
                    setTimeout(() => {
                        router.replace('/dashboard');
                    }, 5000);

                } else {
                    error(toast, finalRes.message);
                }
                setLoginBtnClicked(false);

            }).catch((error) => {
                console.log(error);
                error(toast, "Something went xrong [frontend catch]");
                setLoginBtnClicked(false);

            })



        // for registration
        // axios.post(`${backendBaseUrl}/admin/register`,formDataObject)
        // .then(res=>res.data)
        // .then(finalRes=>{
        //     console.log(finalRes);
        // })

    }

    return (
        <div className='bg-yellow-300'>
            <div className='mx-auto max-w-[1460px] h-[100vh] flex justify-center items-center'>
                <ToastContainer />
                <form onSubmit={handleAdminLogin} className='border-2 shadow-lg flex flex-col gap-[40px] w-[400px] mx-auto bg-black  px-[30px] py-[10px] pb-[40px]'>
                    <img src='/images/jaiswal-retail-hz.png' />
                    <input name='username' type='text' className='bg-white py-[5px] px-[10px] outline-none' placeholder='Username' required autoFocus />
                    <input name='password' type='password' className='bg-white py-[5px] px-[10px] outline-none' placeholder='Password' required />
                    <button className='bg-red-500 py-[7px] text-white cursor-pointer '>
                        {
                            showSpinner(isLoginBtnClicked, "Login")
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}
