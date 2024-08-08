import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { logOut } from '../features/auth/authSlice'
import { useLogoutMutation } from '../features/auth/authApiSlice'

const Navbar = () => {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [logout] = useLogoutMutation()

  const logoutHandler = async() =>{
    try {
      await logout().unwrap(); 
      dispatch(logOut()); 
    } catch (error) {
      console.error('Logout failed:', error);
  }
}


  const sideBarItems = [
    {to:'/', name:'Home'},
    {to:'/your-channel', name:'Your channel'},
    {to:'/', name:'Watched History'},
    {to:'/', name:'Tweet'},

  ]

  return (
    <div className='w-full h-screen absolute flex flex-col '>
    <section className=' w-full h-16 border-b border-slate-600 text-white flex items-center justify-between px-5 py-2 bg-slate-950 fixed z-50'>
      <h1 className='w-1/4 h-full flex items-center text-2xl pl-28'>WeTube</h1>
      <button className='w-1/4 h-full flex items-center justify-center border border-slate-600 rounded-2xl'>Search</button>
      <span className='w-1/4 h-full flex items-center justify-end pr-5'>
        {user? (<div>toggle</div>)
        :(
        <links className='flex gap-2'>
          <Link to="/sign-up" className='w-20 h-full bg-gray-600 text-white flex items-center justify-center p-1 rounded-md'>Sign Up</Link>
          <Link to="/login" className='w-20 h-full bg-gray-600 text-white flex items-center justify-center p-1 rounded-md'>Login</Link>
        </links>)
        }
      </span>
    </section>

    <section className='  w-1/5 h-[calc(100vh-4rem)] border border-slate-600 p-5 flex flex-col justify-between bg-slate-950 fixed mt-[64px] z-50'>
    <span className='flex flex-col gap-2'>
    {sideBarItems.map((item, index)=>(
      <Link to={item.to} key={index}>
        <div key={index} className='w-full h-10 border border-slate-700 text-white flex items-center justify-center'>{item.name}</div>
      </Link>
    )
    )}
    </span>
    {user &&  <button className='w-full h-10 border border-slate-700 text-white flex items-center justify-center'
      onClick={logoutHandler}>Logout</button>}
     
    </section> 
   
    </div>
  )
}

export default Navbar;