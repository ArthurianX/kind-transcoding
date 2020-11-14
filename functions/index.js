const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const AWS = require('aws-sdk');

exports.getS3SignedUrlUpload = functions.https.onCall((data, context) => {
    AWS.config.update({
        accessKeyId: 'AWS_ACCESS_KEY_ID',
        secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
        region: 'eu-central-1',
    });
    var s3 = new AWS.S3();
    const s3Params = {
        Bucket: data.S3BucketName,
        Key: data.key,
        Expires: 600, // Expires in 10 minutes
        ContentType: data.contentType,
        ACL: 'public-read', // Could be something else
        ServerSideEncryption: 'AES256',
    };
    return s3.getSignedUrl('putObject', s3Params);
});
