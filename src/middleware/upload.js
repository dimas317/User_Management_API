import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("File must be JPG, JPEG, or PNG"), false);
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2 MB
});

export default upload;
