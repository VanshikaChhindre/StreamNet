import React from 'react'

const Home = () => {

    const videos = [
        {title: 'video1'},
        {title: 'video2'},
        {title: 'video3'},
        {title: 'video2'},
        {title: 'video2'},
        {title: 'video2'},
        {title: 'video2'},
        {title: 'video3'},
        {title: 'video3'},
        {title: 'video3'},
    
    ]
  return (
    <div className='w-full min-h-screen bg-slate-950 flex items-end justify-end'>
        <div className='w-[80%] h-full bg-slate-950 flex p-5 gap-6 flex-wrap mt-24'>
            {videos.map((item, index)=>(
            <card key={index} className='w-[20rem] h-[14rem] bg-slate-900 flex flex-col'>
                <span className='w-full h-[70%]  flex items-center justify-center'>video</span>
                <span className='w-full h-[30%] flex items-center justify-center border-t border-slate-400'>{item.title}</span>
            </card>
            ))}
            
        </div>
        
    </div>
  )
}

export default Home