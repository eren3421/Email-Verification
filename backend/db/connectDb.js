import mongoose from "mongoose"
export const connectDb=async()=>{
	try{
 	    const conn=await mongoose.connect(process.env.MONGODB_URI)
	    console.log("Bağlantı oluşturuldu",conn.connection.host);
	}
	catch(err){
	    console.log("Hata oldu",err.message);
	    console.log(process.env.MONGODB_URI);
	    process.exit(1);
	}
}