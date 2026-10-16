import jwt from "jsonwebtoken";
export const verifyToken=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({success:false,message:"Token Yok"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.userId;
        if(!decoded){
            return res.status(401).json({success:false,message:"Tokenla oynanmış!!!"});
        }
        next();
    }catch(error){
        console.log("Token doğrulanamadı",error);
        res.status(500).json({success:false,message:"Sunucu Hatası"});
    }
};