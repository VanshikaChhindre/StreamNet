import React from 'react'
import { Form, Link, useNavigate } from 'react-router-dom'
import {useForm, Controller} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../components/Input'

import { setCredentials } from './auth/authSlice'
import { useDispatch } from 'react-redux'
import { useSignupMutation} from './auth/authApiSlice'

const schema = z.object({
    fullName: z.string().min(2, {message: "Name must me atleast two characters"}).max(20),
    username: z.string().min(3, {message: "Name must me atleast 5 characters"}).max(15),
    avatar: z.unknown(),
    coverImage: z.unknown(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  });


const Signup = () => {

    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [signup, { isLoading, isSuccess, isError, error }] = useSignupMutation();

    const { register, handleSubmit, reset, setValue, formState:{errors, isValid}} = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",})


    const registerUser = async(data)=>{
      
      const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);

        // Append file inputs
        if (data.avatar && data.avatar[0]) {
            formData.append('avatar', data.avatar[0]);
        } else {
          console.error("Avatar file not found");
      }

        if (data.coverImage && data.coverImage[0]) {
            formData.append('coverImage', data.coverImage[0]);
        }

         try {
          const response = await signup(formData).unwrap();
          console.log("Signup successful:", response.data);
          dispatch(setCredentials(response));
          navigate('/');
          reset();
      } catch (error) {
          console.error("Signup failed:", error);
      } 
  };
      
    

  return (
    <div className='w-full h-screen bg-slate-950 flex items-center justify-center'>
        
        <main className='w-1/2 h-3/5 rounded-xl bg-slate-400 p-5 px-12 flex items-center justify-center'>
            <form onSubmit={handleSubmit(registerUser)} >
              <container className='w-full h-full flex flex-col items-center'>
                   <div className='w-full flex gap-4'>
                    <Input
                    label = "Full Name"
                    type = "text"
                    placeholder = "Enter full name"
                    {...register('fullName', {
                        required: true
                    })}
                  />
                  {errors.fullName && <p className="text-red-400">{errors.fullName.message}</p>}

                   <Input
                    label = "Username"
                    type = "text"
                    placeholder = "Enter username"
                    {...register('username', {
                        required: true
                    })}
                  />
                   {errors.username && <p className="text-red-400">{errors.username.message}</p>}
                  </div>

                  <div className='w-full flex gap-4'>

                  <Input
                    label = "Avatar"
                    type = "file"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    className="bg-white"
                    {...register('avatar', {
                        required: true
                    })}
                  /> 
                 
                   {errors.avatar && <p className="text-red-400">{errors.avatar.message}</p>}
                  
                  <Input
                    label = "Cover Image"
                    type = "file"
                    accept="image/png, image/jpg, image/jpeg"
                    className="bg-white"
                    placeholder = "Enter coverImage "
                    {...register('coverImage')}
                  />
                   {errors.coverImage && <p className="text-red-400">{errors.coverImage.message}</p>}
                  </div>

                  <div className='w-full flex gap-4'>
                  <Input
                    label = "Email"
                    type = "text"
                    placeholder = "Enter email "
                    {...register('email', {
                        required: true
                    })}
                  />
                   {errors.email && <p className="text-red-400">{errors.email.message}</p>}                    

                  <Input
                    label = "Password"
                    type = "password"
                    placeholder = "Enter password"
                    {...register('password', {
                        required: true
                    })}
                  />
                   {errors.password && <p className="text-red-400">{errors.password.message}</p>}
                  </div>

                  <button className='w-32 h-9 text-white bg-green-500 rounded-full mt-6' disabled={!isValid}>Login</button>

                  <div className='w-full flex gap-1 items-center justify-center mt-5'>
                    <h4>Don't have an account?</h4>
                    <Link to='#'>Sign up</Link>
                  </div>
              </container>

            </form>
        </main>
    </div>
  )
}


export default Signup


/**const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('username', data.username);
      if (data.avatar && data.avatar[0]) {
        formData.append('avatar', data.avatar[0]);
      }
      
      formData.append('coverImage', data.coverImage);
      formData.append('email', data.email);
      formData.append('password',data.password);
      
         const userInfo ={
            fullName: data.fullName,
            username : data.username,
            avatar: data.avatar,
            coverImage: data.coverImage,
            email: data.email,
            password: data.password
        } 
            try {
              await axios.post(`http://localhost:3000/api/v1/users/register`, formData);
              console.log("sign up successful");
             } catch (error) {
              console.log(error.message)
             }
       */