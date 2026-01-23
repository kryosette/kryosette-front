import { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, List, ListItem, ListItemText,
  Chip, IconButton, TextField, Button, FormControl,
  InputLabel, Select, MenuItem, Alert, LinearProgress,
  Card, CardContent, Divider, Tooltip, Grid
} from '@mui/material';
import {
  PlayArrow, Pause, ClearAll, FilterList,
  Search, Refresh, Settings, Info
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const EBPFLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({
    totalEvents: 0,
    byType: {},
    byProcess: {},
    lastUpdate: null
  });
  
  const wsRef = useRef(null);
  const logsEndRef = useRef(null);
  const bufferRef = useRef([]);
  const MAX_LOGS = 1000;

  // Подключение к WebSocket
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:3001/api/websocket/ebpf-logs');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setIsLoading(false);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleNewLog(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      // Переподключаемся через 3 секунды
      setTimeout(connectWebSocket, 3000);
    };
    
    wsRef.current = ws;
  };

  const handleNewLog = (log) => {
    if (isPaused) return;
    
    const newLog = {
      ...log,
      id: Date.now() + Math.random(),
      isNew: true
    };
    
    bufferRef.current = [newLog, ...bufferRef.current].slice(0, MAX_LOGS);
    
    // Обновляем статистику
    updateStats(newLog);
    
    // Обновляем UI (с debounce для производительности)
    requestAnimationFrame(() => {
      setLogs(bufferRef.current);
      applyFilters();
    });
  };

  const updateStats = (log: any) => {
    setStats(prev => {
      const byType = { ...prev.byType };
      byType[log.eventType] = (byType[log.eventType] || 0) + 1;
      
      const byProcess = { ...prev.byProcess };
      if (log.process) {
        byProcess[log.process] = (byProcess[log.process] || 0) + 1;
      }
      
      return {
        totalEvents: prev.totalEvents + 1,
        byType,
        byProcess,
        lastUpdate: new Date().toISOString()
      };
    });
  };

  const applyFilters = () => {
    let filtered = bufferRef.current;
    
    // Фильтр по типу
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.eventType === filterType);
    }
    
    // Фильтр по поиску
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.process?.toLowerCase().includes(term) ||
        log.eventType?.toLowerCase().includes(term) ||
        log.port?.toString().includes(term) ||
        log.raw?.toLowerCase().includes(term)
      );
    }
    
    setFilteredLogs(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterType]);

  const clearLogs = () => {
    bufferRef.current = [];
    setLogs([]);
    setFilteredLogs([]);
    setStats({
      totalEvents: 0,
      byType: {},
      byProcess: {},
      lastUpdate: null
    });
  };

  const getEventColor = (eventType) => {
    const colors = {
      ACCEPT: '#4caf50',
      WRITE: '#2196f3',
      READ: '#ff9800',
      CLOSE: '#f44336',
      CONNECT: '#9c27b0',
      system: '#607d8b'
    };
    return colors[eventType] || '#757575';
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = new Date(timestamp / 1000000); // eBPF timestamp в наносекундах
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const renderLogItem = (log: any, index: number) => (
    <motion.div
      key={log.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ListItem
        sx={{
          borderLeft: `4px solid ${getEventColor(log.eventType)}`,
          mb: 1,
          bgcolor: log.isNew ? 'action.hover' : 'background.paper',
          borderRadius: 1,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'action.selected',
            transform: 'translateX(4px)'
          }
        }}
      >
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                {formatTime(log.timestamp)}
              </Typography>
              <Chip
                label={log.eventType || 'system'}
                size="small"
                sx={{
                  bgcolor: getEventColor(log.eventType),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {log.process || 'System'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PID: {log.pid}
              </Typography>
              {log.fd && (
                <Typography variant="caption" color="text.secondary">
                  FD: {log.fd}
                </Typography>
              )}
              {log.port > 0 && (
                <Chip
                  label={`Port: ${log.port}`}
                  size="small"
                  variant="outlined"
                />
              )}
              {log.size > 0 && (
                <Chip
                  label={`${log.size} bytes`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          }
          secondary={
            log.message || log.raw || 'No message'
          }
          secondaryTypographyProps={{
            sx: {
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          }}
        />
      </ListItem>
    </motion.div>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок и управление */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                🛡️ eBPF Traffic Monitor
              </Typography>
              <Chip
                label={isConnected ? 'Connected' : 'Disconnected'}
                color={isConnected ? 'success' : 'error'}
                size="small"
              />
              <Chip
                label={`${stats.totalEvents} events`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Tooltip title={isPaused ? "Resume" : "Pause"}>
                <IconButton
                  onClick={() => setIsPaused(!isPaused)}
                  color={isPaused ? "default" : "primary"}
                >
                  {isPaused ? <PlayArrow /> : <Pause />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Clear logs">
                <IconButton onClick={clearLogs}>
                  <ClearAll />
                </IconButton>
              </Tooltip>
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  if (wsRef.current) wsRef.current.close();
                  connectWebSocket();
                }}
              >
                Reconnect
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Фильтры и поиск */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Event Type</InputLabel>
              <Select
                value={filterType}
                label="Event Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="ACCEPT">ACCEPT</MenuItem>
                <MenuItem value="WRITE">WRITE</MenuItem>
                <MenuItem value="READ">READ</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(stats.byType).map(([type, count]) => (
                <Chip
                  key={type}
                  label={`${type}: ${count}`}
                  size="small"
                  sx={{
                    bgcolor: getEventColor(type),
                    color: 'white'
                  }}
                  onClick={() => setFilterType(type)}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Статистика */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Top Processes
              </Typography>
              {Object.entries(stats.byProcess)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([process, count]) => (
                  <Box key={process} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{process}</Typography>
                    <Typography variant="body2" fontWeight="bold">{count}</Typography>
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Real-time Events Stream
              </Typography>
              {isLoading ? (
                <LinearProgress />
              ) : (
                <Paper
                  sx={{
                    height: 300,
                    overflow: 'auto',
                    p: 1,
                    bgcolor: 'background.default'
                  }}
                >
                  <AnimatePresence>
                    <List dense>
                      {filteredLogs.slice(0, 50).map(renderLogItem)}
                    </List>
                  </AnimatePresence>
                  <div ref={logsEndRef} />
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Основное окно логов */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Live Logs {filteredLogs.length > 0 && `(${filteredLogs.length})`}
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          {filteredLogs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Info sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary">
                {isConnected 
                  ? searchTerm || filterType !== 'all'
                    ? 'No logs match your filters'
                    : 'Waiting for events...'
                  : 'Connecting to eBPF monitor...'
                }
              </Typography>
            </Box>
          ) : (
            <List>
              <AnimatePresence>
                {filteredLogs.map(renderLogItem)}
              </AnimatePresence>
            </List>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default EBPFLogs;