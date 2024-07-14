import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadToCloudinary = async (localFilePath)=>{
    try{
    if(!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, { 
        resource_type: 'auto'
    })
    console.log("File is uploaded to Cloudinary", response.url);
    return response;
    } catch(error){
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {uploadToCloudinary}