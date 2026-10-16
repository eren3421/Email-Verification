import {User} from "../models/User.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import {generateTokenandSetCookie} from "../utils/generateTokenandSetCookie.js";
import {sendWelcomeEmail} from "../mail/emails.js";
import {sendVerificationEmail} from "../mail/emails.js";
import {sendResetSuccessEmail} from "../mail/emails.js";
import {sendResetPasswordEmail} from "../mail/emails.js";
export const signup= async(req,res)=>{
	const {email,password,name}=req.body;
	try{
		if(!email || !password || !name){
			throw new Error("Bilgiler eksik");
		}
		const userAlreadyExists=await User.findOne({email});
		if(userAlreadyExists){
			return res.status(409).json({success:false,message:"Kullanıcı zaten mevcut"});
		}
		const hashedPassword=await bcryptjs.hash(password,10);
		const verificationToken= Math.floor(100000 + Math.random() * 900000).toString();
		const user=new User({name,email,password:hashedPassword,
		verificationToken,verificationTokenExpireAt:Date.now()+24*60*60*1000});
		await user.save();
		generateTokenandSetCookie(res,user._id);
		sendVerificationEmail(user.email,verificationToken);
		res.status(201).json({
			success:true,
			message:"Kullanıcı oluşturuldu",
			user:{
				...user._doc,
				password:undefined
			}
		})
	}catch(error){
		return res.status(400).json({success:false,message:error.message});
	}
};
export const verifyEmail=async(req,res)=>{
	const {code}=req.body;
	try{
		const user=await User.findOne({verificationToken:code,verificationTokenExpireAt:{$gt:Date.now()}});
		if(!user){
			return res.status(400).json({success:false,message:"Geçersiz veya Tarihi Geçmiş Kod"});
		}
		user.isVerified=true;
		user.verificationToken=undefined;
		user.verificationTokenExpireAt=undefined;
		await user.save();
		await sendWelcomeEmail(user.email,user.name);
		res.status(200).json({success:true,message:"Email onaylandı",user:{...user._doc,password:undefined}});
	}catch(error){
		console.log("Hata",error);
		res.status(500).json({success:false,message:" DoğrulamadaSistem hatası"});
	}
}
export const login= async(req,res)=>{
	const {email,password}=req.body;
	try{
		if(!email || !password){
			res.status(400).json({success:false,message:"Bilgiler eksik"});
		}
		const user=await User.findOne({email});
		if(!user){
			res.status(400).json({success:false,message:"Kullanıcı bulunamadı"});
		}
		const isPasswordCorrect=await bcryptjs.compare(password,user.password);
		if(!isPasswordCorrect){
			res.status(400).json({success:false,message:"Parola Yanlış"});
		}
		generateTokenandSetCookie(res,user._id);
		user.lastLogin=Date.now();
		await user.save();
		res.status(200).json({success:true,message:"Giriş Yapıldı",user:{...user._doc,password:undefined}});
	}catch(error){
		return res.status(500).json({success:false,message:error.message});
	}
};
export const logout= async(req,res)=>{
	res.clearCookie("token");
	res.status(200).json({success:true,message:"Cıkıs Yapıldı"});
};
export const forgotPassword= async(req,res)=>{
	const {email}=req.body;
	try{
	const user= await User.findOne({email});
	if(!user){
		res.status(400).json({success:false,message:"Kullanıcı bulunamadı"});
	}
	const resetToken=crypto.randomBytes(20).toString("hex");
	const resetTokenExpiresAt=Date.now()+60*60*1000;
	user.resetPasswordToken=resetToken;
	user.resetPasswordExpireAt=resetTokenExpiresAt;
	await user.save();
	await sendResetPasswordEmail(user.email,resetToken,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
	res.status(200).json({success:true,message:"Resetleme Maili Gonderildi"});
	}catch(error){
		console.log("Mail resetleme hatası",error);
		res.status(500).json({success:false,message:error.message});
	}
};
export const resetPassword=async(req,res)=>{
	try{
		const {token}=req.params;
		const password=req.body;
		const user=await User.findOne({resetPasswordToken:token,resetPasswordExpireAt:{$gt:Date.now()}});
		if(!user){
			res.status(400).json({success:false,message:"Gecersiz veya Tarihi Geçmiş Kod"});
		}
		const hashedPassword=await bcryptjs.hash(password,10);
		user.password=hashedPassword;
		user.resetPasswordToken=undefined;
		user.resetPasswordExpireAt=undefined;
		await user.save();
		await sendResetSuccessEmail(user.email);
		res.status(200).json({success:true,message:"Parola Yenileme Basarılı"});
	}catch(error){
		console.log("Şifre yenilemede hata var",error);
		res.status(500).json({success:false,message:"Şifre yenilemede hata var"});
	}
};
export const checkAuth=async(req,res)=>{
	try{
		const user=await User.findById(req.userId);
		if(!user){
			res.status(400).json({success:false,message:"Kullanıcı bulunamadı"});
		}
		res.status(200).json({success:true,user:{...user._doc,password:undefined}});
	}catch(error){
		console.log("Check Auth fonksiyonunda hata var");
		res.status(400).json({success:false,message:error.message});
	}
}