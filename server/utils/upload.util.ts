import { AWS_INFOR } from './../configs/aws.config';
import { join } from 'path';
// import fs from 'fs';
// import util from 'util';
// import { publicPath, getUploadPathWithYear } from './path.util';
// const writeFile = util.promisify(fs.writeFile);

// /**
//  * 创建上传文件
//  * @param fileName 文件名
//  * @param fileBuffer 文件buffer
//  * @return 返回文件链接url
//  */
// export const creteUploadFile = async (fileName: string, fileBuffer: Buffer) => {
//     const _uploadPath = getUploadPathWithYear();
//     const basePath = join(publicPath, _uploadPath);
//     if (!fs.existsSync(basePath)) {
//         fs.mkdirSync(basePath);
//     }
//     await writeFile(basePath + '/' + fileName, fileBuffer);
//     const url = _uploadPath + '/' + fileName;
//     return url;
// };

const AWS = require("aws-sdk");
const fs = require("fs");


  export const creteUploadFile = async (fileName: string, fileBuffer: Buffer,file:Express.Multer.File) => {
    console.log("lỗi à1     ")
    const BUCKET = AWS_INFOR.BUCKET;
    const REGION = AWS_INFOR.REGION;
    const ACCESS_KEY = AWS_INFOR.AWS_ACCESS_KEY;
    const SECRET_KEY = AWS_INFOR.AWS_SECRET_KEY;
    // const imageRemoteName = `directUpload_catImage_${new Date().getTime()}.jpeg`;

    AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
    });

    var s3 = new AWS.S3();

    s3.putObject({
        Bucket: BUCKET,
        Body:  fileBuffer,
        Key: fileName
    })
    .promise()
    .then(res => {
        console.log(`Upload succeeded - `, res);
    })
    .catch(err => {
        console.log("Upload failed:", err);
    });


    // const _uploadPath = getUploadPathWithYear();
    // const basePath = join(publicPath, _uploadPath);
    // if (!fs.existsSync(basePath)) {
    //     fs.mkdirSync(basePath);
    // }
    // await writeFile(basePath + '/' + fileName, fileBuffer);
    // const url = _uploadPath + '/' + fileName;
    // return url;
};