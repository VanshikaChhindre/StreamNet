import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadToCloudinary = async (localFilePath)=>{
    try{
    if(!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, { 
        resource_type: 'auto'
    })
    console.log("File is uploaded to Cloudinary", response.url);
    fs.unlinkSync(localFilePath)
    return {
        url: response.url,
        public_id: response.public_id
    };
    } catch(error){
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const getVideoMetadata = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId, { resource_type: 'video', media_metadata: true, });
    return result.duration; // Duration in seconds
  } catch (error) {
    console.error('Error fetching video metadata:', error);
  }
};

const deleteFromCloudinary = async (publicId) => {
    try {
      if (!publicId) return null
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error('Failed to delete from Cloudinary');
    }
  };


export {uploadToCloudinary, getVideoMetadata, deleteFromCloudinary}


  
  
  