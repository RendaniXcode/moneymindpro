
import { apiClient } from './apiClient';
import { s3Service } from './s3Service';
import { API_CONFIG } from '@/config/api.config';
import { toast } from '@/hooks/use-toast';

/**
 * Service for handling file uploads and document analysis
 */
export class FileService {
  /**
   * Upload a file to S3 and return the key
   */
  async uploadFile(file: File): Promise<string | null> {
    try {
      // Generate a unique key for the file
      const key = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      
      // Upload to S3
      await s3Service.uploadFile(key, file);
      
      return key;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload file. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }
  
  /**
   * Analyze a document using the REST API
   */
  async analyzeDocument(fileKey: string) {
    try {
      const endpoint = API_CONFIG.REST_API.endpoints.analyzeDocument;
      const result = await apiClient.post(endpoint, {
        key: fileKey,
        type: 'financial_document'
      });
      
      return result;
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the document. Please try again later.",
        variant: "destructive",
      });
      return null;
    }
  }
  
  /**
   * Get a signed URL to download or view a file from S3
   */
  async getSignedUrl(key: string): Promise<string | null> {
    try {
      // Remove the empty parameter
      return await s3Service.getSignedUrl(key);
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
  }
  
  /**
   * List files in an S3 directory
   */
  async listFiles(prefix: string = 'uploads/'): Promise<any[]> {
    try {
      const files = await s3Service.listFiles(prefix);
      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }
}

// Export singleton instance
export const fileService = new FileService();
