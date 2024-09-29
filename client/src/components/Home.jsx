import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useAllvideosQuery, useAllTweetsQuery } from '../features/auth/authApiSlice';
import VideoCard from './VideoCard';



const Home = () => {

    const user = useSelector(selectCurrentUser)
    const { data: videoData, isLoading: isLoadingVideos, isError: isErrorVideos, isSuccess: isVideoSuccess, refetch: refetchVideos } = useAllvideosQuery();
    const { data: tweetData, isLoading: isLoadingTweets, isError: isErrorTweets, isSuccess: isTweetSuccess, refetch: refetchTweets } = useAllTweetsQuery();

    const [option, setOption] = useState("videos"); 
    const [videos, setVideos] = useState([]);
    const [tweets, setTweets] = useState([]);

    const formatDate = (isoString) => {
      const date = new Date(isoString);
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    }

    // Fetch videos
    useEffect(() => {
        if (isVideoSuccess) {
            const videos = videoData?.data?.docs || [];
            console.log(videos)
            setVideos(videos);
        }
    }, [isVideoSuccess, videoData]);

    // Fetch tweets
    useEffect(() => {
        if (isTweetSuccess) {
            const tweets = tweetData?.data || [];
            console.log(tweets)
            setTweets(tweets);
        }
    }, [isTweetSuccess, tweetData]);

    // Refetch data based on option
    useEffect(() => {
        if (option === "videos") {
            refetchVideos(); // Refetch videos when the option changes to "videos"
        } else if (option === "tweets") {
            refetchTweets(); // Refetch tweets when the option changes to "tweets"
        }
    }, [option, refetchVideos, refetchTweets]);

  return (
    <div className='w-full min-h-screen bg-background flex flex-col items-center justify-center md:items-end md:justify-end'>
        <div className='w-full md:w-[80vw] min-h-[100vh] bg-background flex flex-col pt-5 '>
        <section className='w-full h-10 flex mt-[2.5rem] md:mt-[4rem] z-40 text-text'>
            <span className='w-1/2  h-full flex'>
                <button className={`${user? 'w-[90%]' : 'w-full'} w-full h-full flex items-center justify-center `} onClick={()=>setOption("videos")}>
                  <div className={`w-3/4 h-full flex items-center justify-center ${option === "videos"? 'border-b-2 border-accent' : ''}`}>
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
               
            </span> 
          </section>

          {option === "videos"? (
            <section className='w-full h-full bg-background flex p-5 gap-6 flex-wrap'>
            {videos.map((item, index)=>(
            <Link to={`/video/${item._id}`} key={index} className='z-40'>
              <VideoCard
                thumbnail = {item.thumbnail.url}
                duration = {item.duration}
                title = {item.title}
                username = {item.owner.username}
                userId = {item.owner._id}
                avatar = {item.owner.avatar?.url}
                createdAt = {item.createdAt}
              />
            </Link>
            ))}
            
            </section>
          ) : (
            <div className='w-full h-full flex flex-col gap-5 p-5'>
            {tweets.map((item, index)=>(
                <card key={index} className='w-full min-h-[5rem] flex items-start gap-2 bg-secondary/25 text-text'>
                  <pfp className='w-20 h-20  flex items-start justify-center'>
                    <span className='w-12 h-12 rounded-full bg-cover bg-center bg-green'
                          style={{ backgroundImage: `url('${item.owner?.avatar?.url}')` }}/>
                  </pfp>
                  <div className='w-[62rem] h-full flex flex-col'>
                  <info className='w-60 h-6 flex gap-3 text-primary'>
                    <span>{item.owner.fullName}</span>
                    <span>@{item.owner.username}</span>
                  </info>
                  <tweet className='w-full min-h-8 flex flex-col gap-1'>
                    <p className='w-full min-h-8 flex items-center'>{item.content}</p>
                    {item.photo[0].url? <span className='w-96 md:w-2/4 h-96 bg-white bg-cover bg-center' 
                    style={{backgroundImage : `url(${item.photo[0].url})`}}></span> : null}
                    
                    <p className='text-xs text-gray-500'>{formatDate(item.createdAt)}</p>
                  </tweet>
                  </div>
                </card>
              
                ))} 
              </div>
          )}
        
        </div>
    </div>
  )
}

export default Home