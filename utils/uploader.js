const cloudinary = require('cloudinary');
const streamifier = require('streamifier');

module.exports = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((result, err) => {
      if (err) return reject(err);
      resolve(result);
    });

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}
