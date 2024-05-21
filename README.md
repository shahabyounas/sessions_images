# Session Images

## Description

Session Images is a project that provides an API to accept an image URL in the request body, fetches the image from the URL, and stores it in an AWS S3 bucket. The API returns a success message and a pre-signed URL to access the image in the S3 bucket, valid for one hour.

## Installation Instructions

This project uses the Serverless Framework and the ExpressJS backend framework running on top of Node.js.

### Required Third-Party Modules

- `helmet` for app security
- `dotenv` to load environment variables
- `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` to work with the S3 bucket for storing and retrieving images

### Steps
1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/session-images.git
   cd session-images
   npm install

2. Install the dependencies:
    npm install

3. Create a .env file in the root directory and add your environment variables:
    ```AWS_ACCESS_KEY_ID=your-access-key-id
    AWS_SECRET_ACCESS_KEY=your-secret-access-key
    AWS_REGION=your-region
    S3_BUCKET_NAME=your-s3-bucket-name
4. Deploy the application using the Serverless Framework:
    ```
    serverless deploy

### Infrastructure
    The application is hosted on AWS Lambda and accessed through an API Gateway.
    
    API Gateway URL: https://z3cwumr56i.execute-api.us-east-1.amazonaws.com/api/v1/images

## API Usage

### Request

Send a POST request to the API with the image URL in the request body. The URL must be a valid and accessible string.

#### Example

```http
POST /api/v1/images 
Host: z3cwumr56i.execute-api.us-east-1.amazonaws.com
Content-Type: application/json

Request:
{
  "imageUrl": "https://example.com/image.jpg"
}

Response:
{
  "message": "Image successfully uploaded",
  "imgUrl": "https://your-s3-bucket.s3.amazonaws.com/your-image.jpg?AWSAccessKeyId=your-access-key-id&Expires=timestamp&Signature=your-signature"
}



