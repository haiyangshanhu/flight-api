import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FlightList } from '../../components/FlightList';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useFlightSelection } from '../context/FlightSelectionContext';
import { useNavigate } from 'react-router-dom';

function FlightSelectionPage() {
  const {
    selectedFlights,
    selectOutboundFlight,
    selectReturnFlight,
    updateSearchParams,
    isSelectionComplete,
  } = useFlightSelection();
  const navigate = useNavigate();

  const handleSelectFlight = (flight) => {
    console.log('Selected flight:', flight);
    selectOutboundFlight(flight);
    navigate('/review-flight');
  };

  const [searchParams] = useSearchParams();
  const [flightParams, setFlightParams] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    departDate: searchParams.get('departDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    tripType: searchParams.get('tripType') || 'oneway',
    passengers: searchParams.get('passengers') || '1',
  });

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Flights', path: '/' },
    {
      label: `${flightParams.from} to ${flightParams.to}`,
      path: '#',
      isCurrent: true,
    },
  ];

  useEffect(() => {
    setFlightParams({
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      departDate: searchParams.get('departDate') || '',
      returnDate: searchParams.get('returnDate') || '',
      tripType: searchParams.get('tripType') || 'oneway',
      passengers: searchParams.get('passengers') || '1',
    });
  }, [searchParams]);
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Select your outbound flight</h1>

        <FlightList
          onSelect={handleSelectFlight}
          searchParams={{
            from: flightParams.from,
            to: flightParams.to,
            date: flightParams.departDate, // 确保使用正确的参数名
            passengers: flightParams.passengers,
          }}
        />
      </main>
    </div>
  );
}

export { FlightSelectionPage };
