import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice';
import { AddIcon } from '../assets/navicons';
import { useUserChannelQuery, 
         useUserVideosQuery, 
         useUserTweetsQuery,
        useGetUserPlaylistsVideosQuery, 
        useGetUserPlaylistsQuery} 
from '../features/auth/authApiSlice';
import VideoCard from './VideoCard';
import coverImageDefault from '../assets/coverImageDefault.avif' 
import { formatDate } from 'date-fns';

const Channel = () => {
  const user = useSelector(selectCurrentUser)
  console.log(user)
  const [userData, setUserData] = useState({})
  const [videos, setVideos] = useState([])
  const [tweets, setTweets] = useState([])
  const [playlists, setPlaylists] = useState([])

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  }
 
  if(user){
  
  const { data : userApi, isSuccess : isUserApiSuccess } = useUserChannelQuery(user.username)
  const { data : videoApi, isSuccess : isVideoApiSuccess } = useUserVideosQuery(user._id)
  const { data : tweetApi, isSuccess : isTweetApiSuccess } = useUserTweetsQuery(user._id)
  const { data : playlistsApi, isSuccess : isPlaylistApiSuccess } = useGetUserPlaylistsQuery(user._id)
  const { data : playlistsVideosApi, isSuccess : isPlaylistVideosApiSuccess } = useGetUserPlaylistsVideosQuery(user._id)
  

  
  useEffect(() => {
    if (isUserApiSuccess && userApi ) {
      setUserData(userApi.data);
      console.log("userapi", userApi.data); // Log the correct value
    }
  }, [userApi, isUserApiSuccess]);

  useEffect(() => {
    if (isVideoApiSuccess && videoApi ) {
      setVideos(videoApi.data);
      console.log(videoApi.data); // Log the correct value
    }

    if(isTweetApiSuccess && tweetApi){
      setTweets(tweetApi.data)
      console.log(tweetApi.data)
    }

    if(isPlaylistVideosApiSuccess && playlistsVideosApi){
      setPlaylists(playlistsVideosApi.data)
      console.log(playlistsVideosApi.data)
    }
  }, [videoApi, isVideoApiSuccess, tweetApi, isTweetApiSuccess, isPlaylistVideosApiSuccess, playlistsVideosApi]);
  }


    const [option, setOption] = useState("videos");

   
  return (
   <>
   {user?
   ( <div className='w-full min-h-screen bg-pink-400 flex md:items-end md:justify-end'>
       <main className='w-full md:w-[79vw] min-h-[100vh] bg-background text-text flex flex-col'>
        <section className='w-full h-[25rem] bg-background text-text mt-[4rem] flex flex-col'>
          <span className='w-full h-[50%] bg-cover bg-center flex items-center justify-center' 
          style={{backgroundImage: `url(${user?.coverImage ? user.coverImage.url : coverImageDefault})`}}
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
            <button className='w-1/3 h-full flex items-center justify-center  z-40' onClick={()=>setOption("videos")}>
              <div className={`w-3/4 h-full flex items-center justify-center ${option === "videos"? 'border-b-2 border-accent' : ''}`}>
                  Videos
              </div>
            </button>
            <button className='w-1/3 h-full flex items-center justify-center  z-40' onClick={()=>setOption("tweets")}>
              <div className={`w-3/4 h-full flex items-center justify-center ${option === "tweets"? 'border-b-2 border-accent' : ''}`}>
                Tweets
                </div>
            </button>
            <button className='w-1/3 h-full flex items-center justify-center  z-40' onClick={()=>setOption("playlists")}>
              <div className={`w-3/4 h-full flex items-center justify-center ${option === "playlists"? 'border-b-2 border-accent' : ''}`}>
                Playlists
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
        ): option === "tweets"? (
          <section className='w-full h-14 flex items-center justify-center pt-5 px-3 z-40'>
           <Link to='/add-tweet' className='w-32 h-10 text-text bg-secondary flex items-center justify-center gap-2 rounded-full'>
          <AddIcon className='w-6 h-6'/>
          <h5> Add Tweet</h5>
          </Link>
        </section>
        ): option === "playlists"? (
          <div></div>
        ): null}

           <div className='w-full min-h-[25rem] px-3'>
            {option === "videos"? (
             <div className='w-full h-full flex p-5 gap-6 flex-wrap '>
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
                
            ) : option === "tweets" ? (
              <div className='w-full h-full flex flex-col gap-5 p-5 z-40'>
              {tweets.map((item, index)=>(
                <card key={index} className='w-full min-h-[5rem] flex items-start bg-secondary/25 text-text'>
                  <pfp className='w-20 h-20 flex items-start justify-center'>
                    <span className='w-12 h-12 rounded-full bg-cover bg-center bg-green'
                          style={{ backgroundImage: `url('${userData?.avatar?.url}')` }}/>
                  </pfp>
                  <div className='w-[62rem] h-full flex flex-col'>
                  <info className='w-60 h-6 flex gap-3 text-primary'>
                    <span>{userData?.fullName}</span>
                    <span>@{userData?.username}</span>
                  </info>
                  <tweet className='w-full min-h-8 flex flex-col gap-1'>
                    <p className='w-full min-h-8 flex items-center'>{item.content}</p>
                    {item.photo[0].url? <span className='w-2/4 h-96 bg-white bg-cover bg-center' 
                    style={{backgroundImage : `url(${item.photo[0].url})`}}></span> : ''}
                    
                    <p className='text-xs text-gray-500'>{formatDate(item.createdAt)}</p>
                  </tweet>
                  </div>
                </card>
              
                ))}
                </div>
            ) :  option === "playlists" ? (
              <div className="w-full h-full flex flex-col gap-5 p-5 z-40">
                {playlists.map((item, index) => (
                  <div key={index} className="w-full h-[12rem] flex items-start justify-start bg-secondary text-text p-4 rounded-lg">
                    <div className="w-80 h-full bg-white flex items-center relative">
                      <span 
                        className="w-full h-full bg-cover bg-center bg-green"
                        style={{ backgroundImage: `url('${item?.thumbnail?.url}')` }}
                      >
                        {/* Overlay Div */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white text-lg">{item?.videoCount}</span>
                        </div>
                      </span>
                    </div>
                    <div className='w-1/2 h-full p-5 text-text flex flex-col'>
                      <span className='w-full h-1/2 text-2xl'>{item.name}</span>
                      <span className='w-full h-1/2 text-xl'>{item.description}</span>
                    </div>
                    
                  </div>
                ))} 
              </div>
            ) : null}
          
           
          </div> 


        </section>
        
    
       </main>
    </div>) : (<div className='w-full bg-background text-text min-h-screen md:text-5xl text-4xl flex items-center justify-center md:justify-end '>
      <h1 className=' flex items-center justify-center md:mr-80'>Login to use Channel</h1>
    </div>)}
  </>
    
    
  )
}

export default Channel