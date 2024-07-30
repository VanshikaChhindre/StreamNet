import React from 'react'

const Channel = () => {

  const videos = [
    {title: 'video1'},
    {title: 'video2'},
    {title: 'video3'},
    {title: 'video3'},
    {title: 'video3'},
    {title: 'video3'},
    {title: 'video2'},]
   
  return (
   
    <div className='w-full min-h-screen bg-pink-400 flex items-end justify-end'>
       <main className='w-[80vw] min-h-[100vh] bg-slate-900 flex flex-col'>
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
        <section className='w-full min-h-[25rem] bg-slate-950 flex flex-col'>

          <div className='w-full h-16 bg-slate-400'>
            <button className='w-1/2 h-full bg-slate-700'>Your videos</button>
            <button className='w-1/2 h-full bg-slate-600'>Your Tweets</button>
          </div>


          <div className='w-full min-h-96 flex p-5 gap-6 flex-wrap'>
          {videos.map((item, index)=>(
            <card key={index} className='w-[20rem] h-[14rem] bg-slate-900 flex flex-col'>
                <span className='w-full h-[70%]  flex items-center justify-center'>video</span>
                <span className='w-full h-[30%] flex items-center justify-center border-t border-slate-400'>{item.title}</span>
            </card>
            ))}
            </div>

        </section>
       

       </main>
    </div>
    
    
  )
}

export default Channel