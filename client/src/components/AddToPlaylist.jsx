import React, { useEffect, useState } from 'react'
import {  
  useCreatePlaylistMutation,
  useAddVideoToPlaylistMutation,
  useGetUserPlaylistsQuery 
} from '../features/auth/authApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { Link, useParams } from 'react-router-dom'

const AddToPlaylist = () => {
  const user = useSelector(selectCurrentUser)
  const {videoId} = useParams();

  const [playlists, setPlaylists] = useState([])

  const {data: userPlaylists, isSuccess: areUserPlaylistsLoaded} = useGetUserPlaylistsQuery(user._id)

  useEffect(()=>{
    if(areUserPlaylistsLoaded){
      console.log("playlists", userPlaylists)
      setPlaylists(userPlaylists.data)
     console.log("playlists fetched", playlists)
    }
  }, [areUserPlaylistsLoaded])

  return (
    <div className="w-full min-h-screen bg-background flex items-end justify-end">
      <main className="w-[80vw] min-h-[90vh] flex mt-[4rem] p-4 justify-center z-40">
        <section className='w-[50vw] h-96 text-text p-5'>
          <h1 className='w-full h-10 text-2xl'>Add to Playlists</h1>
          <div className='w-full min-h-48 p-2 bg-secondary flex items-center justify-center'>
            {playlists.length ? <div>Yessplaylists</div> 
            : <div>No playlists found for the user</div>}
          </div>
          <div className='w-full h-14 flex items-center justify-between p-2 mt-6'>
            <Link to={`/add-to-playlist/${videoId}/create-playlist`} className='w-60 h-12 rounded-md bg-primary hover:bg-accent text-text flex items-center justify-center'>Create Playlist </Link>
            <button className='w-60 h-12 rounded-md bg-primary  hover:bg-accent text-text' disabled> Add video </button>
          </div>
        </section>
        
    </main>
    </div>
  )
}

export default AddToPlaylist