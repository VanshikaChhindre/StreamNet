import React from 'react'
import { Link } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../components/Input'

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    // Password was not being sent in the request
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  });


const Login = () => {

    const { register, handleSubmit, reset, formState:{errors, isValid}} = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",})

  return (
    <div className='w-full h-screen bg-slate-950 flex items-center justify-center'>
        
        <main className='w-1/3 h-1/2 rounded-xl bg-slate-400 p-5 px-12'>
            <form onSubmit={handleSubmit()} >
              <container className='w-full h-full flex flex-col items-center'>
                  <Input
                    label = "Email"
                    type = "text"
                    placeholder = "Enter username or email"
                  />

                  <Input
                    label = "Password"
                    type = "password"
                    placeholder = "Enter password"
                  />

                  <button className='w-32 h-9 text-white bg-green-500 rounded-full'>Login</button>

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