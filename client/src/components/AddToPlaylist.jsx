import React, { useEffect, useState } from 'react'
import {  
  useCreatePlaylistMutation,
  useAddVideoToPlaylistMutation,
  useGetUserPlaylistsQuery 
} from '../features/auth/authApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { Link, useNavigate, useParams } from 'react-router-dom'

const AddToPlaylist = () => {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate();
  
  const {videoId} = useParams();

  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [addVideoToPlaylist] = useAddVideoToPlaylistMutation();


  const handleCheckboxChange = (playlistId) => {
      setSelectedPlaylists((prevSelected) => {
       
          if (prevSelected.includes(playlistId)) {
            console.log("unselected playlist", playlistId)
              return prevSelected.filter((id) => id !== playlistId); // Unselect if already selected
             
          } else {
            console.log("selected playlist", playlistId)
              return [...prevSelected, playlistId]; // Add to selected if not selected
              
          }
      });
  };

  const [playlists, setPlaylists] = useState([])

  const {data: userPlaylists, isSuccess: areUserPlaylistsLoaded} = useGetUserPlaylistsQuery(user._id)

  useEffect(()=>{
    if(areUserPlaylistsLoaded){
      console.log("playlists", userPlaylists)
      setPlaylists(userPlaylists.data)
    }
    console.log("[]", selectedPlaylists)
  }, [areUserPlaylistsLoaded, selectedPlaylists])

  const handleAddVideoToMultiplePlaylists = async () => {
    try {
      for (const playlistId of selectedPlaylists) {
        console.log('Adding video to playlist:', playlistId, videoId); // Log both values to debug
        if (!playlistId || !videoId) {
          console.error('Invalid playlistId or videoId', playlistId, videoId);
          continue;
        }
        await addVideoToPlaylist({ videoId, playlistId }).unwrap(); // Call the mutation for each selected playlist
      }
      alert('Video added to selected playlists');
      navigate(`/video/${videoId}`)
    } catch (error) {
      console.error('Error adding video to playlists', error);
      alert('An error occurred while adding the video');
    }
  };

  return (
    <div className="w-full min-h-screen bg-background flex items-end justify-end">
      <main className="w-[80vw] min-h-[90vh] flex mt-[4rem] p-4 justify-center z-40">
        <section className='w-[50vw] h-96 text-text p-5'>
          <h1 className='w-full h-10 text-2xl'>Add to Playlists</h1>
           {/* Playlist options with checkboxes */}
           <div className="w-full min-h-48 p-2 flex items-center justify-center">
                        {playlists.length ? (
                            <div className="w-full h-full p-5 flex flex-col gap-3">
                                {playlists.map((item, index) => (
                                    <div key={index} className="w-full h-full flex flex-1 flex-col">
                                        <label className="flex items-center space-x-3">
                                            <input 
                                                type="checkbox" 
                                                value={item._id}
                                                checked={selectedPlaylists.includes(item._id)}
                                                onChange={() => handleCheckboxChange(item._id)}
                                                className="h-4 w-4 cursor-pointer"
                                            />
                                            <div className='w-full h-14 py-1 px-3 rounded-md bg-secondary'>
                                            <span className="text-lg text-accent">{item.name}</span>
                                            <p className="w-full min-h-8 text-sm text-text flex items-start">{item.description}</p>
                                            </div>
                                        </label>
                                        
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No playlists found for the user</div>
                        )}
                    </div>
          
          <div className='w-full h-14 flex items-center justify-between p-2 mt-6'>
            <Link to={`/create-playlist/${videoId}`} className='w-60 h-12 rounded-md bg-primary hover:bg-accent text-text flex items-center justify-center'>Create Playlist </Link>
            <button
              className='w-60 h-12 rounded-md bg-primary hover:bg-accent text-text'
              disabled={selectedPlaylists.length === 0} // Disable if no playlists are selected
              onClick={handleAddVideoToMultiplePlaylists}
            > Add video </button>
          </div>
        </section>
        
    </main>
    </div>
  )
}

export default AddToPlaylist


/*<div className='w-full min-h-48 p-2 bg-secondary flex items-center justify-center'>
            {playlists.length ? (
            <div className='w-full h-full p-5 flex flex-col gap-1'>
              {playlists.map((item, index)=>(
                
                   <div key={index} className="w-full h-full flex flex-1 flex-col">
                      <span className='text-lg'>{item.name}</span>
                      <p className="w-full min-h-8 text-sm flex items-start">{item.description}</p>    
                    </div>
              
              ))}
            </div> )
            : 
            (<div>No playlists found for the user</div>)}
          </div>
 */