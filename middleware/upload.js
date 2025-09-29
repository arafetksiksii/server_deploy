const multer = require("multer");
const path = require("path");
const Client = require("ssh2-sftp-client");
require("dotenv").config();

// SFTP config
const sftpConfig = {
  host: process.env.OVH_HOST,
  port: Number(process.env.OVH_PORT) || 22,
  username: process.env.OVH_USER,
  password: process.env.OVH_PASS
};

const localTmp = path.join(__dirname, "../tmp/uploads");

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, localTmp); // save locally first
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Override `.put` so every uploaded file is sent to OVH
const originalMulter = upload.array.bind(upload);

upload.array = function(fieldName, maxCount) {
  const middleware = originalMulter(fieldName, maxCount);

  return async function(req, res, next) {
    middleware(req, res, async function(err) {
      if (err) return next(err);

      if (req.files && req.files.length > 0) {
        const sftp = new Client();
        try {
          await sftp.connect(sftpConfig);

          await Promise.all(req.files.map(file => {
            const remotePath = `${process.env.OVH_UPLOAD_PATH}/${file.originalname}`;
            return sftp.put(file.path, remotePath);
          }));

          await sftp.end();
          console.log("✅ All files uploaded to OVH successfully");
        } catch (err) {
          console.error("❌ SFTP upload error:", err.message);
        }
      }

      next();
    });
  };
};

module.exports = upload;
