
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { s3Service } from '@/services/s3Service';

const PhotoGallery = ({ albumName }: { albumName: string }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await s3Service.listFiles(albumName);
        const photoObjects = response.Contents || [];
        
        // Map S3 objects to photo objects with URLs
        const photoData = await Promise.all(photoObjects.map(async (photo: any) => {
          const url = await s3Service.getFileUrl(photo.Key);
          return {
            key: photo.Key,
            url,
            lastModified: photo.LastModified,
            size: photo.Size
          };
        }));
        
        setPhotos(photoData);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (albumName) {
      fetchPhotos();
    }
  }, [albumName]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploading(true);
      
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await s3Service.uploadFile(file, albumName);
      }
      
      // Refresh the photo list
      const response = await s3Service.listFiles(albumName);
      const photoObjects = response.Contents || [];
      
      const photoData = await Promise.all(photoObjects.map(async (photo: any) => {
        const url = await s3Service.getFileUrl(photo.Key);
        return {
          key: photo.Key,
          url,
          lastModified: photo.LastModified,
          size: photo.Size
        };
      }));
      
      setPhotos(photoData);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };
  
  const deletePhoto = async (key: string) => {
    try {
      await s3Service.deleteFile(key);
      // Remove the deleted photo from the state
      setPhotos(photos.filter(photo => photo.key !== key));
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };
  
  if (loading) {
    return <div>Loading photos...</div>;
  }
  
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{albumName}</h2>
        <div>
          <input
            type="file"
            id="photo-upload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="photo-upload">
            <Button className="cursor-pointer" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </Button>
          </label>
        </div>
      </div>
      
      {photos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No photos in this album yet. Upload some!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card key={photo.key} className="overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={photo.url}
                  alt={photo.key.split('/').pop()}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm truncate">
                    {photo.key.split('/').pop()}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePhoto(photo.key)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
