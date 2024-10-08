import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useCreateTweetMutation } from '../features/auth/authApiSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'

const Tweet = () => {

    const user = useSelector(selectCurrentUser)

    const navigate = useNavigate()
    const [add, setAdd] = useState(false)
    const [createTweet, {isLoading, isError, isSuccess}] = useCreateTweetMutation()

    const { register, handleSubmit, watch, reset, setValue, formState: { errors, isValid} } = useForm()
    const watchedPhoto = watch('photo');
    register('photo', { required: false });

    const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
          setValue('photo', acceptedFiles[0]);
        },
        multiple: false,
      }); 

    const photoUrl = watchedPhoto ? URL.createObjectURL(watchedPhoto) : null; 

    const handleToggleAdd = () => {
      if (add) {
        // Clear the post when toggling off
        setValue('photo', null)
      }
      setAdd(!add)
    }

    const handleTweet = async(data)=>{
      console.log(data);
      const formData = new FormData();
      formData.append("content", data.content)
      if(data.photo){
        formData.append("photo", data.photo)
      }

      try {
        const response = await createTweet(formData).unwrap();
        if(response) console.log("Tweet created successfully!")
      } catch (error) {
        console.log(error.message)
      }
      reset();
      navigate(`/your-channel/${user._id}`) 
      window.location.reload() 

    }

  return (
    <div className='w-full min-h-screen flex items-end justify-end'>
        <main className='w-[80vw] min-h-[100vh] bg-background flex flex-col px-36 py-10'>
            <div className='mt-24 z-40'>
            <form onSubmit={handleSubmit(handleTweet)}>
           
           <label className='text-text inline-block mb-1 pl-2 text-2xl' htmlFor='content'>Tweet</label>
           <textarea
            rows="3"
            className={` w-full border border-gray-300 rounded-md p-2 outline-none `}
            placeholder="Enter your Tweet"
            name = "content"
            {...register("content", { required: true })}>
            </textarea> 
            {errors.content && <p className="text-red-400">{errors.content.message}</p>}
            <div className="flex flex-col gap-4">
            <button type="button" className='bg-secondary text-text min-w-24 h-10' onClick={handleToggleAdd}>{add === false? "Add photo" : "Remove photo"}</button>

            <div
            {...getPhotoRootProps({ className: `border-2 border-dashed border-gray-300 rounded-md p-4 mt-4 text-center cursor-pointer hover:border-gray-500 flex flex-col items-center justify-center ${add === false? "hidden" : " "}` })}
          >
            <input {...getPhotoInputProps()} />
            <p className='text-gray-500'>Drag & drop a thumbnail image here, or click to select a file</p>
            {watchedPhoto && (
              <div className='w-[20rem] mt-4 '>
                <img 
                  src={photoUrl} 
                  alt="photo preview"
                  className='w-full h-auto object-cover rounded-md'
                />
              </div>
            )}
          </div> 

            <button className="bg-accent text-text p-2 hover:bg-primary" type='submit'>Finish</button>
            </div>
           </form>
           </div>
        </main>
    </div>
  )
}

export default Tweet