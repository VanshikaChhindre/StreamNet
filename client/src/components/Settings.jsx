import React, { useState, useEffect } from 'react'
import { EditIcon } from '../assets/navicons'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUserDetails } from '../features/auth/authSlice'
import { useGetUserQuery, useUpdateDetailsMutation } from '../features/auth/authApiSlice'
import { LightMode, NightMode, ArrowForwardIcon, ArrowDownIcon } from '../assets/navicons'
import { useTheme } from '../features/ThemeContext'

const Settings = () => {

  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [ userData, SetUserData ] = useState({})
  const [openIndex, setOpenIndex] = useState(null)
  const [inputValues, setInputValues] = useState({})

  const { theme, toggleTheme } = useTheme();

  const [updateDetails, {isLoading, isError, isSuccess}] = useUpdateDetailsMutation()

  if(user){
    const { data, isSuccess } = useGetUserQuery( )

    useEffect(() => {
        if (isSuccess && data) {
          SetUserData(data.data)
          setInputValues({
            email: data.data.email,
            fullName: data.data.fullName,
            username: data.data.username,
          })
        }
        
      }, [isSuccess, data])
   
  }

  const options = [
    { name: "Update Email", update: "Email", field: userData.email, key: "email" },
    { name: "Update Fullname", update: "Full Name", field: userData.fullName, key: "fullName" },
    { name: "Update Username", update: "Username", field: userData.username, key: "username" },
    
]

const handleInputChange = (key, value) => {
  setInputValues((prevState) => ({
    ...prevState,
    [key]: value,
  }))
}

// Handle the update submission
const handleUpdate = async (key) => {
  try {
    const updatedValue = inputValues[key]
      await updateDetails({ [key]: updatedValue }).unwrap() // Send updated data to server

      // If update is successful, update Redux store
      dispatch(updateUserDetails({ key, value: updatedValue }))

      alert(`${options.find(item => item.key === key).update} updated successfully!`)
      window.location.reload()
  } catch (err) {
    console.error('Update failed', err)
  }
}

/* { name: "Update avatar", field: null},
    { name: "Change Password", field: null} */
 
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
                    className= {`w-3/4 h-16 bg-secondary rounded-full flex items-center  justify-between px-20`} 
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                        <div className='flex items-center justify-center gap-2'><EditIcon/> <div>{item.name}</div></div>
                        <span className='flex items-center gap-4'>
                            {item.field}
                            <icon>
                            {openIndex === index ? <ArrowDownIcon /> : <ArrowForwardIcon />}
                            </icon>
                        </span>
                    </button>
                    {openIndex === index && item.field !== null && (
                    <div className='w-3/4 h-20 flex items-center justify-center gap-5'>
                      <input className='w-1/2 h-10 outline-none p-3 rounded-md text-black' 
                      placeholder={`Enter new ${item.update}`}
                      value={inputValues[item.key] || ''}
                      onChange={(e) => handleInputChange(item.key, e.target.value)}
                      />
                      <button className='w-32 h-10 hover:bg-primary bg-accent rounded-md '
                      onClick={() => handleUpdate(item.key)}
                      disabled={isLoading}>Update</button>
                    </div>
                    )}
                    </div>
                ))}

                <div></div>

            </section>
        </div>
    </div>
    ) : (<div className='w-full bg-background text-text min-h-screen md:text-5xl text-4xl flex flex-col gap-5 items-center md:items-end justify-center'>
            <button onClick={toggleTheme} className="md:w-[80vw] md:h-20 flex items-center justify-center z-40">
              {theme === 'dark'? <LightMode className="w-10 h-10 text-white"/> : <NightMode className="w-7 h-7"/> }
            </button>
    <h1 className='w-full h-20 flex items-center justify-center md:justify-end md:pr-72'>Login to use all features</h1>

  </div>)}
    </>
    
    )
}

export default Settings