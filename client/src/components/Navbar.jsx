import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const sideBarItems = [
    {to:'/', name:'Home'},
    {to:'/your-channel', name:'Your channel'},
    {to:'/', name:'Watched History'},
    {to:'/', name:'Tweet'},

  ]

  return (
    <div className='w-full h-screen absolute flex flex-col z-50'>
    <section className=' w-full h-16 border-b border-slate-600 text-white flex items-center justify-between px-5 py-2 bg-slate-950 fixed'>
      <h1 className='w-1/4 h-full flex items-center text-2xl pl-28'>WeTube</h1>
      <span className='w-1/4 h-full flex items-center justify-center border border-slate-600 rounded-2xl'>Search</span>
      <span className='w-1/4 h-full flex items-center justify-end pr-5'>toggle</span>
    </section>

    <section className='  w-1/5 h-[calc(100vh-4rem)] border border-slate-600 p-5 flex flex-col justify-between bg-slate-950 fixed mt-[64px]'>
    <span className='flex flex-col gap-2'>
    {sideBarItems.map((item, index)=>(
      <Link to={item.to}>
        <div key={index} className='w-full h-10 border border-slate-700 text-white flex items-center justify-center'>{item.name}</div>
      </Link>
    )
    )}
    </span>
      <div className='w-full h-10 border border-slate-700 text-white flex items-center justify-center'>Settings</div> 
    </section> 
   
    </div>
  )
}

export default Navbar

  