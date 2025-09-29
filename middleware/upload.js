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

// Override .array to handle SFTP upload
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

        // Ensure remote folder exists
        await sftp.mkdir(process.env.OVH_UPLOAD_PATH, true);

        // Upload files to OVH
        await Promise.all(
          req.files.map(async (file) => {
            const remotePath = `${process.env.OVH_UPLOAD_PATH}/${file.originalname}`;
            await sftp.put(file.path, remotePath);

            // Replace local path with OVH path for database
            file.url = remotePath;
          })
        );

        await sftp.end();
        console.log("✅ All files uploaded to OVH successfully");

        // Replace req.files paths so controllers save OVH path
        req.files = req.files.map((f) => ({
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
          url: f.url, // OVH path
        }));

        next();
      } catch (err) {
        console.error("❌ SFTP upload error:", err.message);
        return next(err);
      }
    });
  };
};

module.exports = upload;
