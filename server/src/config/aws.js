const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

//connect to aws s3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// test connection (eventually make into tests folder for unit test)
async function testS3Connection() {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log('Buckets:', data.Buckets);
  } catch (error) {
    console.error('Error fetching buckets:', error.message);
  }
}

//testS3Connection(); //test 

module.exports = { s3 };