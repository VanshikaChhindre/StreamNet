import React from 'react'
import { useParams } from 'react-router-dom';
import { useGetVideoByIdQuery } from '../features/auth/authApiSlice';

const VideoPlayer = () => {
    const { id } = useParams(); // Access the dynamic id from the URL
    console.log(id)
  const { data: video, isLoading, isError } = useGetVideoByIdQuery(id); 
  console.log(video)
  return (
    <div className='w-full min-h-screen bg-pink-400 flex items-end justify-end'>
       <main className='w-[79vw] min-h-[100vh] bg-slate-900 flex mt-[4rem] p-4'>
        <div className='w-[50rem] h-[30rem] bg-slate-200'>
       <video controls src={video.videoFile.url} className='w-full h-auto'></video>
 
        </div>
       </main>
    </div>
  )
}

export default VideoPlayer