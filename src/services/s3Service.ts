
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';

export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    // Initialize S3 client with credentials from environment
    const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
    const credentials = {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
    };

    // Create S3 client with configuration
    this.s3Client = new S3Client({
      region,
      credentials,
      useAccelerateEndpoint: import.meta.env.VITE_ENABLE_S3_ACCELERATION === 'true'
    });

    this.bucket = import.meta.env.VITE_AWS_S3_BUCKET || 'demo-bucket';
  }

  // List all albums (folders) in the bucket
  async listAlbums() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Delimiter: '/'
      });
      
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      console.error('Error listing albums:', error);
      throw error;
    }
  }

  // List files in a specific album
  async listFiles(prefix: string) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix
      });
      
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // Upload a file to S3
  async uploadFile(file: File, folderPath?: string, progressCallback?: (progress: number) => void) {
    try {
      const key = folderPath 
        ? `${folderPath}/${Date.now()}_${file.name}`
        : `${Date.now()}_${file.name}`;
        
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: file,
          ContentType: file.type
        },
        queueSize: 4,
        partSize: 1024 * 1024 * 5, // 5MB chunks
      });

      // Add progress tracking if callback provided
      if (progressCallback) {
        upload.on('httpUploadProgress', (progress) => {
          if (progress.loaded && progress.total) {
            const percentLoaded = Math.round((progress.loaded / progress.total) * 100);
            progressCallback(percentLoaded);
          }
        });
      }

      const result = await upload.done();
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Get a signed URL for a file
  async getFileUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key
      });
      
      // Using getSignedUrl with proper typing
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  }

  // Delete a file from S3
  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      });
      
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Create a folder in S3 (S3 doesn't really have folders, just objects with "/" in the key)
  async createFolder(folderName: string, parentPath: string = '') {
    try {
      const folderKey = parentPath ? `${parentPath}/${folderName}/` : `${folderName}/`;
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: folderKey,
        Body: ''
      });
      
      const result = await this.s3Client.send(command);
      return result;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  // List folders (CommonPrefixes)
  async listFolders() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Delimiter: '/'
      });
      
      const response = await this.s3Client.send(command);
      return response.CommonPrefixes || [];
    } catch (error) {
      console.error('Error listing folders:', error);
      throw error;
    }
  }

  // Delete an album (folder) and all its contents
  async deleteAlbum(albumName: string) {
    try {
      // First list all objects in the album
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: `${albumName}/`
      });
      
      const listResponse = await this.s3Client.send(listCommand);
      
      if (listResponse.Contents && listResponse.Contents.length > 0) {
        // Delete all objects in the album
        for (const item of listResponse.Contents) {
          if (item.Key) {
            await this.deleteFile(item.Key);
          }
        }
      }
      
      // Finally delete the "folder" object itself
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: `${albumName}/`
      });
      
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      console.error('Error deleting album:', error);
      throw error;
    }
  }

  // Get a file from S3
  async getFile(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key
      });
      
      const response = await this.s3Client.send(command);
      return response;
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  }
}

// Create a singleton instance for use throughout the app
export const s3Service = new S3Service();
