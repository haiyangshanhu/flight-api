import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from './ui/table';

function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

export const InfiniteScrollTable = ({
  columns,
  fetchData,
  renderRow,
  loadingMessage = 'Loading more items...',
  emptyMessage = 'No items available',
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // 初始加载
  useEffect(() => {
    if (!initialLoadDone) {
      loadItems(0);
      setInitialLoadDone(true);
    }
  }, [initialLoadDone]);

  // 滚动监听
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (loading || !hasMore) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 300) {
        console.log('触发滚动加载，当前页面:', page);
        loadItems(page);
      }
    }, 300); // 300ms节流时间

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page]);

  // 加载数据函数
  const loadItems = async (pageToLoad) => {
    // 避免在加载过程中重复加载
    if (loading || pageToLoad < page) return;

    try {
      console.log('开始加载数据，页码:', pageToLoad);
      setLoading(true);

      const result = await fetchData(pageToLoad);
      console.log('数据加载结果:', result);

      if (result && result.data && result.data.length > 0) {
        // 去重处理 - 使用Map基于id过滤重复项
        setItems((prevItems) => {
          // 创建之前项目的Map
          const existingItemsMap = new Map();
          prevItems.forEach((item) => {
            existingItemsMap.set(item._clientId || item.id, true);
          });

          // 过滤掉已存在的项目
          const newUniqueItems = result.data.filter(
            (item) => !existingItemsMap.has(item._clientId || item.id),
          );

          // 只添加新的唯一项目
          return [...prevItems, ...newUniqueItems];
        });

        setHasMore(result.hasMore);
        setTotalPages(result.totalPages || totalPages);
        setPage(pageToLoad + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('加载数据出错:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className || ''}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => renderRow(item))
          ) : !loading ? (
            <TableRow>
              <td colSpan={columns.length} className="py-6 text-center text-gray-500">
                {emptyMessage}
              </td>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      {/* 加载状态指示器 */}
      {loading && (
        <div className="py-6 text-center">
          <div className="flex justify-center items-center space-x-2">
            <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce"></div>
            <span className="ml-2 text-gray-500">{loadingMessage}</span>
          </div>
        </div>
      )}

      {/* 没有更多数据的提示 */}
      {!loading && !hasMore && items.length > 0 && (
        <div className="py-4 text-center">
          <div className="text-sm text-gray-400">no more flights</div>
        </div>
      )}

      {items.length > 0 && (
        <div className="text-xs text-gray-400 text-center mt-2">
          Page {page} / {totalPages} • loaded {items.length} flights
        </div>
      )}
    </div>
  );
};
