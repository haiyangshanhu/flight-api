import { createContext, useContext, useState } from 'react';

const FlightSelectionContext = createContext(null);

export const useFlightSelection = () => {
  const context = useContext(FlightSelectionContext);
  if (!context) {
    throw new Error('useFlightSelection must be used within a FlightSelectionProvider');
  }
  return context;
};

export const FlightSelectionProvider = ({ children }) => {
  // 使用数组存储多个航班选择
  const [selectedFlights, setSelectedFlights] = useState({
    outbound: [], // 改为数组
    return: [], // 改为数组
  });

  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    tripType: 'oneway',
    passengers: '1',
  });

  // 添加去程航班
  const selectOutboundFlight = (flight) => {
    // 检查是否已经选择了该航班（基于唯一ID比较）
    const flightId = flight._clientId || flight.id;

    setSelectedFlights((prev) => {
      // 检查是否已存在
      const existingIndex = prev.outbound.findIndex((f) => (f._clientId || f.id) === flightId);

      if (existingIndex >= 0) {
        // 如果已存在，创建新数组，移除旧记录
        const newOutbound = [...prev.outbound];
        newOutbound.splice(existingIndex, 1);
        return {
          ...prev,
          outbound: newOutbound,
        };
      } else {
        // 如果不存在，添加到数组中
        return {
          ...prev,
          outbound: [...prev.outbound, flight],
        };
      }
    });
  };

  // 添加返程航班
  const selectReturnFlight = (flight) => {
    // 检查是否已经选择了该航班（基于唯一ID比较）
    const flightId = flight._clientId || flight.id;

    setSelectedFlights((prev) => {
      // 检查是否已存在
      const existingIndex = prev.return.findIndex((f) => (f._clientId || f.id) === flightId);

      if (existingIndex >= 0) {
        // 如果已存在，创建新数组，移除旧记录
        const newReturn = [...prev.return];
        newReturn.splice(existingIndex, 1);
        return {
          ...prev,
          return: newReturn,
        };
      } else {
        // 如果不存在，添加到数组中
        return {
          ...prev,
          return: [...prev.return, flight],
        };
      }
    });
  };

  // 移除特定航班
  const removeOutboundFlight = (flightId) => {
    setSelectedFlights((prev) => ({
      ...prev,
      outbound: prev.outbound.filter((f) => (f._clientId || f.id) !== flightId),
    }));
  };

  const removeReturnFlight = (flightId) => {
    setSelectedFlights((prev) => ({
      ...prev,
      return: prev.return.filter((f) => (f._clientId || f.id) !== flightId),
    }));
  };

  // 清除所有选择
  const clearSelection = () => {
    setSelectedFlights({
      outbound: [],
      return: [],
    });
  };

  // 获取当前选择的航班
  const getCurrentSelection = () => {
    return {
      outbound: selectedFlights.outbound.length > 0 ? selectedFlights.outbound : null,
      return: selectedFlights.return.length > 0 ? selectedFlights.return : null,
    };
  };

  const updateSearchParams = (params) => {
    setSearchParams((prev) => ({
      ...prev,
      ...params,
    }));
  };

  // 判断是否完成选择
  const isSelectionComplete = () => {
    if (searchParams.tripType === 'oneway') {
      return selectedFlights.outbound.length > 0;
    } else {
      return selectedFlights.outbound.length > 0 && selectedFlights.return.length > 0;
    }
  };

  // 获取选择的航班数量
  const getSelectionCount = () => ({
    outbound: selectedFlights.outbound.length,
    return: selectedFlights.return.length,
  });

  console.log('selectedFlights', selectedFlights);

  const value = {
    selectedFlights,
    searchParams,
    selectOutboundFlight,
    selectReturnFlight,
    removeOutboundFlight,
    removeReturnFlight,
    updateSearchParams,
    clearSelection,
    isSelectionComplete,
    getSelectionCount,
    getCurrentSelection,
  };

  return (
    <FlightSelectionContext.Provider value={value}>{children}</FlightSelectionContext.Provider>
  );
};

export default FlightSelectionContext;
