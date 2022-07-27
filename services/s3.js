const aws = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

const region = "eu-west-3";
const bucketName = "nyscan/images";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
	region,
	accessKeyId,
	secretAccessKey,
	signatureVersion: "v4",
});

function uploadFile(file) {
	const fileStream = fs.createReadStream(file.path);
	const uploadParams = {
		Bucket: bucketName,
		Body: fileStream,
		Key: file.filename,
	};

	return s3.upload(uploadParams).promise();
}

exports.uploadFile = uploadFile;
