import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { logOut } from '../features/auth/authSlice'
import { useLogoutMutation } from '../features/auth/authApiSlice'
import { LightMode, NightMode, HomeIcon, ChannelIcon, HistoryIcon, TweetIcon } from '../assets/navicons'
import { useTheme } from '../features/ThemeContext'

const Navbar = () => {
  const user = useSelector(selectCurrentUser)
 
  const dispatch = useDispatch()
  const [logout] = useLogoutMutation()
  const location = useLocation();
  const currentPath = location.pathname;

  const { theme, toggleTheme } = useTheme();

  const logoutHandler = async() =>{
    try {
      await logout().unwrap(); 
      dispatch(logOut()); 
    } catch (error) {
      console.error('Logout failed:', error);
  }
}


  const sideBarItems = [
    {to:'/', name:'Home', Icon : <HomeIcon/>},
    {
      to: user ? `/your-channel/${user._id}` : '/your-channel',
      name: 'Your channel',
      Icon: <ChannelIcon />
    },
    {to:'#', name:'Watched History', Icon : <HistoryIcon/>},
    {to:'#', name:'Tweet', Icon : <TweetIcon/>},

  ]

  return (
    <div className='w-full h-screen absolute flex flex-col '>
    <section className=' w-full h-16 text-text flex items-center justify-between px-5 py-2  bg-background fixed z-50'>
      <h1 className='w-1/4 h-full flex items-center text-2xl pl-28'>WeTube</h1>
      <input className='w-1/4 h-[40px] flex items-center justify-center border border-slate-600 rounded-2xl bg-background outline-none text-center' placeholder='search'></input>
      <span className='w-1/4 h-full flex items-center justify-end pr-5'>
      {user? (
          <button onClick={toggleTheme} className="lg:block">
           {theme === 'dark'? <LightMode className="w-9 h-9 text-white"/> : <NightMode className="w-7 h-7"/> }
          </button>
        )
        :(
        <links className='flex gap-2'>
          <Link to="/sign-up" className='w-20 h-full bg-gray-600 text-white flex items-center justify-center p-1 rounded-md'>Sign Up</Link>
          <Link to="/login" className='w-20 h-full bg-gray-600 text-white flex items-center justify-center p-1 rounded-md'>Login</Link>
        </links>)
        }
      </span>
    </section>

    <section className=' w-1/5 h-[calc(100vh-4rem)] text-text p-5 flex flex-col justify-between bg-background fixed mt-[64px] border-r border-gray-700 z-50'>
    <span className='flex flex-col gap-3'>
    {sideBarItems.map((item, index)=>(
      <Link to={item.to} key={index}>
        <div key={index}  className={`w-full h-10  flex items-center justify-start rounded-lg gap-3 
              ${currentPath === item.to ? 'bg-primary text-white' : 'bg-transparent'}`}
        >
          <span className='ml-12'>{item.Icon}</span> 
          <span className='ml-3'>{item.name}</span>
        </div>
      </Link>
    )
    )}
    </span>
    {user &&  <button className='w-full h-10 border border-slate-700 flex items-center justify-center'
      onClick={logoutHandler}>Logout</button>}
     
    </section> 
   
    </div>
  )
}

export default Navbar;