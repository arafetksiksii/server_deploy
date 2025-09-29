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
  password: process.env.OVH_PASS,
};

// Local tmp folder for Vercel
const localTmp = path.join("/tmp", "uploads");
if (!fs.existsSync(localTmp)) {
  fs.mkdirSync(localTmp, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, localTmp),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

// --- Override .single() ---
const originalSingle = upload.single.bind(upload);

upload.single = function (fieldName) {
  const middleware = originalSingle(fieldName);

  return async function (req, res, next) {
    middleware(req, res, async function (err) {
      if (err) return next(err);
      if (!req.file) return next();

      const sftp = new Client();
      try {
        await sftp.connect(sftpConfig);
        await sftp.mkdir(process.env.OVH_UPLOAD_PATH, true);

        const remotePath = `${process.env.OVH_UPLOAD_PATH}/${req.file.originalname}`;
        await sftp.put(req.file.path, remotePath);
        await sftp.end();

        // Replace local path with OVH path for DB
        req.file.url = remotePath;
        req.file.path = remotePath; // so your controller uses it automatically

        console.log("✅ File uploaded to OVH:", remotePath);
        next();
      } catch (err) {
        console.error("❌ SFTP upload error:", err.message);
        return next(err);
      }
    });
  };
};

// --- Override .array() too for multiple files ---
const originalArray = upload.array.bind(upload);
upload.array = function (fieldName, maxCount) {
  const middleware = originalArray(fieldName, maxCount);

  return async function (req, res, next) {
    middleware(req, res, async function (err) {
      if (err) return next(err);
      if (!req.files || req.files.length === 0) return next();

      const sftp = new Client();
      try {
        await sftp.connect(sftpConfig);
        await sftp.mkdir(process.env.OVH_UPLOAD_PATH, true);

        await Promise.all(
          req.files.map(async (file) => {
            const remotePath = `${process.env.OVH_UPLOAD_PATH}/${file.originalname}`;
            await sftp.put(file.path, remotePath);
            file.url = remotePath;
            file.path = remotePath; // update path for DB
          })
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
