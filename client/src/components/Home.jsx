import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useAllvideosQuery } from '../features/auth/authApiSlice';


const Home = () => {

    const user = useSelector(selectCurrentUser)
    const { data, isLoading, isError, isSuccess } = useAllvideosQuery();

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
      })

  return (
    <div className='w-full min-h-screen bg-slate-950 flex flex-col items-end justify-end'>
        <div className='w-[79vw] min-h-[100vh] bg-slate-950 flex flex-col'>
        <section className='w-full h-16 bg-slate-400 flex mt-[4rem] z-40'>
            <span className='w-1/2 h-full flex'>
                <button className={`${user? 'w-[90%]' : 'w-full'} w-full h-full flex items-center justify-center bg-slate-800`} onClick={()=>setOption("videos")}>
                Videos
                </button>
              {user && ( <Link to='/add-video' className='w-[10%] h-full text-white bg-black text-3xl flex items-center justify-center'>+</Link>)}
            </span>
            
             <span className='w-1/2 h-full flex'>
                <button className={`${user? 'w-[90%]' : 'w-full'} w-full h-full flex items-center justify-center bg-slate-700`} onClick={()=>setOption("tweets")}>
                Tweets
                </button>
                {user && (<Link to='#' className='w-[10%] h-full text-white bg-black text-3xl flex items-center justify-center'>+</Link>)}
            </span> 
          </section>

          {option === "videos"? (
            <section className='w-full h-full bg-slate-950 flex p-5 gap-6 flex-wrap '>
            {videos.map((item, index)=>(
            <Link to={`/video/${item._id}`} key={index} className='z-40'>
            <card className='w-[20rem] h-[14rem] bg-slate-900 flex flex-col overflow-hidden rounded-md z-40'>
                <span className='w-full h-[70%]  flex items-center justify-center bg-cover'
                 style={{ backgroundImage: `url(${item.thumbnail.url})` }}></span>
                <span className='w-full h-[30%] flex items-center justify-center border-t border-slate-400'>{item.title}</span>
            </card>
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