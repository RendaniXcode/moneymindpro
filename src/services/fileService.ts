import { s3Service } from './s3Service';

/**
 * FileService - A modern API for file operations, removing references to photo/album terminology
 * This service is a wrapper around the S3Service to provide a cleaner API
 */
export class FileService {
  /**
   * Upload a file to the specified folder
   * @param file The file to upload
   * @param folder The folder to upload to (optional)
   * @param onProgress Progress callback (0-100)
   * @returns Upload result with file information
   */
  async uploadFile(file: File, folder: string = '', onProgress?: (progress: number) => void) {
    return s3Service.uploadFile(file, folder, onProgress);
  }
  
  /**
   * List all files in a folder
   * @param folder The folder to list files from (optional)
   * @returns Array of file information
   */
  async listFiles(folder: string = '') {
    return s3Service.listFiles(folder);
  }
  
  /**
   * Delete a file by its key
   * @param key The full path/key of the file to delete
   */
  async deleteFile(key: string) {
    return s3Service.deleteFile(key);
  }
  
  /**
   * Create a new folder
   * @param name The name of the folder to create
   */
  async createFolder(name: string) {
    return s3Service.createFolder(name);
  }
  
  /**
   * List all folders
   * @param prefix Optional prefix to filter folders
   * @returns Array of folder names
   */
  async listFolders(prefix: string = '') {
    return s3Service.listFolders(prefix);
  }
  
  /**
   * Delete a folder and all its contents
   * @param folderName The name of the folder to delete
   */
  async deleteFolder(folderName: string) {
    // Uses the existing deleteAlbum method since it handles recursive deletion
    return s3Service.deleteAlbum(folderName);
  }
  
  /**
   * Get information about a single file
   * @param key The full path/key of the file
   * @returns File metadata and URL
   */
  async getFile(key: string) {
    return s3Service.getFile(key);
  }
}

// Export a singleton instance
export const fileService = new FileService();
