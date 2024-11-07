import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

import { 
  useGetVideoByIdQuery, 
  useAddVideoToHistoryMutation, 
  useAddCommentMutation,
  useUserChannelQuery, 
  useVideoCommentsQuery,
  useAddVideoLikeMutation,
  useCheckVideoLikeQuery,
  useTotalVideoLikesQuery,
  useToggleSubscriptionMutation
} from '../features/auth/authApiSlice';

import { selectCurrentUser } from '../features/auth/authSlice';
import { ArrowDownIcon, ArrowForwardIcon, LikeIcon, SolidLikeIcon } from '../assets/navicons';

const VideoPlayer = () => {
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const user = useSelector(selectCurrentUser);
  const userId = user?._id;

  const [isDescriptionOpen, setDescriptionOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0)
  const [username, setUsername] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const [videoOwner, setVideoOwner] = useState({})
  const [videoLike, setVideoLike] = useState(null)
  const [totalVideoLikes, setTotalVideoLikes] = useState(0)

  const { data: videoData, isSuccess: isVideoLoaded } = useGetVideoByIdQuery(id);
  const { data: videoCommentsData, isSuccess: areCommentsLoaded } = useVideoCommentsQuery(id);
  const { data: videoLikeData, isSuccess: videoLikeLoaded } = useCheckVideoLikeQuery(id);
  const { data: videoLikes, isSuccess: isVideoLikesLoaded } = useTotalVideoLikesQuery(id);
  const { data: ownerChannelData, isSuccess: channelLoaded } = useUserChannelQuery(username, {
    skip: !username // Skip fetching if username is null
  });
  const [addVideoToHistory] = useAddVideoToHistoryMutation();
  const [addComment] = useAddCommentMutation();
  const [addVideoLike] = useAddVideoLikeMutation();
  const [toggleSubscription] = useToggleSubscriptionMutation();


  const handleAddComment = async (commentData) => {
    const newComment = { content: commentData.content, videoId: id, owner: userId };
    try {
      const response = await addComment(newComment).unwrap();
      setComments((prevComments) => [response.data, ...prevComments]);
      setTotalComments((prevTotal) => prevTotal + 1); 
      reset();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleVideoLike = async() => {
    try {
      const response = await addVideoLike(id).unwrap();
      console.log(response)
      if (response.data != null) {
        setVideoLike(true); // Video liked, set videoLike to true
        setTotalVideoLikes((prevTotal) => prevTotal + 1); 
      } else {
        setVideoLike(false); // Video unliked, set videoLike to false
        setTotalVideoLikes((prevTotal) => prevTotal - 1);
      }
      
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleSubscription = async() => {
    try {
      const response = await toggleSubscription(channelId).unwrap();
      console.log(response)
      
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    if (isVideoLoaded) {
      console.log('Video data:', videoData);
      setUsername(videoData.data.owner.username);
      setChannelId(videoData.data.owner._id)
      if (user) addVideoToHistory(id);
    }

    if(videoLikeLoaded){
      console.log("like details:", videoLikeData.data)
      if(videoLikeData.data.isLiked){
        setVideoLike(true)
      } else {
        setVideoLike(false)
      }
    }

    if(isVideoLikesLoaded){
      console.log("totalLikes:", videoLikes.data)
      setTotalVideoLikes(videoLikes.data.totalDocs)
    }

    if(channelLoaded){
      console.log("channel details fetched", ownerChannelData)
      setVideoOwner(ownerChannelData.data)
    }

    if (areCommentsLoaded) {
      console.log("Comments:", videoCommentsData);
      setTotalComments(videoCommentsData.data.totalDocs)
      setComments(videoCommentsData.data.docs);
    }
  }, [id, isVideoLoaded, user, areCommentsLoaded, channelLoaded, videoCommentsData, isVideoLikesLoaded, addVideoToHistory]);
  

  return (
    <div className="w-full min-h-screen bg-background flex items-end justify-end">
      <main className="w-[79vw] min-h-[100vh] bg-background flex mt-[4rem] p-4 justify-center items-center z-40">
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
                className="w-full min-h-28 bg-background border-b border-t border-gray-700 text-text flex pt-2 pb-4 px-6 flex-col"
              >
                <div className='w-full flex h-8  justify-between items-center'>
                  <span className="text-2xl font-semibold">{videoData.data.title}</span>
                  <button onClick={() => setDescriptionOpen(!isDescriptionOpen)}>{isDescriptionOpen ? <ArrowDownIcon /> : <ArrowForwardIcon />}</button>
                </div>
                <div className='w-full h-18 flex items-center justify-center gap-2'>
                  <button className='w-14 h-14 border border-gray-700 rounded-full flex items-center justify-center'
                  onClick={handleVideoLike}> 
                  {videoLike? <SolidLikeIcon className='w-6 h-6' /> : <LikeIcon className='w-6 h-6' />}</button>
                  <span>{totalVideoLikes}</span>
                </div>
              </div>
              {isDescriptionOpen && (
                <div className="w-full min-h-20 px-5 py-2 bg-background text-text flex flex-col border-b border-gray-700">
                  <h2 className='text-xl font-semibold'>Description</h2>
                  <span>{videoData.data.description}</span>
                  <span>Uploaded on : {format(new Date(videoData.data.createdAt), 'dd-MM-yyyy, HH:mm aa')}</span>
                </div>
              )}
              {/*user profile*/}
              <div className='w-full h-20 bg-background px-5 py-4 text-text flex'>
                <span 
                className="w-[80%] min-h-[5rem] flex items-start gap-2 bg-secondary/25 text-text"
                >
                      {/* owner Avatar */}
                      <div className="w-20 h-20 flex items-start justify-center">
                        <span 
                          className="w-12 h-12 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${videoOwner.avatar?.url}')` }} 
                        />
                      </div>

                      {/* owner details Details */}
                      <div className="w-[62rem] h-full flex flex-col">
                        <div className="w-60 h-6 flex gap-1 text-text text-lg">
                        <span className="text-accent">{videoOwner.fullName}</span>
                        <span>@{videoOwner.username}</span>
                        </div>
                        <div className="w-60 min-h-8 flex flex-col gap-1 ">
                          <p className="w-full min-h-8 flex items-center">Subscribers : {videoOwner.subscribersCount}</p>
                        </div>
                      </div>
                </span>
                <button className='w-[20%] h-10 bg-red-700 rounded-md flex items-center justify-center'
                onClick={handleSubscription}>
                  Subscribe
                </button>
              </div>

              {/* Comment Section */}
              <div className="w-full min-h-64 p-5 flex flex-col gap-3 bg-background">
              <h2 className='h-8 text-text text-xl font-semibold'>Comments ( {totalComments} )</h2>
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
                <div className="w-full min-h-44  py-2 flex flex-col gap-2">
                  {comments.map((comment, index) => (
                    <div 
                      key={index} 
                      className="w-full h-[4rem] flex items-start gap-2 bg-secondary/25 text-text"
                    >
                      {/* User Avatar */}
                      <div className="w-20 h-20 flex items-start justify-center">
                        <span 
                          className="w-12 h-12 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${comment.owner?.avatar?.url}')` }} 
                        />
                      </div>

                      {/* Comment Details */}
                      <div className="w-[62rem] h-full flex flex-1 flex-col">
                        <div className="w-60 h-6 flex gap-2 text-primary">
                          <span>@{comment.owner.username}</span>
                          <p className="h-full text-xs text-gray-500 flex items-center justify-center">
                            {format(new Date(comment.createdAt), 'dd-MM-yyyy, HH:mm aa')}
                          </p>
                        </div>
                        <div className="w-full min-h-8 flex flex-col">
                          <p className="w-full min-h-8 flex items-start">{comment.content}</p>
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
