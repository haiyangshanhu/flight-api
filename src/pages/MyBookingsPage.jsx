import React, { useState, useEffect } from 'react';

import { Button } from '../../components/ui/button';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card, CardContent } from '../../components/ui/card';
import flightService from '../services/flightService';

function MyBookingsPage() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState({ upcoming: true, past: true });
  useEffect(() => {
    // Fetch upcoming bookings
    const fetchUpcomingBookings = async () => {
      try {
        const data = await flightService.getBookings({ status: 'Upcoming' });
        console.log('Upcoming bookings:', data);
        setUpcomingBookings(data.data.content || []);
        setLoading((prev) => ({ ...prev, upcoming: false }));
      } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        setLoading((prev) => ({ ...prev, upcoming: false }));
      }
    };

    // Fetch past bookings
    const fetchPastBookings = async () => {
      try {
        const data = await flightService.getBookings({ status: 'Past' });
        setPastBookings(data.data.content || []);
        setLoading((prev) => ({ ...prev, past: false }));
      } catch (error) {
        console.error('Error fetching past bookings:', error);
        setLoading((prev) => ({ ...prev, past: false }));
      }
    };

    fetchUpcomingBookings();
    fetchPastBookings();
  }, []);

  // Function to render booking cards
  const renderBookingItem = (booking, type) => {
    return (
      <div
        key={booking.id}
        className="flex justify-between items-center py-6 border-b border-gray-100"
      >
        <div>
          <p className="text-sm text-gray-500 mb-1">Booking Reference: {booking.reference}</p>
          <h3 className="text-lg font-medium">{booking.route}</h3>
          <p className="text-sm text-gray-500">
            {type === 'upcoming' ? 'Departure: ' : 'Completed: '}
            {new Date(booking.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="w-48 h-32 overflow-hidden rounded-md">
          <img
            src={booking.imageUrl || '/assets/fly1.png'}
            alt="Flight"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = (type) => {
    if (type === 'upcoming') {
      return (
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-64 h-64 mb-4">
            <img
              src="/assets/past_empty.png"
              alt="Empty box illustration"
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">No upcoming bookings</h3>
          <p className="text-gray-600 mb-6">
            You don't have any upcoming bookings. Start planning your next trip now.
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-64 h-64 mb-4">
            <img
              src="/assets/upcoming_empty.png"
              alt="Box with plant illustration"
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">No past bookings</h3>
          <p className="text-gray-600">
            You don't have any past bookings. Your booking history will appear here once you've
            completed a flight.
          </p>
        </div>
      );
    }
  };
  console.log('upcomingBookings:', upcomingBookings);
  const renderLoadingSkeleton = () => {
    return Array(3)
      .fill()
      .map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center py-6 border-b border-gray-100"
        >
          <div className="flex-1 mr-4">
            <Skeleton width={180} height={16} className="mb-3" />
            <Skeleton width={280} height={24} className="mb-3" />
            <Skeleton width={160} height={16} />
          </div>
          <div className="w-48 h-32 overflow-hidden rounded-md">
            <Skeleton height="100%" width="100%" />
          </div>
        </div>
      ));
  };
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Upcoming</h2>
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              {loading.upcoming ? (
                <div className="p-4">{renderLoadingSkeleton()}</div>
              ) : upcomingBookings.length > 0 ? (
                <div className="p-4">
                  {upcomingBookings.map((booking) => renderBookingItem(booking, 'upcoming'))}
                </div>
              ) : (
                renderEmptyState('upcoming')
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Past</h2>
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              {loading.past ? (
                <div className="p-4">{renderLoadingSkeleton()}</div>
              ) : pastBookings.length > 0 ? (
                <div className="p-4">
                  {pastBookings.map((booking) => renderBookingItem(booking, 'past'))}
                </div>
              ) : (
                renderEmptyState('past')
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default MyBookingsPage;
