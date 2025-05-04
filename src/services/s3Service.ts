import { S3Client, ListObjectsCommand, ListObjectsV2Command, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

interface S3Config {
  albumBucketName: string;
  bucketRegion: string;
  accessKeyId: string;
  secretAccessKey: string;
  useAcceleration?: boolean;
}

export class S3Service {
  private s3Client: S3Client | null = null;
  private albumBucketName: string;
  private useAcceleration: boolean;
  private config: S3Config;
  private initialized = false;

  constructor(config: S3Config) {
    this.config = config;
    this.albumBucketName = config.albumBucketName;
    this.useAcceleration = !!config.useAcceleration;

    console.log(`S3 Service created with bucket ${this.albumBucketName} in ${config.bucketRegion}`);
  }

  private async initializeS3(): Promise<S3Client> {
    if (this.initialized && this.s3Client) {
      return this.s3Client;
    }

    const {
      bucketRegion,
      accessKeyId,
      secretAccessKey,
    } = this.config;

    // Initialize S3 client without checksum configuration
    this.s3Client = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      useAccelerateEndpoint: this.useAcceleration
    });

    console.log(`S3 client initialized. Transfer Acceleration: ${this.useAcceleration ? 'Enabled' : 'Disabled'}`);
    this.initialized = true;

    return this.s3Client;
  }

  // Simple file upload method for files up to 20MB
  async uploadFile(file: File, path: string = '', onProgress?: (progress: number) => void) {
    const key = path ? `${path}/${file.name}` : file.name;
    console.log(`Preparing to upload file: ${file.name} (${file.size} bytes) to ${this.albumBucketName}/${key}`);

    try {
      const s3Client = await this.initializeS3();
      console.log(`S3 client initialized, starting basic upload to ${this.albumBucketName}/${key}`);

      // Start progress indication
      if (onProgress) {
        onProgress(10);
      }

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Update progress after file is read
      if (onProgress) {
        onProgress(30);
      }

      // Create a PutObjectCommand with the binary data
      const putObjectCommand = new PutObjectCommand({
        Bucket: this.albumBucketName,
        Key: key,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type || 'application/octet-stream',
        ACL: 'public-read'
      });

      if (onProgress) {
        onProgress(50);
      }

      console.log('Starting S3 upload using PutObjectCommand with binary data...');
      const result = await s3Client.send(putObjectCommand);

      // Upload complete
      if (onProgress) {
        onProgress(100);
      }

      console.log(`Upload completed successfully`);

      // Construct the file URL
      const fileUrl = this.useAcceleration
          ? `https://${this.albumBucketName}.s3-accelerate.amazonaws.com/${key}`
          : `https://${this.albumBucketName}.s3.${this.config.bucketRegion}.amazonaws.com/${key}`;

      return {
        Location: fileUrl,
        Bucket: this.albumBucketName,
        Key: key,
        ETag: result.ETag,
      };
    } catch (error) {
      console.error("S3 upload failed with error:", error);
      throw error;
    }
  }

  // List files in a folder
  async listFiles(folder = '') {
    try {
      return await this.listFilesV2(folder);
    } catch (error) {
      console.error("Error in listFiles:", error);
      throw error;
    }
  }

  // More robust implementation using AWS SDK v3
  async listFilesV2(folder = '') {
    try {
      console.log(`Listing files in ${this.albumBucketName}/${folder}`);
      const s3Client = await this.initializeS3();

      // Prepare the parameters for listing objects
      const params = {
        Bucket: this.albumBucketName,
        Prefix: folder ? `${folder}/` : '',
        MaxKeys: 1000
      };

      console.log('List params:', JSON.stringify(params));

      // Create the list objects command
      const command = new ListObjectsV2Command(params);

      // Execute the command
      console.log('Executing ListObjectsV2Command...');
      const response = await s3Client.send(command);
      console.log('ListObjectsV2Command executed successfully');

      const filesCount = response.Contents?.length || 0;
      console.log(`Found ${filesCount} files in ${folder || 'root'}`);

      if (filesCount === 0) {
        return [];
      }

      // Format the response
      return (response.Contents || []).map(item => {
        // Ensure Key exists before processing
        const key = item.Key || '';
        const name = key.split('/').pop() || '';
        const size = item.Size || 0;

        // Generate URL using the correct region and acceleration settings
        const url = this.useAcceleration
            ? `https://${this.albumBucketName}.s3-accelerate.amazonaws.com/${key}`
            : `https://${this.albumBucketName}.s3.${this.config.bucketRegion}.amazonaws.com/${key}`;

        return {
          key,
          name,
          lastModified: item.LastModified,
          size,
          url
        };
      });
    } catch (error) {
      console.error(`Error listing files in ${folder}:`, error);
      // More detailed error reporting
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }
}

// Debug flag
const DEBUG = true;

// Create and export a default instance
const createS3Service = () => {
  const getEnvVar = (key: string, defaultValue: string = '') => {
    if (typeof import.meta.env === 'undefined') {
      console.warn(`Import meta env is undefined when accessing ${key}`);
      return defaultValue;
    }
    const value = import.meta.env[key] || defaultValue;
    if (DEBUG) {
      console.log(`ENV: ${key} = ${key.includes('SECRET') ? '[HIDDEN]' : value}`);
    }
    return value;
  };

  const bucket = getEnvVar('VITE_AWS_S3_BUCKET', 'my-photo-album-bucket');
  const region = getEnvVar('VITE_AWS_REGION', 'us-east-1');
  const accessKeyId = getEnvVar('VITE_AWS_ACCESS_KEY_ID');
  const secretAccessKey = getEnvVar('VITE_AWS_SECRET_ACCESS_KEY');
  const enableAcceleration = getEnvVar('VITE_ENABLE_S3_ACCELERATION') === 'true';

  if (DEBUG) {
    console.log('Creating S3 service with configuration:');
    console.log(`- Bucket: ${bucket}`);
    console.log(`- Region: ${region}`);
    console.log(`- Access Key ID: ${accessKeyId ? 'Provided' : 'Not provided'}`);
    console.log(`- Secret Access Key: ${secretAccessKey ? 'Provided' : 'Not provided'}`);
    console.log(`- S3 Acceleration: ${enableAcceleration ? 'Enabled' : 'Disabled'}`);
  }

  if (!bucket) console.error('ERROR: No S3 bucket specified');
  if (!region) console.error('ERROR: No AWS region specified');
  if (!accessKeyId) console.error('ERROR: No AWS access key ID provided');
  if (!secretAccessKey) console.error('ERROR: No AWS secret access key provided');

  // Only create service if we have required credentials
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials are required');
  }

  return new S3Service({
    albumBucketName: bucket,
    bucketRegion: region,
    accessKeyId,
    secretAccessKey,
    useAcceleration: enableAcceleration
  });
};

export const s3Service = createS3Service();