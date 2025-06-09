import React, { useState } from 'react';
import { InfiniteScrollTable } from './InfiniteScrollTable';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { TableCell, TableRow } from './ui/table';
import flightService from '../src/services/flightService';
import { format } from 'date-fns';

export const FlightList = ({
  onSelect,
  searchParams,
  route = {
    origin: '',
    destination: '',
    label: 'Outbound',
  },
}) => {
  const [loading, setLoading] = useState(false);

  // 表格列配置
  const columns = [
    { header: 'Airline', className: 'py-4' },
    { header: 'Flight Number' },
    { header: 'Departure' },
    { header: 'Arrival' },
    { header: 'Duration' },
    { header: 'Price' },
    { header: '' },
  ];

  const fetchFlights = async (page = 0) => {
    try {
      setLoading(true);

      const params = {
        from: searchParams.from,
        to: searchParams.to,
        date: searchParams.date,
        page: page,
        size: 10,
      };

      console.log('Fetching flights with params:', params);

      const response = await flightService.getFlights(params);

      if (response.success) {
        console.log('Fetched flights:', response.data);

        const flightsData = response.data.content.map((flight) => ({
          id: flight.id,
          flightNumber: flight.flightNumber || 'N/A',
          airline: flight.airline || 'Unknown',
          departure: `${flight.date}   ${flight.time}`,
          arrival: formatDateTime(flight.arrivalTime),
          duration: '3h',
          price: `$${flight.price || 0}`,
          airlineIcon: getAirlineColor(flight.flightNumber),
          origin: flight.departureAirport,
          destination: flight.arrivalAirport,
          // 客户端唯一标识，避免重复
          _clientId: `${flight.id}-${page}`,
          rawData: flight,
        }));

        return {
          data: flightsData,
          hasMore: page < response.data.totalPages - 1,
          totalPages: response.data.totalPages,
        };
      } else {
        console.error('Failed to fetch flights:', response.message);
        return { data: [], hasMore: false, totalPages: 0 };
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
      return { data: [], hasMore: false, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期时间
  const formatDateTime = (dateTimeString) => {
    try {
      const date = new Date(dateTimeString);
      return format(date, 'h:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };

  // 计算飞行时间
  const calculateDuration = (departure, arrival) => {
    try {
      const departureTime = new Date(departure);
      const arrivalTime = new Date(arrival);
      const durationMs = arrivalTime - departureTime;
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch (error) {
      return 'N/A';
    }
  };

  const getAirlineColor = (airline) => {
    // 简单的哈希算法生成颜色
    let hash = 0;
    for (let i = 0; i < airline.length; i++) {
      hash = airline.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const renderFlightRow = (flight) => (
    <TableRow key={flight.id} className="border-t hover:bg-gray-50">
      <TableCell className="py-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 rounded-full mr-3">
            <div
              className="h-full w-full rounded-full"
              style={{ backgroundColor: flight.airlineIcon }}
            ></div>
          </Avatar>
          <span>{flight.airline}</span>
        </div>
      </TableCell>
      <TableCell className="text-gray-900 font-medium">{flight.flightNumber}</TableCell>
      <TableCell className="text-gray-900 font-medium">{flight.departure}</TableCell>
      <TableCell className="text-gray-900 font-medium">{flight.arrival}</TableCell>
      <TableCell className="text-gray-900 font-medium">{flight.duration}</TableCell>
      <TableCell className="text-gray-900 font-bold">{flight.price}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-indigo-600 font-medium"
          onClick={() => onSelect(flight)}
        >
          Select
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <InfiniteScrollTable
      columns={columns}
      fetchData={fetchFlights}
      renderRow={renderFlightRow}
      loadingMessage={`Loading more ${route.label.toLowerCase()} flights...`}
      emptyMessage={`No ${route.label.toLowerCase()} flights available for the selected dates`}
    />
  );
};
