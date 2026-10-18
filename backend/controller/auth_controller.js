import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenandSetCookie } from "../utils/generateTokenandSetCookie.js";
import {
  sendResetPasswordEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mail/emails.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isVerified: user.isVerified,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});

export const signup = async (req, res) => {
  const { name: rawName, email: rawEmail, password } = req.body ?? {};
  const name = rawName?.trim();
  const email = rawEmail?.trim().toLowerCase();

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Ad, e-posta ve parola gereklidir" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Parola en az 8 karakter olmalıdır" });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(409).json({ success: false, message: "Bu e-posta adresi zaten kayıtlı" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = crypto.randomInt(100000, 1000000).toString();
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      await user.deleteOne();
      throw error;
    }

    generateTokenandSetCookie(res, user._id);
    return res.status(201).json({
      success: true,
      message: "Hesabın oluşturuldu. E-postana gönderdiğimiz kodla doğrulamayı tamamla.",
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Hesap oluşturulamadı" });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body ?? {};
  try {
    if (!code) {
      return res.status(400).json({ success: false, message: "Doğrulama kodu gereklidir" });
    }
    if (!/^\d{6}$/.test(String(code))) {
      return res.status(400).json({ success: false, message: "Doğrulama kodu 6 haneli olmalıdır" });
    }

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: "Kod geçersiz veya süresi dolmuş" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "E-posta adresin doğrulandı",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("E-posta doğrulama hatası:", error);
    return res.status(500).json({ success: false, message: "E-posta doğrulanırken bir sorun oluştu" });
  }
};

export const login = async (req, res) => {
  const { email: rawEmail, password } = req.body ?? {};
  const email = rawEmail?.trim().toLowerCase();

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "E-posta ve parola gereklidir" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "E-posta veya parola hatalı" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "E-posta veya parola hatalı" });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        message: "Giriş yapmadan önce e-posta adresini doğrula",
      });
    }

    user.lastLogin = Date.now();
    await user.save();
    generateTokenandSetCookie(res, user._id);
    return res.status(200).json({
      success: true,
      message: "Giriş başarılı",
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Giriş yapılamadı" });
  }
};

export const logout = async (_req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Oturum kapatıldı" });
};

export const forgotPassword = async (req, res) => {
  const email = req.body?.email?.trim().toLowerCase();
  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "E-posta adresi gereklidir" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Bu e-posta adresiyle eşleşen hesap bulunamadı" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    await sendResetPasswordEmail(user.email, resetToken, resetUrl);
    return res.status(200).json({ success: true, message: "Parola yenileme bağlantısı e-posta adresine gönderildi" });
  } catch (error) {
    console.error("Parola yenileme e-postası gönderilemedi:", error);
    return res.status(500).json({ success: false, message: "Parola yenileme e-postası gönderilemedi" });
  }
};

export const resetPassword = async (req, res) => {
  const { password } = req.body ?? {};
  try {
    if (!password) {
      return res.status(400).json({ success: false, message: "Yeni parola gereklidir" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Parola en az 8 karakter olmalıdır" });
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: "Bağlantı geçersiz veya süresi dolmuş" });
    }

    user.password = await bcryptjs.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    await user.save();
    try {
      await sendResetSuccessEmail(user.email);
    } catch (emailError) {
      console.error("Parola değişti ancak bilgilendirme e-postası gönderilemedi:", emailError.message);
    }

    return res.status(200).json({ success: true, message: "Parolan başarıyla yenilendi" });
  } catch (error) {
    console.error("Parola yenileme hatası:", error);
    return res.status(500).json({ success: false, message: "Parola yenilenirken bir sorun oluştu" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    return res.status(200).json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error("Oturum kontrolü hatası:", error);
    return res.status(500).json({ success: false, message: "Oturum doğrulanamadı" });
  }
};
