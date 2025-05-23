
import { s3Service, S3UploadResult, S3UploadOptions } from './s3Service';

/**
 * Service for handling file operations
 */
class FileService {
  /**
   * Upload a file to S3
   * @param file The file to upload
   * @param folder The S3 folder (optional)
   * @param options Upload options
   * @returns Promise with upload result
   */
  async uploadFile(file: File, folder?: string, options?: S3UploadOptions): Promise<S3UploadResult> {
    try {
      return await s3Service.uploadFile(file, folder, options);
    } catch (error) {
      console.error('Error in FileService.uploadFile:', error);
      throw error;
    }
  }

  /**
   * Get a presigned URL for a file
   * @param key The S3 object key
   * @param expiresIn Expiration time in seconds
   * @returns Promise with the presigned URL
   */
  async getFileUrl(key: string, expiresIn?: number): Promise<string> {
    try {
      return await s3Service.getFileUrl(key, expiresIn);
    } catch (error) {
      console.error('Error in FileService.getFileUrl:', error);
      throw error;
    }
  }

  /**
   * Delete a file from S3
   * @param key The S3 object key
   * @returns Promise
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await s3Service.deleteFile(key);
    } catch (error) {
      console.error('Error in FileService.deleteFile:', error);
      throw error;
    }
  }

  /**
   * Download a file from S3
   * @param key The S3 object key
   * @returns Promise with the file blob
   */
  async downloadFile(key: string): Promise<Blob> {
    try {
      return await s3Service.downloadFile(key);
    } catch (error) {
      console.error('Error in FileService.downloadFile:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const fileService = new FileService();
