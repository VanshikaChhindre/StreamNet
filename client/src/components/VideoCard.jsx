import React from 'react'
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({
    thumbnail,
    duration,
    title,
    username,
    avatar,
    createdAt
}
) => {

    const formatDuration = (durationInSeconds) => {
       
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);
    
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
      };

  return (
    <card className='w-[22rem] min-h-[14rem]  flex flex-col overflow-hidden z-40'>
         <span className='w-full h-[12rem]  flex items-end justify-end p-2 bg-cover rounded-md'
               style={{ backgroundImage: `url(${thumbnail})` }}>
                 <div className='bg-gray-800/85 min-w-6 h-6 rounded px-1 py-[2px] text-sm text-white'>{formatDuration(duration)}</div>
         </span>
         <span className='w-full h-[25%] flex items-center text-text p-1'>
            <avatar className='w-9 h-9 bg-white rounded-full bg-cover bg-center'
                    style={{ backgroundImage: `url('${avatar}')` }}/>
                    <div className='w-[88%] h-full pl-2 flex flex-col'>
                        <span className='w-full min-h-[50%] text-[18px] font-semibold'>
                            {title}
                        </span>
                        <span className='text-sm flex items-center gap-2'>
                            <div>{username} ● </div>
                            <div>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</div>
                        </span>
                    </div>  
         </span>        
    </card>
  )
}

export default VideoCard