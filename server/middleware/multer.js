import multer from 'multer';    

const storage = multer.diskStorage({

    destination : (req, file, cb) => {

        cb(null, "uploads")
    },
    filename : (req, file, cb) => {

        // Generate random string
        const generateRandomText = Date.now() + '_' + Math.round(Math.random() * 10);
        
        // Get extension from the file
        const getExtensionOfFile = file.originalname.split('.')[1];

        // Create new image string
        let modifiedImageString = `${generateRandomText}.${getExtensionOfFile}`;
        cb(null, modifiedImageString);
        
    }
})


const upload = multer({storage:storage});
export default upload;