const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "serverdeploy",
  api_key: "963653239374934",
  api_secret: "dqlnmM2xMZoqviufnuthOFxp76k",
});

module.exports = cloudinary;
