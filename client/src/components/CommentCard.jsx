import React from 'react'

const CommentCard = ({
    content,
    video,
    owner
}
) => {
  return (
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
  )
}

export default CommentCard