const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    if (file.size > 20000000) {
      cb(new Error("Video file too large. Please upload videos smaller than 20MB."), false);
    } else {
      cb(null, true);
    }
  } else if (file.mimetype.startsWith("image/")) {
    if (file.size > 2000000) {
      cb(new Error("Image file too large. Please upload images smaller than 2MB."), false);
    } else {
      cb(null, true);
    }
  } else {
    cb(new Error("Unsupported file type! Please upload only images or videos."), false);
  }
};

const uploadMedia = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20000000 },
});

module.exports = uploadMedia;
