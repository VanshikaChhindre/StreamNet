import React from 'react'
import { Link } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../components/Input'
import { useLoginMutation } from './auth/authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './auth/authSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

/* const schema = z.object({
    email: z.string().email(),
    // Password was not being sent in the request
    password: z.string(),
  }); */


const Login = () => {

    const { register, handleSubmit, reset, formState:{errors, isValid}} = useForm()

    const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const loginUser = async(data)=>{
      const userData = {
        email: data.credential,
        username: data.credential,
        password: data.password
      }

      try {
         const response = await login(userData).unwrap();
        console.log(response.data) 

        /* const response = await axios.post(`http://localhost:4000/api/v1/users/login`,  userData); */
        console.log("Login in successful");

        const {user, accessToken} = response.data;
        dispatch(setCredentials({user:user, token: accessToken}))
        navigate('/')
        reset() 
      } catch (error) {
        console.log(error.message)
      } 
    } 


 
  return (
    <div className='w-full h-screen bg-slate-950 flex items-center justify-center'>
        
        <main className='w-1/3 h-1/2 rounded-xl bg-slate-400 p-5 px-12'>
            <form onSubmit={handleSubmit(loginUser)} >
              <container className='w-full h-full flex flex-col items-center'>
                  <Input
                    label = "Email"
                    type = "text"
                    placeholder = "Enter username or email"
                    {...register('credential', {
                      required: true
                    })}
                  />
                  {errors.email && <p className="text-red-400">{errors.email.message}</p> }

                  <Input
                    label = "Password"
                    type = "password"
                    placeholder = "Enter password"
                    {...register('password', {
                      required: true
                    })}
                  />
                  {errors.password && <p>{errors.password.message}</p>}

                  <button className='w-32 h-9 text-white bg-green-500 rounded-full hover:bg-green-700'  disabled={!isValid}>Login</button>

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


export default Login