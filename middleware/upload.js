const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Client = require("ssh2-sftp-client");
const sharp = require("sharp"); // <-- add sharp
require("dotenv").config();

// SFTP config
const sftpConfig = {
  host: process.env.OVH_HOST,
  port: Number(process.env.OVH_PORT) || 22,
  username: process.env.OVH_USER,
  password: process.env.OVH_PASS,
};

// Public base URL for your uploads (adjust to your domain)
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "https://novotef.com/uploads/events";

// Local tmp folder (needed for Vercel/OVH)
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

// --- Helper: compress large images (>8MB) ---
async function compressIfLarge(file) {
  const stats = fs.statSync(file.path);
  if (stats.size > 8 * 1024 * 1024) { // >8 MB
    console.log(`⚡ Compressing large image: ${file.originalname}`);

    const ext = path.extname(file.originalname).toLowerCase();
    const optimizedPath = file.path.replace(ext, `-optimized${ext}`);

    await sharp(file.path)
      .resize({ width: 1920, withoutEnlargement: true }) // max width 1920px
      .jpeg({ quality: 80 }) // convert to jpeg at 80% quality
      .toFile(optimizedPath);

    fs.unlinkSync(file.path); // delete original
    file.path = optimizedPath;
  }
  return file;
}

// --- Override .single() ---
const originalSingle = upload.single.bind(upload);
upload.single = function (fieldName) {
  const middleware = originalSingle(fieldName);

  return async function (req, res, next) {
    middleware(req, res, async function (err) {
      if (err) return next(err);
      if (!req.file) return next();

      try {
        // compress if too big
        await compressIfLarge(req.file);

        const sftp = new Client();
        await sftp.connect(sftpConfig);
        await sftp.mkdir(process.env.OVH_UPLOAD_PATH, true);

const ext = path.extname(req.file.originalname) || ".jpg";
const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
const filename = uniqueName;
        const remotePath = `${process.env.OVH_UPLOAD_PATH}/${filename}`;

        // Upload to OVH
        await sftp.put(req.file.path, remotePath);
        await sftp.end();

        // Replace with public URL for DB
        req.file.url = `${PUBLIC_BASE_URL}/${filename}`;
        req.file.path = req.file.url; // controller will now store the URL

        console.log("✅ File uploaded to OVH:", req.file.url);
        next();
      } catch (err) {
        console.error("❌ SFTP upload error:", err.message);
        return next(err);
      }
    });
  };
};

// --- Override .array() ---
const originalArray = upload.array.bind(upload);
upload.array = function (fieldName, maxCount) {
  const middleware = originalArray(fieldName, maxCount);

  return async function (req, res, next) {
    middleware(req, res, async function (err) {
      if (err) return next(err);
      if (!req.files || req.files.length === 0) return next();

      try {
        // compress large ones
        await Promise.all(req.files.map(compressIfLarge));

        const sftp = new Client();
        await sftp.connect(sftpConfig);
        await sftp.mkdir(process.env.OVH_UPLOAD_PATH, true);

        await Promise.all(
          req.files.map(async (file) => {
            const filename = file.originalname;
            const remotePath = `${process.env.OVH_UPLOAD_PATH}/${filename}`;

            await sftp.put(file.path, remotePath);

            // Replace with public URL for DB
            file.url = `${PUBLIC_BASE_URL}/${filename}`;
            file.path = file.url;
          })
        );

        await sftp.end();
        console.log("✅ All files uploaded to OVH and URLs ready");
        next();
      } catch (err) {
        console.error("❌ SFTP upload error:", err.message);
        return next(err);
      }
    });
  };
};

module.exports = upload;
