import API from './http';

const FlightService = {
  getAirPorts: async () => {
    try {
      const response = await API.get('/airports');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getFlights: async (params) => {
    try {
      const response = await API.get('/flights', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getBookings: async (params) => {
    try {
      const response = await API.get('/bookings', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createBooking: async (bookingData) => {
    try {
      const response = await API.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default FlightService;
