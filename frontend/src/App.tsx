import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Detector from './pages/Detector';
import Council from './pages/Council';
import Election from './pages/Election';
import Blockchain from './pages/Blockchain';
import Training from './pages/Training';
import About from './pages/About';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/detector" element={<Detector />} />
            <Route path="/council" element={<Council />} />
            <Route path="/election" element={<Election />} />
            <Route path="/blockchain" element={<Blockchain />} />
            <Route path="/training" element={<Training />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#050505',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
