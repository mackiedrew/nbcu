import path from "path";
import AWS from "aws-sdk";
import fs, { read } from "fs";
import zlib from "zlib";

// Get credentials from a JSON file with keys matching those below
AWS.config.loadFromPath(path.resolve(__dirname, 'awsConfig.json'));

AWS.config.update({
  accessKeyId: AWS.config.credentials?.accessKeyId,
  secretAccessKey: AWS.config.credentials?.secretAccessKey,
});

// Create new S3 object
const s3 = new AWS.S3();

const downloadAwsFile = async (fileName) => {
  // All files exist in this one bucket in a flat level
  const bucket ='prod-feed-exports';
  const params = {
    Bucket: bucket, 
    Key: fileName,
  };
  console.log(`🔃 Fetching ${bucket}/${fileName}`)
  const readStream = s3.getObject(params).createReadStream().pipe(zlib.createGunzip());
  const writeStream = fs.createWriteStream(path.join(__dirname, fileName));
  readStream.pipe(writeStream);

  return await new Promise<string>((resolve,reject) => {
      readStream.on('finish', () => resolve(fileName));
      writeStream.on('error', reject);
      console.log(`✍️  Finished downloading and ungzipping the file: ${fileName}`)
  });
}

export const downloadAwsFiles = async (fileNames) => Promise.all(fileNames.map(async (fileName) => {
  return await downloadAwsFile(fileName)
}))