const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_USER;

const s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
})


function uploadImage(fileBuffer, fileName, mimetype, fileMeta){

    const params = {
        Bucket: bucketName, 
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
    }

    const command = new PutObjectCommand(params)

    return s3.send(command)
}

// https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/scenarios/presigned-url-upload.js
async function getObjectSignedUrl(key){
    const params = {
        Bucket: bucketName,
        Key: key
    }

    const command = new GetObjectCommand(params)
    const duration = 60 * 60    // one hour
    const url = await getSignedUrl(s3, command, { expiresIn: duration })

    return url
}

module.exports = {
    uploadImage,
    getObjectSignedUrl
}
