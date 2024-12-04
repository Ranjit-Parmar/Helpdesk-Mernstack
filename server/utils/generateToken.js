import jwt from 'jsonwebtoken';

// Generate jsonwebtoken for the users;
export const generateToken =  (id) => {

    return jwt.sign({id:id},process.env.JWT_SECRET_KEY,{
        expiresIn : process.env.JWT_EXPIRE  
    })
}

//  Verify token
export const verifyAccessToken = (token) => {
    return jwt.verify(token,process.env.JWT_SECRET_KEY);
}
