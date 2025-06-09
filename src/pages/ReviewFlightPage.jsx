import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useFlightSelection } from '../context/FlightSelectionContext';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';
import flightService from '../services/flightService';
import { useAuth } from '../context/AuthContext';

function FlightReviewPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  console.log('Current User:', currentUser);
  const { selectedFlights, searchParams } = useFlightSelection();
  const [fareDetails, setFareDetails] = useState({
    baseFare: 0,
    taxes: 0,
    total: 0,
  });

  const formatFlightDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'EEE, MMM d');
    } catch (error) {
      return dateStr;
    }
  };

  useEffect(() => {
    let baseFare = 0;
    let taxes = 0;

    if (selectedFlights.outbound.length > 0) {
      selectedFlights.outbound.forEach((flight) => {
        const price = flight.rawData?.price || 0;
        baseFare += Number(price);
      });
    }

    if (selectedFlights.return.length > 0) {
      selectedFlights.return.forEach((flight) => {
        const price = flight.rawData?.price || 0;
        baseFare += Number(price);
      });
    }

    taxes = Math.round(baseFare * 0.15);

    setFareDetails({
      baseFare,
      taxes,
      total: baseFare + taxes,
    });
  }, [selectedFlights]);

  useEffect(() => {
    if (selectedFlights.outbound.length === 0) {
      navigate('/flights');
    }
  }, [selectedFlights, navigate]);

  const handleContinueToPayment = async () => {
    try {
      // 获取所有需要预订的航班 (去程和返程)
      const flightsToBook = [
        ...selectedFlights.outbound.map((flight) => ({
          flight,
          type: 'outbound',
        })),
        ...selectedFlights.return.map((flight) => ({
          flight,
          type: 'return',
        })),
      ];

      const passengerInfo = Array(parseInt(searchParams.passengers) || 1)
        .fill()
        .map(() => ({
          firstName: currentUser.firstName,
          lastName: 'Doe',
          email: 'john.doe@example.com',
        }));

      const bookingPromises = flightsToBook.map(({ flight }) => {
        const bookingData = {
          flightId: flight.id || flight.rawData?.id,
          passengers: passengerInfo,
        };

        console.log(`Creating booking for flight: ${flight.flightNumber}`, bookingData);
        return flightService.createBooking(bookingData);
      });

      const results = await Promise.all(bookingPromises);

      console.log('Booking results:', results);

      const allSuccessful = results.every((result) => result.success);

      if (allSuccessful) {
        toast.success('All flights booked successfully!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        localStorage.setItem(
          'bookings',
          JSON.stringify(
            results.map((result, index) => ({
              ...result.data,
              flightDetails: flightsToBook[index].flight,
              type: flightsToBook[index].type,
            })),
          ),
        );

        // 导航到预订确认页面
        setTimeout(() => {
          navigate('/books');
        }, 1800);
      } else {
        // 显示错误信息
        const failedBookings = results
          .filter((result) => !result.success)
          .map((result) => result.message);

        toast.error(`Some bookings failed: ${failedBookings.join(', ')}`, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error creating bookings:', error);
      toast.error('Failed to create bookings. Please try again.');
    }
  };

  const prepareFlightData = (flights) => {
    if (!flights || flights.length === 0) return [];

    return flights.map((flight) => {
      const rawData = flight.rawData || {};
      return {
        type: rawData.cabinClass || 'Economy',
        origin: flight.origin || rawData.departure || '',
        destination: flight.destination || rawData.destination || '',
        date: formatFlightDate(rawData.departureTime),
        departureTime: flight.departure,
        arrivalTime: flight.arrival,
        duration: flight.duration,
        price: rawData.price || 0,
        flightNumber: flight.flightNumber || rawData.flightNumber,
        airline: flight.airline || rawData.airline,
        image: flight.airline === 'United' ? '/assets/fly1.png' : '/assets/fly2.png',
      };
    });
  };

  const outboundFlights =
    selectedFlights.outbound.length > 0 ? prepareFlightData(selectedFlights.outbound) : [];
  const returnFlights =
    selectedFlights.return.length > 0 ? prepareFlightData(selectedFlights.return) : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-10">Review your flights</h1>
      {/* 去程航班信息 */}
      {outboundFlights.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Outbound</h2>
          {outboundFlights.map((flight, index) => (
            <Card key={index} className="overflow-hidden mb-4">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="text-sm text-gray-500 mb-1">{flight.type}</div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-700">{flight.airline}</span>
                    <span className="text-xs text-gray-500">• {flight.flightNumber}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {flight.origin} to {flight.destination}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {flight.date} • {flight.departureTime} - {flight.arrivalTime}
                  </p>
                  <div className="flex justify-between">
                    <p className="text-gray-600 text-sm">Duration: {flight.duration}</p>
                    <p className="font-bold">${flight.price}</p>
                  </div>
                </div>
                <div className="md:w-64 h-40 md:h-auto overflow-hidden bg-blue-100">
                  <div className="w-full h-full bg-gradient-to-b from-blue-300 to-blue-500 flex items-center justify-center">
                    <img src={flight.image} alt="Flight" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 返程航班信息 */}
      {returnFlights.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Return</h2>
          {returnFlights.map((flight, index) => (
            <Card key={index} className="overflow-hidden mb-4">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="text-sm text-gray-500 mb-1">{flight.type}</div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-700">{flight.airline}</span>
                    <span className="text-xs text-gray-500">• {flight.flightNumber}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {flight.origin} to {flight.destination}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {flight.date} • {flight.departureTime} - {flight.arrivalTime}
                  </p>
                  <div className="flex justify-between">
                    <p className="text-gray-600 text-sm">Duration: {flight.duration}</p>
                    <p className="font-bold">${flight.price}</p>
                  </div>
                </div>
                <div className="md:w-64 h-40 md:h-auto overflow-hidden bg-blue-100">
                  <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
                    <img src={flight.image} alt="Flight" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Fare summary</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Base fare</span>
                <span className="font-medium">${fareDetails.baseFare}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Taxes, fees, and carrier charges</span>
                <span className="font-medium">${fareDetails.taxes}</span>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${fareDetails.total}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-gray-600 mb-2">Passenger(s): {searchParams.passengers}</div>
                <div className="text-xs text-gray-500">
                  Prices are per {parseInt(searchParams.passengers) > 1 ? 'group' : 'person'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 flex justify-end">
        <Button
          size={'lg'}
          variant={'primary'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 h-12 rounded-md"
          onClick={handleContinueToPayment}
        >
          Continue to payment
        </Button>
      </div>
    </div>
  );
}

export { FlightReviewPage };
