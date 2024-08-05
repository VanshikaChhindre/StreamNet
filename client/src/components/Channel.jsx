import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice';

const Channel = () => {
  const user = useSelector(selectCurrentUser)

  const videos = [
    {title: 'video1'},
    {title: 'video2'},
    {title: 'video3'},
    ]

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
       <main className='w-[79vw] min-h-[100vh] bg-slate-900 flex flex-col'>
        <section className='w-full h-[25rem] bg-slate-500 mt-[4.2rem] flex flex-col'>
          <span className='w-full h-[50%] bg-cover bg-center flex items-center justify-center' 
          style={{backgroundImage: `url('https://images.unsplash.com/photo-1722182877533-7378b60bf1e8?q=80&w=1614&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`}}
          ></span>
          <span className='w-full h-[50%]  flex'>
            <div className='w-1/4 h-full  flex items-center justify-center'>

              <pfp className='w-44 h-44 rounded-full bg-cover bg-center'
              style={{backgroundImage: `url('https://images.unsplash.com/photo-1722109005676-583a67dd069f?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`}}
              ></pfp>
            </div>

            <div className='w-[75%] h-full  p-5 flex items-center justify-between'>
              <div className=' flex flex-col'>
              <h1 className='text-3xl font-semibold'>Salai Inong</h1>
              <h1 className='text-xl'>@salaiinong</h1>
              <h1 className='text-lg'>111.2K subscribers</h1>
              </div>

              <div className='mr-24'>
                <button className='bg-blue-500 p-2 rounded-lg'>Subscribe</button>
              </div>
            </div>
          </span>
          

        </section>
        <section className='w-full min-h-[25rem] bg-slate-900 flex flex-col'>
        <div className='w-full h-16 bg-slate-400 flex'>
            <button className='w-1/2 h-full flex items-center justify-center bg-slate-800 z-40' onClick={()=>setOption("videos")}>
             Videos
            </button>
            <button className='w-1/2 h-full flex items-center justify-center bg-slate-700 z-40' onClick={()=>setOption("tweets")}>
              Tweets
            </button>
          </div>

          {option === "videos"? (
          <section className='w-full h-20 bg-slate-300 flex items-center justify-center z-40'>
          <Link to='/add-video' className='w-28 h-10 bg-slate-700 flex items-center justify-center'>Add video</Link>
        </section>
        ):(
          <section className='w-full h-24 bg-slate-300 flex items-center justify-center z-40'>
           <Link to='/add-tweet' className='w-28 h-10 bg-slate-700 flex items-center justify-center'>Add Tweet</Link>
        </section>
        )}

          <div className='w-full min-h-[25rem] bg-slate-950 p-5'>
            {option === "videos"? (
             <div className='w-full h-full bg-slate-950 flex p-5 gap-6 flex-wrap '>
             {videos.map((item, index)=>(
             <card key={index} className='w-[20rem] h-[14rem] bg-slate-900 flex flex-col'>
                 <span className='w-full h-[70%]  flex items-center justify-center'>video</span>
                 <span className='w-full h-[30%] flex items-center justify-center border-t border-slate-400'>{item.title}</span>
             </card>
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