import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useWatchHistoryQuery } from '../features/auth/authApiSlice'
import { Link } from 'react-router-dom'
import VideoCard from './VideoCard'

const WatchHistory = () => {
  const user = useSelector(selectCurrentUser)

  const [videos, setVideos] = useState([])

  if(user){
    const { data, isLoading, isSuccess } = useWatchHistoryQuery()

    useEffect(()=>{
      if(isSuccess && data){
        console.log(data.data)
        setVideos(data.data)
      }
    }, [data, isSuccess])
    
  }

  return (
    <div className='w-full min-h-screen bg-pink-400 flex items-end justify-end'>
       <main className='w-[80vw] min-h-[100vh] bg-background text-text flex flex-col'>
        <div className='w-full min-h-[25rem] bg-background text-text mt-[4rem] flex flex-col'>
         <h1 className='w-full h-12 px-6 py-2 text-3xl'>Watch History</h1>
          <div className='w-full min-h-[25rem] px-3'>
            <div className='w-full h-full flex py-5  gap-6 flex-wrap '>
            {videos.map((item, index)=>(
            <Link to={`/video/${item._id}`} key={index} className='z-40'>
              <VideoCard
                thumbnail = {item.thumbnail.url}
                duration = {item.duration}
                title = {item.title}
                username = {item.owner.username}
                avatar = {item.owner.avatar?.url}
                createdAt = {item.createdAt}
              />
            </Link>
            ))}
            </div>
          </div>
        </div>
       </main>
    </div>
  )
}

export default WatchHistory