const fs = require("fs");
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

// Use /tmp/uploads for Vercel
const localTmp = path.join("/tmp", "uploads");

// Ensure folder exists
if (!fs.existsSync(localTmp)) {
  fs.mkdirSync(localTmp, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, localTmp),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

// Override .array to upload to OVH
const originalMulter = upload.array.bind(upload);

upload.array = function (fieldName, maxCount) {
  const middleware = originalMulter(fieldName, maxCount);

  return async function (req, res, next) {
    middleware(req, res, async function (err) {
      if (err) return next(err);

      if (!req.files || req.files.length === 0) return next();

      const sftp = new Client();
      try {
        await sftp.connect(sftpConfig);
        await Promise.all(
          req.files.map((file) =>
            sftp.put(file.path, `${process.env.OVH_UPLOAD_PATH}/${file.originalname}`)
          )
        );
        await sftp.end();
        console.log("✅ All files uploaded to OVH successfully");
        next();
      } catch (err) {
        console.error("❌ SFTP upload error:", err.message);
        return next(err);
      }
    });
  };
};

module.exports = upload;
