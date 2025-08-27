import multer from 'multer';  // multer'ı doğru şekilde içe aktarın
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// __dirname'i ES modüllerinde hesaplamak için
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads klasörünün yolunu al
const uploadDir = path.join(__dirname, '../uploads');

// Klasörün var olup olmadığını kontrol et, yoksa oluştur
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Dosyalar burada kaydedilecek
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Dosya adını benzersiz yap
  }
});

const upload = multer({ storage: storage });

export default upload;