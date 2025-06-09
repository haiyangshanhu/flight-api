import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import FlightService from '../src/services/flightService';

const AirportSelect = ({ label, value, onChange, excludeCode = null }) => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setLoading(true);
        const response = await FlightService.getAirPorts();

        if (response.success) {
          setAirports(response.data);
        } else {
          setError(response.message || 'Failed to load airports');
        }
      } catch (error) {
        setError('Error fetching airports');
        console.error('Error fetching airports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  const filteredAirports = airports.filter(
    (airport) => !excludeCode || airport.code !== excludeCode,
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={loading ? 'Loading airports...' : `Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {error && <div className="p-2 text-red-500">{error}</div>}
          {filteredAirports.map((airport) => (
            <SelectItem key={airport.code} value={airport.code}>
              {airport.city} ({airport.code}) - {airport.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AirportSelect;
