import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useGetVideoByIdQuery, useAddVideoToHistoryMutation } from '../features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';


const VideoPlayer = () => {
 /*  const user = useSelector(selectCurrentUser)
  const { id } = useParams(); // Access the dynamic id from the URL
   
  const { data, isLoading, isError, isSuccess } = useGetVideoByIdQuery(id); 

  
  if(isSuccess){
    console.log(data)
  }

  
    if(user){
      const { data : userVideo, isSuccess : isUserVideoSuccess } = useAddVideoToHistoryMutation(id)

      useEffect(()=>{
      if(isUserVideoSuccess)(
        console.log("Video added to history \n", userVideo)
      )}, [])
    }
 

 */
    const user = useSelector(selectCurrentUser); // Get the current user from Redux
    const { id } = useParams(); // Access the dynamic id from the URL
     
    const { data, isLoading, isError, isSuccess } = useGetVideoByIdQuery(id);
    const [addVideoToHistory, { isSuccess: isUserVideoSuccess }] = useAddVideoToHistoryMutation(); // Destructure mutation
  
    useEffect(() => {
      if (isSuccess) {
        console.log('Video data:', data);
      }
  
      if (user && isSuccess) {
        addVideoToHistory(id); 
      }
    }, [id, isSuccess, user, addVideoToHistory]); 
  
    useEffect(() => {
      if (isUserVideoSuccess) {
        console.log('Video added to history');
      }
    }, [isUserVideoSuccess]);
  
  
 
  return (
    <div className='w-full min-h-screen bg-pink-400 flex items-end justify-end'>
       <main className='w-[79vw] min-h-[100vh] bg-slate-900 flex mt-[4rem] p-4'>
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
        <div className='w-full h-14  flex items-center p-4 text-2xl font-semibold'>
          {data.data.title}
        </div>
        <div>
          {data.data.description}
          {data.data.createdAt}
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