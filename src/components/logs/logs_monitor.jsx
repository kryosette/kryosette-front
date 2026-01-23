// components/LogMonitor.jsx
import React, { useState, useEffect, useRef } from 'react';
import LogWebSocket from '../../utils/websockets';

const LogMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    accept: 0,
    write: 0,
    read: 0
  });
  
  const logsEndRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // Инициализируем WebSocket
    wsRef.current = new LogWebSocket('ws://localhost:9001');
    wsRef.current.connect();

    const removeListener = wsRef.current.addListener((log) => {
      setLogs(prev => {
        const newLogs = [log, ...prev].slice(0, 1000); // Ограничиваем 1000 записей
        
        // Обновляем статистику
        setStats(prevStats => ({
          total: prevStats.total + 1,
          accept: log.event_type === 'ACCEPT' ? prevStats.accept + 1 : prevStats.accept,
          write: log.event_type === 'WRITE' ? prevStats.write + 1 : prevStats.write,
          read: log.event_type === 'READ' ? prevStats.read + 1 : prevStats.read
        }));

        return newLogs;
      });

      setIsConnected(true);
    });

    return () => {
      if (wsRef.current) {
        removeListener();
        wsRef.current.disconnect();
      }
    };
  }, []);

  // Автопрокрутка к последнему логу
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    if (filter && !log.pid_name.toLowerCase().includes(filter.toLowerCase()) &&
        !log.data_hex.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    if (eventTypeFilter !== 'ALL' && log.event_type !== eventTypeFilter) {
      return false;
    }
    return true;
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp / 1000000); // Наносекунды в миллисекунды
    return date.toLocaleTimeString('ru-RU', { 
      hour12: false,
      fractionalSecondDigits: 3
    });
  };

  const getEventColor = (eventType) => {
    switch(eventType) {
      case 'ACCEPT': return 'bg-blue-100 border-blue-300';
      case 'WRITE': return 'bg-green-100 border-green-300';
      case 'READ': return 'bg-purple-100 border-purple-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setStats({ total: 0, accept: 0, write: 0, read: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок и статистика */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            eBPF Log Monitor
          </h1>
          <div className="flex items-center space-x-4 mb-4">
            <div className={`px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected ? '✅ Подключено' : '❌ Отключено'}
            </div>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Очистить логи
            </button>
          </div>
          
          {/* Статистика */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="text-sm text-gray-500">Всего событий</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
              <div className="text-sm text-blue-500">ACCEPT</div>
              <div className="text-2xl font-bold text-blue-700">{stats.accept}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-green-200">
              <div className="text-sm text-green-500">WRITE</div>
              <div className="text-2xl font-bold text-green-700">{stats.write}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-purple-200">
              <div className="text-sm text-purple-500">READ</div>
              <div className="text-2xl font-bold text-purple-700">{stats.read}</div>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Фильтр по процессу или данным..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="ALL">Все события</option>
                <option value="ACCEPT">Accept</option>
                <option value="WRITE">Write</option>
                <option value="READ">Read</option>
              </select>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-600">Автопрокрутка</span>
              </label>
            </div>
          </div>
        </div>

        {/* Таблица логов */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Время
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Процесс
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FD / Порт
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Размер
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Данные (HEX)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log, index) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 ${getEventColor(log.event_type)}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {log.pid_name}
                      </div>
                      <div className="text-sm text-gray-500">PID: {log.pid}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        log.event_type === 'ACCEPT' ? 'bg-blue-100 text-blue-800' :
                        log.event_type === 'WRITE' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {log.event_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>FD: {log.sockfd}</div>
                      <div className="text-gray-500">Port: {log.port}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.size} байт
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-gray-800 break-all max-w-xs">
                        {log.data_hex.match(/.{1,32}/g)?.map((chunk, i) => (
                          <div key={i} className="mb-1">
                            {chunk.match(/.{1,2}/g)?.join(' ')}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Нет логов для отображения
            </div>
          )}
          
          <div ref={logsEndRef} />
        </div>

        {/* Подвал с информацией */}
        <div className="mt-6 text-sm text-gray-500">
          <p>• Отображается {filteredLogs.length} из {logs.length} записей</p>
          <p>• WebSocket: ws://localhost:9001</p>
          <p>• Данные обновляются в реальном времени</p>
        </div>
      </div>
    </div>
  );
};

export default LogMonitor;