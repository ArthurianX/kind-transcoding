const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const AWS = require('aws-sdk');
const { promisify } = require('util');
const credentials = require('.env.js');

exports.getS3SignedUrlUpload = functions.https.onCall((data, context) => {
    AWS.config.update({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,    
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

exports.searchOutputBucketForFile = functions.https.onCall((payload, context) => {
    AWS.config.update({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,    
        region: 'eu-central-1',
    });
    
    const S3 = new AWS.S3();

    listObjects = promisify(S3.listObjects).bind(S3);
    
    return listObjects({ Bucket: payload.bucket })
        .then(data => {
            let foundFile = false;
            
            data.Contents.map((s3Obj) => {
                if (s3Obj.Key === payload.fileName) {
                    foundFile = true; 
                }
            });

            return foundFile;
        })
});

exports.getS3SignedUrlDownload = functions.https.onCall((data, context) => {
    AWS.config.update({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,    
        region: 'eu-central-1',
    });
    var s3 = new AWS.S3();
    const s3Params = {
        Bucket: data.S3BucketName,
        Key: data.key,
        Expires: 600, // Expires in 10 minutes
        ACL: 'public-read', // Could be something else
        ServerSideEncryption: 'AES256',
    };

    return s3.getSignedUrl('getObject', s3Params);
});