
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { API_CONFIG } from '@/config/api.config';

export interface S3UploadOptions {
  onProgress?: (progress: { loaded: number; total: number }) => void;
  metadata?: Record<string, string>;
  contentType?: string;
  acl?: string;
}

// Create S3 client
const s3Client = new S3Client({
  region: API_CONFIG.S3.region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export class S3Service {
  async uploadFile(
    file: File,
    key: string,
    options: S3UploadOptions = {}
  ): Promise<string> {
    try {
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: API_CONFIG.S3.bucket,
          Key: key,
          Body: file,
          ContentType: options.contentType || file.type,
          Metadata: options.metadata || {},
        },
      });

      if (options.onProgress) {
        upload.on('httpUploadProgress', (progress) => {
          options.onProgress?.({
            loaded: progress.loaded || 0,
            total: progress.total || 0,
          });
        });
      }

      await upload.done();
      return `https://${API_CONFIG.S3.bucket}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async listFiles(prefix?: string): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: API_CONFIG.S3.bucket,
        Prefix: prefix,
      });

      const response = await s3Client.send(command);
      return response.Contents?.map(obj => obj.Key || '') || [];
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
}

export const s3Service = new S3Service();
