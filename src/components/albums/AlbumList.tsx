
import React, { useState, useEffect } from 'react';
import { s3Service } from '../../services/s3Service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const AlbumList = () => {
  const [albums, setAlbums] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    loadAlbums();
  }, []);
  
  const loadAlbums = async () => {
    try {
      setLoading(true);
      const data = await s3Service.listAlbums();
      
      const albumNames = data.CommonPrefixes.map((prefix: any) => {
        const name = prefix.Prefix.replace('/', '');
        return name;
      });
      
      setAlbums(albumNames);
    } catch (error) {
      console.error("Error loading albums:", error);
      toast({
        title: "Error",
        description: "Could not load albums. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) {
      toast({
        title: "Error",
        description: "Album name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await s3Service.createAlbum(newAlbumName);
      setNewAlbumName('');
      setIsDialogOpen(false);
      loadAlbums();
      toast({
        title: "Success",
        description: `Album "${newAlbumName}" created successfully`
      });
    } catch (error: any) {
      console.error("Error creating album:", error);
      toast({
        title: "Error",
        description: error.message || "Could not create album",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteAlbum = async (albumName: string) => {
    if (!confirm(`Are you sure you want to delete the album "${albumName}" and all its photos?`)) {
      return;
    }
    
    try {
      await s3Service.deleteAlbum(albumName);
      loadAlbums();
      toast({
        title: "Success",
        description: `Album "${albumName}" deleted successfully`
      });
    } catch (error) {
      console.error("Error deleting album:", error);
      toast({
        title: "Error",
        description: "Could not delete album. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Photo Albums</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Album
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Album</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="album-name">Album Name</Label>
                <Input
                  id="album-name"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="Enter album name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAlbum}>Create Album</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No albums found. Create your first album!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <Card key={album} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="truncate">{album}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.location.href = `/albums/${encodeURIComponent(album)}`}
                  >
                    <FolderOpen className="h-4 w-4" />
                    View
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDeleteAlbum(album)}
                  >
                    <Trash2 className="h-4 w-4" />
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

export default AlbumList;
