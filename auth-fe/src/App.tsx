// src/App.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store';
import AppRoutes from './routes';
import { initializeAuth } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  // Initialize auth when app starts
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Once auth is loaded, render the routes
  return <AppRoutes />;
}

export default App;