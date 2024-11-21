import React from 'react';
import Input from './Input';
import { useForm } from 'react-hook-form';
import { useCreatePlaylistMutation } from '../features/auth/authApiSlice';
import { useNavigate, useParams } from 'react-router-dom';

const CreatePlaylist = () => {
  const { register, handleSubmit, reset, formState:{errors, isValid}} = useForm()
  const navigate = useNavigate();
  const {videoId} = useParams();

  const [createPlaylist] = useCreatePlaylistMutation();

  const handleCreatePlaylist = async(data) => {
    const playlistData = {
      name: data.name,
      description: data.description,
    }

    try {
      const response = await createPlaylist(playlistData).unwrap();
      console.log(response.data);
      console.log("Playlist creation successful");
      reset();
      navigate(`/add-to-playlist/${videoId}`)
      
    } catch (error) {
      console.log(error.message)
    } 
  } 
  

  return (
    <div className="w-full min-h-screen bg-background flex items-end justify-end">
    <main className="w-[80vw] min-h-[90vh] flex mt-[4rem] p-4 justify-center z-40">
      <section className='w-[50vw] h-96 text-text p-5 bg-slate-600'>
        <h1 className='w-full h-10 text-2xl'>Create Playlist</h1>
        <form onSubmit={handleSubmit(handleCreatePlaylist)} >
              <container className='w-full h-full flex flex-col '>
                  <Input
                    label = "Name"
                    type = "text"
                    placeholder = "Enter title"
                    {...register('name', {
                      required: true
                    })}
                  />
                  {errors.name && <p className="text-red-400">{errors.name.message}</p> }

                  <label className='text-text inline-block mb-1 pl-2' htmlFor='description'>Description</label>
                  <textarea
                    rows="4"
                    className={` w-full text-black border border-gray-300 rounded-md p-2 outline-none `}
                    placeholder="Enter description here"
                    name = "description"
                    {...register("description", { required: true })}>
                  </textarea> 
                  {errors.description && <p className="text-red-400">{errors.description.message}</p>}

                  

                   <div className='w-full h-16 flex items-center justify-center'>
                    <button className='w-32 h-9 text-white bg-green-500 rounded-md hover:bg-green-600 cursor-pointer'  disabled={!isValid}>Create Playlist</button>
                  </div> 
                  
              </container>

            </form>
      </section>
    </main>
    </div>
  )
}

export default CreatePlaylist