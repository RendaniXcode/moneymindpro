
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { API_CONFIG } from '@/config/api.config';

/**
 * Service for S3 operations
 */
class S3Service {
  private client: S3Client;
  
  constructor() {
    // Initialize S3 client with configuration
    this.client = new S3Client({
      region: API_CONFIG.S3.region,
      useAccelerateEndpoint: API_CONFIG.S3.accelerationEnabled
    });
  }
  
  /**
   * Get the S3 client instance
   */
  getClient(): S3Client {
    return this.client;
  }

  /**
   * Upload a file to S3 using multipart upload
   */
  async uploadFile(file: File): Promise<string> {
    const params = {
      Bucket: API_CONFIG.S3.bucket,
      Key: `uploads/${Date.now()}-${file.name}`,
      Body: file,
      ContentType: file.type
    };

    try {
      // Use the Upload class which manages multipart uploads
      const upload = new Upload({
        client: this.client,
        params
      });

      const result = await upload.done();
      console.log('File uploaded successfully:', result);
      return params.Key;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
  
  /**
   * Download a file from S3
   */
  async downloadFile(key: string): Promise<Blob> {
    const params = {
      Bucket: API_CONFIG.S3.bucket,
      Key: key
    };

    try {
      const command = new GetObjectCommand(params);
      const response = await this.client.send(command);
      
      if (!response.Body) {
        throw new Error('Empty response body');
      }
      
      // Convert readable stream to blob
      const data = await response.Body.transformToByteArray();
      return new Blob([data], { type: response.ContentType });
    } catch (error) {
      console.error('Error downloading file from S3:', error);
      throw error;
    }
  }
  
  /**
   * List files in an S3 folder
   */
  async listFiles(prefix: string) {
    const params = {
      Bucket: API_CONFIG.S3.bucket,
      Prefix: prefix
    };

    try {
      const command = new ListObjectsV2Command(params);
      const result = await this.client.send(command);
      return result;
    } catch (error) {
      console.error('Error listing files in S3:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const s3Service = new S3Service();
