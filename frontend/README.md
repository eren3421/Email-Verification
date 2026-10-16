# Nora frontend

React, Vite ve Tailwind CSS 3 ile hazırlanmış Türkçe hesap arayüzü.

## Geliştirme

Backend'i `http://localhost:3000` adresinde çalıştır, ardından bu klasörde:

```sh
npm run dev
```

Vite, `/api` isteklerini geliştirme sırasında backend'e yönlendirir. Farklı bir API adresi kullanıyorsan `VITE_API_URL` tanımla; değer `/api` içeren kök API adresi olmalıdır (ör. `https://api.example.com/api`).

## Akışlar

- Giriş ve çıkış
- Hesap oluşturma ve e-posta doğrulama kodu
- Şifre sıfırlama bağlantısı isteme ve yeni şifre belirleme
- Oturum kontrolü ve kullanıcı paneli
