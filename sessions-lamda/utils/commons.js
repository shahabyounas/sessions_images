const crypto = require('crypto')
/**
 * 
 * @param {*} contentType 
 * 
 * Reference https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#common_image_file_types
 */
function getImageExtension(contentType) {
    const mimeTypes = {
        'image/apng': 'apng',
        'image/avif': 'avif',
        'image/gif': 'gif',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp'
    };
    return mimeTypes[contentType] || null;
}


function randomStringGenerator(bytes = 16){
    return crypto.randomBytes(bytes).toString('hex')
}

module.exports = {
    getImageExtension,
    randomStringGenerator
}