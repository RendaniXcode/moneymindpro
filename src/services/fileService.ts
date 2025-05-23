
import { toast } from '@/hooks/use-toast';
import { s3Service } from './s3Service';
import { API_CONFIG } from '@/config/api.config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';

/**
 * Service for handling file operations
 */
class FileService {
  /**
   * Upload a file to S3 and return the file URL
   */
  async uploadFile(file: File): Promise<string | null> {
    try {
      const result = await s3Service.uploadFile(file);
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload file to storage",
        variant: "destructive",
      });
      return null;
    }
  }

  /**
   * Generate a presigned URL for downloading a file from S3
   */
  async getFileUrl(key: string): Promise<string | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: API_CONFIG.S3.bucket,
        Key: key,
      });

      const url = await getSignedUrl(s3Service.getClient(), command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      console.error('Error generating file URL:', error);
      return null;
    }
  }

  /**
   * List all files in a specific S3 folder
   */
  async listFiles(folderPath: string): Promise<any[]> {
    try {
      const result: ListObjectsV2CommandOutput = await s3Service.listFiles(folderPath);
      
      if (!result.Contents) {
        return [];
      }
      
      return result.Contents.map(item => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const fileService = new FileService();
