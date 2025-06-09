import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast, ToastContainer } from 'react-toastify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import AirportSelect from '../../components/AirportSelect';
import flightService from '../services/flightService';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [loading, setLoading] = useState(false);
  const [departDate, setDepartDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setLoading(true);

      const searchParams = new URLSearchParams({
        from: departureAirport,
        to: arrivalAirport,
        departDate: departDate,
        // tripType: tripType,
        // passengers: passengers,
      });

      navigate(`/flight-selection?${searchParams.toString()}`);

      // const flights = await flightService.getFlights(params);

      // console.log('Flights found:', flights);
      // toast({
      //   title: 'Success',
      //   description: `Found ${flights.content?.length || 0} flights`,
      // });
    } catch (error) {
      console.error('Error searching flights:', error);
      // toast({
      //   title: 'Error',
      //   description: typeof error === 'string' ? error : 'Failed to search flights',
      //   variant: 'destructive',
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <ToastContainer />
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="relative h-80 bg-slate-600">
          <img
            src="../../public/assets/header.png"
            alt="Airplane in the sky"
            className="w-full h-full object-fill"
          />
        </div>

        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="trip-type" className="text-base font-medium mb-2 block">
                Trip type
              </Label>
              <Select defaultValue="roundtrip">
                <SelectTrigger className="w-full max-w-md bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select trip type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roundtrip">Round Trip</SelectItem>
                  <SelectItem value="oneway">One Way</SelectItem>
                  <SelectItem value="multicity">Multi-city</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              {/* <Label className="text-base font-medium mb-2 block">From/To</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="From" className="bg-gray-50 border-gray-200" />
                <Input placeholder="To" className="bg-gray-50 border-gray-200" />
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AirportSelect
                label="From"
                value={departureAirport}
                onChange={setDepartureAirport}
                excludeCode={arrivalAirport}
              />

              <AirportSelect
                label="To"
                value={arrivalAirport}
                onChange={setArrivalAirport}
                excludeCode={departureAirport}
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block">Depart/Return</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Depart"
                  className="bg-gray-50 border-gray-200"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                />
                <Input type="date" placeholder="Return" className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div>
              <Label htmlFor="passengers" className="text-base font-medium mb-2 block">
                Passengers
              </Label>
              <Select defaultValue="1">
                <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select passengers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Adult</SelectItem>
                  <SelectItem value="2">2 Adults</SelectItem>
                  <SelectItem value="3">3 Adults</SelectItem>
                  <SelectItem value="4">4 Adults</SelectItem>
                  <SelectItem value="family">2 Adults, 2 Children</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              size="lg"
              variant={'outline'}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search flights'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default HomePage;
