import {mailtrapClient,sender} from "./mailtrap.js";
import {VERIFICATION_EMAIL_TEMPLATE} from "./emailTemplate.js";
import {PASSWORD_RESET_REQUEST_TEMPLATE} from "./emailTemplate.js";
import {PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplate.js";
export const sendVerificationEmail=async(email,verificationToken)=>{
    const recipient=[{email}];
    try{
        const response=await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject:"Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"email_verification"
        })
        console.log("Email başarıyla gönderildi",response);
    }catch(error){
        console.log("Email gönderme hatası",error);
        throw error;
    }
}
export const sendWelcomeEmail=async(email,name)=>{
    const recipient=[{email}];
    try{
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Uygulamaya Hoşgeldin",
            template_uuid: "30cb0297-2311-4476-a000-ed499c04b759",
            template_variables:{
                name:name
            }
            
        });
        console.log("Hoşgeldin Maili Yollandı");
    }catch(error){
        console.log("Hoş geldin e-postası gönderilemedi",error);
    }
}
export const sendResetPasswordEmail=async(email,resetToken,link)=>{
    const recepient =[{email}];
    try{
        const response=await mailtrapClient.send({
            from:sender,
            to:recepient,
            subject:"Şifreni Yenile",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",link),
            category:"password_reset"
        })
    }catch(error){
        console.log("Hata var",error);
        throw new Error(`Resetleme e-postası gönderilemedi: ${error.message}`,{cause:error});
    }
}
export const sendResetSuccessEmail=async(email)=>{
    const recepient=[{email}];
    try{
        const response=await mailtrapClient.send({
            from:sender,
            to:recepient,   
            subject:"Şifreni Yenileme Basarılı",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Şifre Yenileme Başarılı"
        });
        console.log("Şifre Yenileme maili başarıyla gönderildi",response);
    }catch(error){
        console.log("Şifre Yenileme başarılı maili gönderme hatası",error);
        throw new Error(`Şifre Yenileme başarılı maili gönderme hatası${error}`);
    }
};
