const jwt = require('jsonwebtoken');

const JWT_SECRET = '#11%6@2001';

module.exports = (req,res,next) => {
    // get token and give userId according to that token
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({"error" : "Please authenticate using valid token"});

    
    try {
        const data = jwt.verify(token , JWT_SECRET);  
        req.user = data.user; 
        next();
    } catch (error) {
        return res.status(401).json({"error" : "Please authenticate using valid token"});
    }
}