import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Calendar, DollarSign, Upload } from 'lucide-react';
// import { supabase } from '../lib/supabase';
import { MediaViewer } from '../components/MediaViewer';
import { useAuthStore } from '../store/authStore';
// import { api } from '../lib/api';
import type { Tour } from '../types';

export function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [mediaContent, setMediaContent] = useState<Array<{
    type: 'image' | 'video' | '360-image' | '360-video';
    url: string;
    title?: string;
    description?: string;
  }>>([]);

  useEffect(() => {
    async function fetchTour() {
      try {
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .select('*')
          .eq('id', id)
          .single();

        if (tourError) throw tourError;
        setTour(tourData);

        // Fetch all media content for the tour
        const { data: vrContent } = await api.tours.getVRContent(id);
        
        const media = [];

        // Add main tour image
        if (tourData.image_url) {
          media.push({
            type: 'image',
            url: tourData.image_url,
            title: 'Tour Overview',
            description: tourData.title
          });
        }

        // Add all VR content
        if (vrContent) {
          vrContent.forEach((content) => {
            media.push({
              type: content.type,
              url: content.url,
              title: content.title,
              description: content.description
            });
          });
        }

        setMediaContent(media);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchTour();
  }, [id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type.startsWith('video/') ? 'video' : 'image');
      formData.append('title', file.name);
      formData.append('description', `Uploaded ${file.type.startsWith('video/') ? 'video' : 'image'} for ${tour?.title}`);

      const response = await api.tours.uploadContent(id!, formData);
      
      // Add the new media to the list
      setMediaContent(prev => [...prev, {
        type: response.type,
        url: response.url,
        title: response.title,
        description: response.description
      }]);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!bookingDate || !tour) return;

    setBookingLoading(true);
    setError(null);

    try {
      await api.bookings.create({
        tour_id: tour.id,
        booking_date: bookingDate
      });

      navigate('/profile');
    } catch (err) {
      setError('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Tour not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tour.title}</h1>
            <div className="mt-4 flex items-center text-gray-500">
              <MapPin className="h-5 w-5 mr-2" />
              {tour.location}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tour Media</h2>
              {user?.role === 'guide' && (
                <div className="relative">
                  <input
                    type="file"
                    id="media-upload"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={uploadLoading}
                  />
                  <label
                    htmlFor="media-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                  >
                    {uploadLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Media
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
            
            {mediaContent.length > 0 ? (
              <MediaViewer media={mediaContent} />
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No media content available</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">About this tour</h2>
            <p className="text-gray-600">{tour.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-sm text-gray-500">Duration</div>
              <div className="font-semibold">{tour.duration} mins</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-sm text-gray-500">Group Size</div>
              <div className="font-semibold">Max {tour.max_participants}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-sm text-gray-500">Price</div>
              <div className="font-semibold">${tour.price}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 lg:mt-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Book this tour</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Select Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!bookingDate || bookingLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  'Book Now'
                )}
              </button>

              {!user && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Please sign in to book this tour
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}