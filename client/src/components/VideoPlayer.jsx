import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useGetVideoByIdQuery, useAddVideoToHistoryMutation, useAddCommentMutation, useVideoCommentsQuery } from '../features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { ArrowDownIcon, ArrowForwardIcon } from '../assets/navicons';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';


const VideoPlayer = () => {
  

    const { register, handleSubmit, reset, formState: { errors, isValid} } = useForm()
    const user = useSelector(selectCurrentUser); // Get the current user from Redux
    const userId = user?._id
    const { id } = useParams(); // Access the dynamic id from the URL
     
    const { data, isLoading, isError, isSuccess } = useGetVideoByIdQuery(id);
    const { videoComments, isVideoCommentsSuccess } = useVideoCommentsQuery(id);
    
    const [openIndex, setOpenIndex] = useState(false)
    const [addVideoToHistory, { isSuccess: isUserVideoSuccess }] = useAddVideoToHistoryMutation(); // Destructure mutation
    const [add, { isSuccess: isAddCommentSuccess }] = useAddCommentMutation();

    const addComment = async(data) => {
      const formData = {
        content: data.content,
        videoId: id,
        owner: userId
      }

      try {
        const response = await add(formData).unwrap();
        console.log(response.data)  
        console.log("comment added successfully.");

        reset() 
      } catch (error) {
        console.log(error.message)
      } 
    } 
    
  
    useEffect(() => {
      if (isSuccess) {
        console.log('Video data:', data);
      }
  
      if (user && isSuccess) {
        addVideoToHistory(id); 
      }

      if(isVideoCommentsSuccess){
        console.log("comments:", videoComments)
      }
    }, [id, isSuccess, user, addVideoToHistory, isVideoCommentsSuccess]); 
  
    useEffect(() => {
      if (isUserVideoSuccess) {
        console.log('Video added to history');
      }
    }, [isUserVideoSuccess]);
  
  
 
  return (
    <div className='w-full min-h-screen bg-pink-400 flex items-end justify-end '>
       <main className='w-[79vw] min-h-[100vh] bg-slate-900 flex mt-[4rem] p-4 justify-center items-center z-40'>
        <section className='w-[50rem] min-h-[100vh] bg-slate-300 rounded-xl overflow-clip'>
        {isSuccess && data.data ? (
        <div>
        <div className='w-[50rem] h-[28.1rem] bg-slate-200'>
            <video
             controls 
             autoPlay
             loop
             src={data.data.videoFile.url} className='w-full h-auto'></video>
         
        </div>
        <button className='w-full min-h-20 bg-red-400 text-text flex py-4 px-6 justify-between items-center '
        onClick={()=> setOpenIndex(!openIndex)}>
          <span className='text-2xl font-semibold '>{data.data.title}</span>
          {openIndex === true ? <ArrowDownIcon /> : <ArrowForwardIcon />}
        </button>
        <div className={`w-full min-h-20 p-5 bg-slate-700 flex-col ${openIndex === true ? 'flex' : 'hidden'}`}>
          <span>{data.data.description}</span>
          <span> {format(new Date(data.data.createdAt), 'dd-MM-yyyy, HH:mm aa')}</span>
        </div>
        <div className='w-full min-h-64 p-5 bg-yellow-300'>
          <form className='w-full flex gap-2' onSubmit={handleSubmit(addComment)}>
            <input className='w-[90%] h-10 text-black outline-none p-1' placeholder='add comment'
            {...register("content", { required: true })}></input>
            <button type= 'submit' className='w-[10%] h-10 rounded-md bg-slate-500'>Add</button>
          </form>
        </div>
       
        </div>
         ) : (
          <div>Loading...</div>
        )}
        </section>
       </main>
    </div>
  )
}

export default VideoPlayer