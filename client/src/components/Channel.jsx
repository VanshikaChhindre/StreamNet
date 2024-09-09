import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice';
import { AddIcon } from '../assets/navicons';
import { useUserChannelQuery, useUserVideosQuery } from '../features/auth/authApiSlice';
import VideoCard from './VideoCard';

const Channel = () => {
  const user = useSelector(selectCurrentUser)
  const [userData, setUserData] = useState({})
  const [videos, setVideos] = useState([])
 
  if(user){
  
  const { data : userApi, isSuccess : isUserApiSuccess } = useUserChannelQuery(user.username)
  const { data : videoApi, isSuccess : isVideoApiSuccess } = useUserVideosQuery(user._id)

  useEffect(() => {
    if (isUserApiSuccess && userApi ) {
      setUserData(userApi.data);
      console.log(userApi.data); // Log the correct value
    }
  }, [userApi, isUserApiSuccess]);

  useEffect(() => {
    if (isVideoApiSuccess && videoApi ) {
      setVideos(videoApi.data);
      console.log(videoApi.data); // Log the correct value
    }
  }, [videoApi, isVideoApiSuccess]);
  }
  

  
  const tweets = [
    {tweet: 'tweet1'},
    {tweet: 'tweet2'},
    {tweet: 'tweet3'},
    {tweet: 'tweet4'},
    {tweet: 'tweet5'},
  

  ]

  

    const [option, setOption] = useState("videos");

   
  return (
   <>
   {user?
   ( <div className='w-full min-h-screen bg-pink-400 flex items-end justify-end'>
       <main className='w-[79vw] min-h-[100vh] bg-background text-text flex flex-col'>
        <section className='w-full h-[25rem] bg-background text-text mt-[4rem] flex flex-col'>
          <span className='w-full h-[50%] bg-cover bg-center flex items-center justify-center' 
          style={{backgroundImage: `url('https://images.unsplash.com/photo-1722182877533-7378b60bf1e8?q=80&w=1614&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`}}
          ></span>
          <span className='w-full h-[50%]  flex'>
            <div className='w-1/4 h-full  flex items-center justify-center'>

              <pfp className='w-40 h-40 rounded-full bg-cover bg-center bg-white'
             style={{ backgroundImage: `url('${user?.avatar?.url}')` }}>
              </pfp>
            </div>

            <div className='w-[75%] h-full  p-5 flex items-center justify-between'>
              <div className=' flex flex-col'>
              <h1 className='text-3xl font-semibold'>{user.fullName}</h1>
              <h1 className='text-xl'>@{user.username}</h1>
              <h1 className='text-lg'>subscribers : {userData.subscribersCount}</h1> 
              </div>

             {/*  <div className='mr-24'>
                <button className='bg-blue-500 p-2 rounded-lg'>Subscribe</button>
              </div> */}
            </div>
          </span>
          

        </section>
        <section className='w-full min-h-[25rem]  flex flex-col'>
        <div className='w-full h-16 bg-background text-text flex'>
            <button className='w-1/2 h-full flex items-center justify-center  z-40' onClick={()=>setOption("videos")}>
              <div className={`w-3/4 h-full flex items-center justify-center ${option === "videos"? 'border-b-2 border-accent' : ''}`}>
                  Videos
              </div>
            </button>
            <button className='w-1/2 h-full flex items-center justify-center  z-40' onClick={()=>setOption("tweets")}>
              <div className={`w-3/4 h-full flex items-center justify-center ${option === "tweets"? 'border-b-2 border-accent' : ''}`}>
                Tweets
                </div>
            </button>
          </div>

          {option === "videos"? (
          <section className='w-full h-14  flex items-center justify-center pt-5 px-3 z-40'>
          <Link to='/add-video' className='w-32 h-10 text-text bg-secondary flex items-center justify-center gap-2 rounded-full'>
          <AddIcon className='w-6 h-6'/>
          <h5> Add video</h5>
          </Link>
        </section>
        ):(
          <section className='w-full h-20  flex items-center justify-center z-40'>
           <Link to='/add-tweet' className='w-28 h-10 bg-slate-700 flex items-center justify-center'>Add Tweet</Link>
        </section>
        )}

           <div className='w-full min-h-[25rem] px-3'>
            {option === "videos"? (
             <div className='w-full h-full flex p-5 gap-6 flex-wrap '>
             {videos.map((item, index)=>(
            <Link to={`/video/${item._id}`} key={index} className='z-40'>
              <VideoCard
                thumbnail = {item.thumbnail.url}
                duration = {item.duration}
                title = {item.title}
                
                avatar = {item.owner.avatar?.url}
                createdAt = {item.createdAt}
              />
            </Link>
            ))}
             
         </div>
                
            ) : (
              <div className='w-full h-full flex flex-col gap-5'>
              {tweets.map((item, index)=>(
                <card key={index} className='w-full h-[5rem] bg-slate-700 '>
                   {item.tweet}
                </card>
              
                ))}
                </div>
            )}
           
          </div> 


        </section>
        
    
       </main>
    </div>) : (<div className='w-full min-h-screen text-6xl flex items-center justify-center'>
      <h1 className=''>Login to use Channel</h1>
    </div>)}
  </>
    
    
  )
}

export default Channel