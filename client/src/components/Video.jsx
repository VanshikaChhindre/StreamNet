import React from 'react'
import { useForm } from 'react-hook-form';
import Input from './Input';
import { useDropzone } from 'react-dropzone'


const Video = () => {

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isValid} } = useForm()
  const watchedVideoFile = watch('videoFile');
  const watchedThumbnail = watch('thumbnail');

  register('videoFile', { required: true, validate: (value) => value.size > 0 });
  register('thumbnail', { required: true, validate: (value) => value.size > 0 });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'video/*',
    onDrop: (acceptedFiles) => {
      setValue('videoFile', acceptedFiles[0]);  
    },
    multiple: false, 
  });

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setValue('thumbnail', acceptedFiles[0]);
    },
    multiple: false,
  });

  const videoFileUrl = watchedVideoFile ? URL.createObjectURL(watchedVideoFile) : null;
  const thumbnailUrl = watchedThumbnail ? URL.createObjectURL(watchedThumbnail) : null;

  const uploadVideo = (data)=>{
    console.log("helloe")
    console.log(data)
    const formData = new FormData();
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("thumbnail", data.thumbnail)
    formData.append("videoFile", data.videoFile)
    reset()

  }

  return (
    <div className='w-full min-h-screen bg-pink-400 flex items-end justify-end'>
        <main className='w-[80vw] min-h-[100vh] bg-slate-900 flex flex-col px-36 py-10'>

          <form onSubmit={(e) => {
                console.log('Form submitted');
                handleSubmit(uploadVideo)(e);
              }} className='mt-24 z-40'>
            <div
              {...getRootProps({ className: 'border-2 border-dashed border-gray-300 rounded-md p-4 gap-4 text-center cursor-pointer hover:border-gray-500 flex flex-col items-center justify-center'})}
              >
                <input {...getInputProps()} />
                <p className='text-gray-500'>Drag & drop a video file here, or click to select a file</p>

                {watchedVideoFile  && (
                  <div className='w-[30rem]'>
                    <video 
                    className='w-full h-auto'
                    controls
                    >
                      <source src={videoFileUrl} type="video/mp4"/>
                    </video>
                  </div>
                )}
            </div>

            <div
            {...getThumbnailRootProps({ className: 'border-2 border-dashed border-gray-300 rounded-md p-4 mt-4 text-center cursor-pointer hover:border-gray-500 flex flex-col items-center justify-center' })}
          >
            <input {...getThumbnailInputProps()} />
            <p className='text-gray-500'>Drag & drop a thumbnail image here, or click to select a file</p>
            {watchedThumbnail && (
              <div className='w-[20rem] mt-4'>
                <img 
                  src={thumbnailUrl} 
                  alt="Thumbnail preview"
                  className='w-full h-auto object-cover rounded-md'
                />
              </div>
            )}
          </div>

           <Input
           label = "Title"
           labelClassName = "text-white mt-4"
           placeholder = "Enter video title"
           {...register('title', { required: true })}
           />
           {errors.title && <p className="text-red-400">{errors.title.message}</p>}

            
           <Input
           textArea
           label = "Description"
           labelClassName = "text-white"
           placeholder = "Enter video description"
           name= "description"
           {...register('description', { required: true })}
           />
           {errors.description && <p className="text-red-400">{errors.description.message}</p>}

           <button type="submit" className="bg-blue-500 text-white p-2">
            Submit
          </button>
          {console.log('Form is valid:', isValid)}
          {console.log("errors", errors)}
          
         

            
          </form>
        </main>
    </div>
  )
}

export default Video



