
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { API_CONFIG } from '@/config/api.config';

export interface S3UploadResult {
  Location: string;
  Bucket: string;
  Key: string;
  ETag: string;
}

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
   * @param file The file to upload
   * @param folder The S3 folder to upload to
   * @param metadata Optional metadata or callback functions
   */
  async uploadFile(file: File, folder: string = 'uploads', metadata: Record<string, string> = {}): Promise<S3UploadResult> {
    const key = `${folder}/${Date.now()}-${file.name}`;
    
    // Filter out any non-string metadata (like callbacks)
    const sanitizedMetadata: Record<string, string> = {};
    Object.entries(metadata).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sanitizedMetadata[key] = value;
      }
    });
    
    const params = {
      Bucket: API_CONFIG.S3.bucket,
      Key: key,
      Body: file,
      ContentType: file.type,
      Metadata: sanitizedMetadata
    };

    try {
      // Use the Upload class which manages multipart uploads
      const upload = new Upload({
        client: this.client,
        params
      });

      const result = await upload.done();
      console.log('File uploaded successfully:', result);
      
      // Return formatted result to match expected interface
      return {
        Location: `https://${API_CONFIG.S3.bucket}.s3.${API_CONFIG.S3.region}.amazonaws.com/${key}`,
        Bucket: API_CONFIG.S3.bucket,
        Key: key,
        ETag: result.ETag || ''
      };
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
   * Get a signed URL for a file
   */
  async getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: API_CONFIG.S3.bucket,
        Key: key
      });
      
      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }
  
  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: API_CONFIG.S3.bucket,
        Key: key
      });
      
      await this.client.send(command);
      console.log('File deleted successfully:', key);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw error;
    }
  }
  
  /**
   * List files in an S3 folder
   */
  async listFiles(prefix: string): Promise<any> {
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
  
  /**
   * List albums (folders) in S3
   */
  async listAlbums(): Promise<string[]> {
    try {
      const result = await this.listFiles('albums/');
      const albums = new Set<string>();
      
      if (result.Contents) {
        result.Contents.forEach((object: any) => {
          if (object.Key) {
            const parts = object.Key.split('/');
            if (parts.length > 1 && parts[0] === 'albums') {
              albums.add(parts[1]);
            }
          }
        });
      }
      
      // Handle CommonPrefixes properly (for folder-like objects)
      if (result.CommonPrefixes) {
        result.CommonPrefixes.forEach((prefix: any) => {
          if (prefix.Prefix) {
            const parts = prefix.Prefix.split('/');
            if (parts.length > 1 && parts[0] === 'albums') {
              albums.add(parts[1]);
            }
          }
        });
      }
      
      return Array.from(albums);
    } catch (error) {
      console.error('Error listing albums:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const s3Service = new S3Service();
