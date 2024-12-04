import { v2 as cloudinary } from 'cloudinary';

export const fileUploader = async (file) => {
    try {
        
        const fileResult = await cloudinary.uploader.upload(file.path,{
              
                  resource_type: 'auto', 
                  folder: 'ticket-attachments', 
                
          })

          if(fileResult){
            return fileResult.secure_url;
          }

    }catch(error) {
        console.log(error);  
    }

}