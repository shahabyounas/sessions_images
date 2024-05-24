const express = require("express");
const path = require("path");
const appRouter = express.Router();
const { getImageExtension, randomStringGenerator } = require("../utils");
const { uploadImage, getObjectSignedUrl, getS3Objects } = require("./s3");

appRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "This is root path, use the /images API to upload image file",
  });
});

/**
 *  @param { String } imageUrl
 *
 */

async function validation(req, res, next) {
  const body = req.body;

  const { imageUrl } = body;

  if (!imageUrl || typeof imageUrl != "string" || !URL.canParse(imageUrl)) {
    return res
      .status(400)
      .json({ message: "Invalid Url, valid imageUrl required" });
  }

  const _imageUrl = new URL(imageUrl);

  const imageFound = await fetch(_imageUrl);

  if (!imageFound.ok) {
    return res
      .status(imageFound.status)
      .json({ message: "Unable to access the file" });
  }

  const contentType = imageFound.headers.get("content-type");

  const extension = getImageExtension(contentType);

  if (!extension) {
    return res
      .status(406)
      .json({
        message: "Not Acceptable file type, acceptable types e.g jpg, png, gif",
      });
  }

  req.imageFound = imageFound
  req._imageUrl = _imageUrl

  next();
}

async function imageUpload(req, res, next) {
  try {
    const { imageFound, _imageUrl } = req;
    const contentType = imageFound.headers.get("content-type");
    const resolvedBuffer = await imageFound.arrayBuffer();
    const fileBuffer = Buffer.from(resolvedBuffer);
    const fileName = `${randomStringGenerator()}-${path.basename(_imageUrl.pathname)}`;

    await uploadImage(fileBuffer, fileName, contentType);

    const imgUrl = await getObjectSignedUrl(fileName);

    return res
      .status(200)
      .json({ message: "file successfully uploaded", imgUrl });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Server can not process the request, Please try again later",
      });
  }
}

appRouter.post("/images", validation, imageUpload);

appRouter.get('/images', async(req, res, next) => {

  try {
    const images = await getS3Objects()

    return res.status(200).json({ message: 'list of images', data: images })
    
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Server can not process the request, Please try again later",
      });
  }

})

module.exports = appRouter;
