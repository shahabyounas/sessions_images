const express = require("express");
const path = require('path')
const appRouter = express.Router();
const { getImageExtension, randomStringGenerator } = require('../utils')
const { uploadImage, getObjectSignedUrl } = require('./s3')


appRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "This is root path, use the /images API to upload image file",
  });
});

/**
 *  @param { String } imageUrl
 *  
 */

appRouter.post("/images", async (req, res) => {
    try {
        const body = req.body;

        const { imageUrl } = body
      
        if (!imageUrl || typeof imageUrl != 'string' || !URL.canParse(imageUrl)) {
          return res.status(400).json({ message: "Invalid Url, valid imageUrl required" });
        }
      
        const _imageUrl = new URL(imageUrl)
      
        const imageFound = await fetch(_imageUrl);
      
        if(!imageFound.ok){
          return res.status(imageFound.status).json({ message: "Unable to access the file" });
        }
      
        const contentType = imageFound.headers.get('content-type')
      
        const extension = getImageExtension(contentType)
      
        if(!extension){
            return res.status(406).json({ message: "Not Acceptable file type, acceptable types e.g jpg, png, gif" });
        }

        const resolvedBuffer = await imageFound.arrayBuffer()
        const fileBuffer = Buffer.from(resolvedBuffer)
        const fileName = `${randomStringGenerator()}-${path.basename(_imageUrl.pathname)}`
      
      
        await uploadImage(fileBuffer, fileName, contentType)

        const imgUrl = await getObjectSignedUrl(fileName)
      
        return res.status(200).json({ message: 'file successfully uploaded', imgUrl })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server can not process the request, Please try again later" });
    }
});

module.exports = appRouter
