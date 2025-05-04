
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { s3Service } from '../../services/s3Service';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';

interface Photo {
  key: string;
  url: string;
  lastModified?: Date;
  size?: number;
}

const PhotoGallery = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (albumName) {
      loadPhotos();
    }
  }, [albumName]);
  
  const loadPhotos = async () => {
    if (!albumName) return;
    
    try {
      setLoading(true);
      const data = await s3Service.listPhotos(albumName);
      
      const photoData: Photo[] = data
        .filter((item: any) => item.Key !== albumName + "/") // Filter out the album folder itself
        .map((item: any) => {
          const photoKey = item.Key;
          const photoUrl = `https://example.com/${photoKey}`; // This would be the S3 URL in a real app
          return {
            key: photoKey,
            url: photoUrl,
            lastModified: item.LastModified,
            size: item.Size
          };
        });
      
      setPhotos(photoData);
    } catch (error) {
      console.error("Error loading photos:", error);
      toast({
        title: "Error",
        description: "Could not load photos. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile || !albumName) return;
    
    try {
      setUploading(true);
      await s3Service.addPhoto(albumName, selectedFile);
      setSelectedFile(null);
      setUploadDialogOpen(false);
      loadPhotos();
      toast({
        title: "Success",
        description: `Photo "${selectedFile.name}" uploaded successfully`
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Error",
        description: "Could not upload photo. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleDeletePhoto = async (photo: Photo) => {
    if (!albumName) return;
    
    if (!confirm(`Are you sure you want to delete the photo "${photo.key.split('/').pop()}"?`)) {
      return;
    }
    
    try {
      await s3Service.deletePhoto(albumName, photo.key);
      loadPhotos();
      toast({
        title: "Success",
        description: "Photo deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Error",
        description: "Could not delete photo. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  if (!albumName) {
    return <div>Invalid album</div>;
  }
  
  return (
    <div className="container mx-auto my-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 mb-4"
          onClick={() => navigate('/albums')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Albums
        </Button>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Photos in {decodeURIComponent(albumName)}
          </h1>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Photo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="photo-file">Select Photo</Label>
                  <Input
                    id="photo-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button 
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                      Uploading...
                    </span>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No photos in this album. Upload your first photo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => {
            const photoName = photo.key.split('/').pop() || '';
            
            return (
              <Card key={photo.key} className="overflow-hidden">
                <AspectRatio ratio={4/3} className="bg-muted">
                  <img 
                    src={photo.url} 
                    alt={photoName}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Fallback for mock URLs
                      e.currentTarget.src = "https://via.placeholder.com/400x300?text=Photo";
                    }}
                  />
                </AspectRatio>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm truncate flex-1" title={photoName}>
                      {photoName}
                    </p>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="ml-2 flex-shrink-0"
                      onClick={() => handleDeletePhoto(photo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
