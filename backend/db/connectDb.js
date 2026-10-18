import mongoose from "mongoose"
export const connectDb=async()=>{
	try{
	    if (!process.env.MONGODB_URI) {
	        throw new Error("MONGODB_URI ortam değişkeni tanımlı değil");
	    }
	    const conn=await mongoose.connect(process.env.MONGODB_URI)
	    console.log("Bağlantı oluşturuldu",conn.connection.host);
	    return conn;
	}
	catch(err){
	    console.error("Veritabanı bağlantı hatası:",err.message);
	    throw err;
	}
}
