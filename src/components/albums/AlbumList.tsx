
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder } from 'lucide-react';
import { S3Service, s3Service } from '@/services/s3Service';
import { CommonPrefix } from '@aws-sdk/client-s3';

const AlbumList = () => {
  const [albums, setAlbums] = useState<CommonPrefix[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await s3Service.listAlbums();
        // Fix for CommonPrefixes error - now extracting common prefixes correctly
        const albumPrefixes = response?.CommonPrefixes || [];
        setAlbums(albumPrefixes);
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) {
    return <p>Loading albums...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Photo Albums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album) => (
          <Card key={album.Prefix} className="bg-white shadow-md rounded-md overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Folder className="mr-2 h-5 w-5 text-yellow-500" />
                  <h2 className="text-lg font-semibold text-gray-800">{album.Prefix}</h2>
                </div>
                <Link to={`/album/${album.Prefix}`}>
                  <Button variant="outline" size="sm">
                    View Album
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;
