import Head from 'next/head';
import { Container, Box, Alert } from '@mui/material';
import EBPFLogs from './api/websocket/EBPFLogs';

export default function EBpfLogsPage() {
  return (
    <>
      <Head>
        <title>eBPF Traffic Monitor</title>
        <meta name="description" content="Real-time eBPF network traffic monitoring" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Monitoring network traffic in real-time using eBPF. Events are streamed via WebSocket.
        </Alert>
        
        <EBPFLogs />
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            eBPF Translator v1.0 • Live monitoring • {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </>
  );
}