import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [user, setUser] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test API connection
      const response = await api.get('/health');
      
      if (response.data.status === 'OK') {
        setConnectionStatus('Connected to MongoDB API successfully!');
      } else {
        setConnectionStatus('API connection failed');
      }

    } catch (error: any) {
      setConnectionStatus(`Connection failed: ${error.message}`);
    }
  };

  const testAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      console.log('Auth test success:', response.data);
      setUser(response.data);
    } catch (error: any) {
      console.log('Auth test failed:', error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Connection Status:</strong> {connectionStatus}
          </div>
          
          <div>
            <strong>Current User:</strong> {user ? (user as any).email : 'Not logged in'}
          </div>

          <div>
            <strong>API URL:</strong> {import.meta.env.VITE_API_URL}
          </div>

          <Button onClick={testConnection}>
            Test Connection Again
          </Button>

          <Button onClick={testAuth} variant="outline">
            Test Auth
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};