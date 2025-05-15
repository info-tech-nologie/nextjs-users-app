// lib/s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

// Crée un client S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Fonction pour télécharger un fichier sur S3
export async function uploadFileToS3(filePath: string, fileName: string) {
  const fileStream = fs.createReadStream(filePath); // Crée un flux de fichier

  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME, // Le nom de ton bucket S3
      Key: fileName, // Nom du fichier sur S3
      Body: fileStream, // Contenu du fichier
      ContentType: 'image/jpeg', // Type de contenu (peut être dynamique selon le type de fichier)
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command); // Exécute l'upload vers S3
    console.log(`Fichier ${fileName} téléchargé avec succès vers S3`);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Erreur lors de l\'upload sur S3', error);
    throw error;
  }
}
