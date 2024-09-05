import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useAllvideosQuery } from '../features/auth/authApiSlice';
import VideoCard from './VideoCard';



const Home = () => {

    const user = useSelector(selectCurrentUser)
    const { data, isLoading, isError, isSuccess, refetch } = useAllvideosQuery();

    const [option, setOption] = useState("videos"); 
    const [videos, setVideos] = useState([])

    const tweets = [
        {tweet: 'tweet1'},
        {tweet: 'tweet2'},
        {tweet: 'tweet3'},
        {tweet: 'tweet4'},
        {tweet: 'tweet5'},
      ]

      useEffect(() => {
        if (isSuccess) {
          const videos = data?.data?.docs || [];
          setVideos(videos);
        }
      }, [isSuccess, data])

      useEffect(() => {
        if (option === "videos") {
            refetch(); // Refetch videos when the option changes to "videos"
        }
    }, [option, refetch]);

  return (
    <div className='w-full min-h-screen bg-background flex flex-col items-end justify-end'>
        <div className='w-[80vw] min-h-[100vh] bg-background flex flex-col pt-5'>
        <section className='w-full h-10 flex mt-[4rem] z-40  text-text'>
            <span className='w-1/2 h-full flex'>
                <button className={`${user? 'w-[90%]' : 'w-full'} w-full h-full flex items-center justify-center `} onClick={()=>setOption("videos")}>
                  <div className={`w-3/4 h-full ${option === "videos"? 'border-b-2 border-accent' : ''}`}>
                    Videos
                  </div>
                </button>
              {/* {user && ( <Link to='/add-video' className='w-[10%] h-full text-white bg-black text-3xl flex items-center justify-center border-r border-gray-700'>+</Link>)} */}
            </span>
            
             <span className='w-1/2 h-full flex'>
                <button className={`${user? 'w-[90%]' : 'w-full'} w-full h-full flex items-center justify-center `} onClick={()=>setOption("tweets")}>
                <div className={`w-3/4 h-full ${option === "tweets"? 'border-b-2 border-accent' : ''}`}>
                Tweets
                </div>
                </button>
                {/* {user && (<Link to='#' className='w-[10%] h-full text-white bg-black text-3xl flex items-center justify-center'>+</Link>)} */}
            </span> 
          </section>

          {option === "videos"? (
            <section className='w-full h-full bg-background flex p-5 gap-6 flex-wrap '>
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
            
            </section>
          ) : (
            <div className='w-full h-full flex flex-col gap-5 bg-slate-950 p-5'>
            {tweets.map((item, index)=>(
              <card key={index} className='w-full h-[5rem] bg-slate-700 '>
                 {item.tweet}
              </card>
            
              ))}
              </div>
          )}
        
        </div>
    </div>
  )
}

export default Home