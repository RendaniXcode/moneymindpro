
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PhotoGallery from '@/components/albums/PhotoGallery';

const PhotosPage = () => {
  const { albumName = '' } = useParams<{ albumName: string }>();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <PhotoGallery albumName={albumName} />
      </div>
    </DashboardLayout>
  );
};

export default PhotosPage;
