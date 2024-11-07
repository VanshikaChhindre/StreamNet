import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

import { 
  useGetVideoByIdQuery, 
  useAddVideoToHistoryMutation, 
  useAddCommentMutation, 
  useVideoCommentsQuery 
} from '../features/auth/authApiSlice';

import { selectCurrentUser } from '../features/auth/authSlice';
import { ArrowDownIcon, ArrowForwardIcon } from '../assets/navicons';

const VideoPlayer = () => {
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const user = useSelector(selectCurrentUser);
  const userId = user?._id;

  const { data: videoData, isSuccess: isVideoLoaded } = useGetVideoByIdQuery(id);
  const { data: videoCommentsData, isSuccess: areCommentsLoaded } = useVideoCommentsQuery(id);
  const [addVideoToHistory] = useAddVideoToHistoryMutation();
  const [addComment] = useAddCommentMutation();

  const [isDescriptionOpen, setDescriptionOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const handleAddComment = async (commentData) => {
    const newComment = { content: commentData.content, videoId: id, owner: userId };
    try {
      const response = await addComment(newComment).unwrap();
      setComments((prevComments) => [response.data, ...prevComments]);
      reset();
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (isVideoLoaded) {
      console.log('Video data:', videoData);
      if (user) addVideoToHistory(id);
    }

    if (areCommentsLoaded) {
      console.log("Comments:", videoCommentsData);
      setComments(videoCommentsData.data.docs);
    }
  }, [id, isVideoLoaded, user, areCommentsLoaded, videoCommentsData, addVideoToHistory]);

  return (
    <div className="w-full min-h-screen bg-pink-400 flex items-end justify-end">
      <main className="w-[79vw] min-h-[100vh] bg-slate-900 flex mt-[4rem] p-4 justify-center items-center z-40">
        <section className="w-[50rem] min-h-[100vh] bg-slate-300 rounded-xl overflow-hidden">
          {isVideoLoaded && videoData?.data ? (
            <div>
              {/* Video Player */}
              <div className="w-[50rem] h-[28.1rem] bg-slate-200">
                <video 
                  controls 
                  autoPlay 
                  loop 
                  src={videoData.data.videoFile.url} 
                  className="w-full h-auto" 
                />
              </div>
              
              {/* Video Title and Description */}
              <div
                className="w-full min-h-20 bg-red-400 text-text flex py-4 px-6 justify-between items-center"
              >
                <span className="text-2xl font-semibold">{videoData.data.title}</span>
                <button onClick={() => setDescriptionOpen(!isDescriptionOpen)}>{isDescriptionOpen ? <ArrowDownIcon /> : <ArrowForwardIcon />}</button>
              </div>
              {isDescriptionOpen && (
                <div className="w-full min-h-20 p-5 bg-slate-700 flex flex-col">
                  <span>{videoData.data.description}</span>
                  <span>{format(new Date(videoData.data.createdAt), 'dd-MM-yyyy, HH:mm aa')}</span>
                </div>
              )}
              {/*user profile*/}
              <div className='w-full h-20 bg-blue-500 text-text p-5 flex'>

              </div>

              {/* Comment Section */}
              <div className="w-full min-h-64 p-5 flex flex-col gap-3 bg-yellow-300">
                {/* Comment Form */}
                <form className="w-full flex gap-2" onSubmit={handleSubmit(handleAddComment)}>
                  <input
                    className="w-[90%] h-10 text-black outline-none p-1"
                    placeholder="Add a comment"
                    {...register("content", { required: true })}
                  />
                  <button type="submit" className="w-[10%] h-10 rounded-md bg-slate-500">Add</button>
                </form>

                {/* Display Comments */}
                <div className="w-full min-h-44 bg-red-500 py-2 flex flex-col gap-2">
                  {comments.map((comment, index) => (
                    <div 
                      key={index} 
                      className="w-full min-h-[5rem] flex items-start gap-2 bg-secondary/25 text-text"
                    >
                      {/* User Avatar */}
                      <div className="w-20 h-20 flex items-start justify-center">
                        <span 
                          className="w-12 h-12 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${comment.owner?.avatar?.url}')` }} 
                        />
                      </div>

                      {/* Comment Details */}
                      <div className="w-[62rem] h-full flex flex-col">
                        <div className="w-60 h-6 flex gap-3 text-primary">
                          <span>@{comment.owner.username}</span>
                        </div>
                        <div className="w-full min-h-8 flex flex-col gap-1">
                          <p className="w-full min-h-8 flex items-center">{comment.content}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(comment.createdAt), 'dd-MM-yyyy, HH:mm aa')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default VideoPlayer;
