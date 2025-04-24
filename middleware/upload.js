const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "events",
    format: "png", // force a format or use: path.extname(file.originalname).substring(1)
    public_id: file.originalname.split(".")[0], // name without extension
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  }),
});

const upload = multer({ storage });

module.exports = upload;
