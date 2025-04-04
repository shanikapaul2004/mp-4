'use client';

import { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import WeatherCard from './components/WeatherCard';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';

export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsClient(true);

        // Fetch initial data
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/weather?location=${encodeURIComponent('New York')}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch initial weather data');
                }

                setWeatherData(data);
            } catch (err) {
                console.error('Error fetching initial data:', err);
                // Don't show error for initial load
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleSearch = async (location: string) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch weather data');
            }

            setWeatherData(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching weather data');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Show loading state until client-side rendering is active
    if (!isClient) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Weather Forecast App
                </Typography>
                <CircularProgress sx={{ mt: 4 }} />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
                Weather Forecast App
            </Typography>

            <Box sx={{ maxWidth: 'md', mx: 'auto', mb: 6 }}>
                <SearchForm onSearch={handleSearch} />
            </Box>

            {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : weatherData ? (
                <WeatherCard data={weatherData} />
            ) : (
                <Typography sx={{ textAlign: 'center', my: 4 }}>
                    Enter a location to see the weather forecast
                </Typography>
            )}
        </Container>
    );
}