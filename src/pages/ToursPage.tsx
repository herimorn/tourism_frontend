import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, Star } from 'lucide-react';
import { api } from '../lib/api';
import { TourSearch } from '../components/TourSearch';
import type { Tour } from '../types';

export function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await api.tours.getAll(filters);
        setTours(data);
        setFilteredTours(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchTours();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading tours: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Tours</h1>
        <p className="mt-2 text-gray-600">
          Discover and book amazing experiences around the world
        </p>
      </div>

      <TourSearch filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTours.map((tour) => (
          <Link
            key={tour.id}
            to={`/tours/${tour.id}`}
            className="group block"
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={tour.image_url}
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {tour.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {tour.location}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {tour.duration} mins
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {tour.max_participants} spots
                  </div>
                </div>

                {tour.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {tour.rating.toFixed(1)}
                    </span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ${tour.price}
                  </span>
                  {tour.vr_content_urls?.length > 0 && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      VR Available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTours.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tours found matching your criteria. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}