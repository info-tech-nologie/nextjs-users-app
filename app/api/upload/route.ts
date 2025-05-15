// app/api/upload/route.ts
import formidable from 'formidable';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { insertUser } from '../../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: Request) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(new Error('Erreur form'));

      const { name, email } = fields;
      const file = files.file;

      const fileStream = fs.createReadStream(file[0].filepath);
      const fileName = Date.now() + '-' + file[0].originalFilename;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: fileStream,
        ContentType: file[0].mimetype,
      }));

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      await insertUser(name, email, imageUrl);

      resolve(new Response('Utilisateur ajouté', { status: 200 }));
    });
  });
}
