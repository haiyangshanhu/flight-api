import React from 'react';
import { FlightList } from '../../components/FlightList';

function ReturnFlightPage() {
  const handleSelectFlight = (flight) => {
    console.log('Selected return flight:', flight);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Find return flights</h1>

        <h2 className="text-xl font-semibold mb-6 text-gray-800">Available Return Flights</h2>

        <FlightList
          onSelect={handleSelectFlight}
          route={{
            origin: 'New York',
            destination: 'London',
            label: 'Return',
          }}
        />
      </main>
    </div>
  );
}

export { ReturnFlightPage };
