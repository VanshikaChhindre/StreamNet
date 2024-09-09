import React, { useState, useEffect } from 'react'
import { EditIcon } from '../assets/navicons'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetUserQuery } from '../features/auth/authApiSlice'
import { ArrowForwardIcon, ArrowDownIcon } from '../assets/navicons'

const Settings = () => {

  const user = useSelector(selectCurrentUser)
  const [ userData, SetUserData ] = useState({})
  const [ isOpen, setIsOpen ] = useState(false)

  if(user){
    const { data, isSuccess } = useGetUserQuery( )

    useEffect(() => {
        if (isSuccess && data) {
          console.log(data)
          SetUserData(data.data)
        }
      }, [isSuccess, data])
   
  }

  const options = [
    { name: "Update Email", field: userData.email},
    { name: "Update Fullname", field: userData.fullName },
    { name: "Update username", field: userData.username},
    { name: "Update avatar", field: null},
    { name: "Change Password", field: null}
]
 
  return (
    <>
    {user? (
        <div className='w-full min-h-screen bg-background flex flex-col items-end justify-end'>
        <div className='w-[80vw] min-h-[100vh] bg-background flex flex-col pt-5'>
            <section className='w-full min-h-96 flex flex-col items-center gap-5 mt-[4rem] z-40  text-text p-5'>
            <h1 className='w-full h-12 px-6 py-2 text-3xl flex items-center justify-center'>Settings</h1>
            {options.map((item, index) =>(
                <div className='w-full h-auto flex flex-col items-center gap-3'>
                    <button key={index} 
                    className= {`w-3/4 h-16 bg-secondary rounded-full flex items-center ${item.field !== null? "justify-between" : "justify-center"} px-20`} 
                    onClick={()=> setIsOpen(!isOpen)}
                    >
                        <div className='flex items-center justify-center gap-2'><EditIcon/> <div>{item.name}</div></div>
                        <span className='flex items-center gap-4'>
                            {item.field}
                            <icon>
                            {item.field !== null ? <ArrowForwardIcon /> : null}
                            </icon>
                        </span>
                    </button>
                    {isOpen && item.field !== null && (
                    <div className='w-3/4 h-20 bg-white'></div>
                    )}
                    </div>
                ))}

            </section>
        </div>
    </div>
    ) : ""}
    </>
    
    )
}

export default Settings