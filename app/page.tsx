'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchForm from './components/SearchForm';
import WeatherCard from './components/WeatherCard';
import ErrorDisplay from './components/ErrorDisplay';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { WeatherResponse } from '../types/types';

const HomeContent = () => {
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [location, setLocation] = useState('New York');

    // Fetch weather whenever location changes or on initial load
    useEffect(() => {
        fetchWeather(location);
    }, [location]);

    const fetchWeather = async (locationString: string) => {
        try {
            console.log(`Fetching weather for: ${locationString}`); // Debug log
            setLoading(true);
            setError('');

            const response = await fetch(`/api/weather?location=${encodeURIComponent(locationString)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch data');
            }

            console.log('Weather data received'); // Debug log
            setWeatherData(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
            console.error('Error fetching weather:', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (newLocation: string) => {
        console.log(`Search triggered for: ${newLocation}`); // Debug log
        setLocation(newLocation);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
                Weather Forecast App
            </Typography>

            <Box sx={{ maxWidth: 'md', mx: 'auto', mb: 6 }}>
                <SearchForm onSearch={handleSearch} defaultLocation={location} />
            </Box>

            {error && <ErrorDisplay message={error} />}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : weatherData ? (
                <WeatherCard data={weatherData} />
            ) : (
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    No weather data available. Try searching for a location.
                </Typography>
            )}
        </Container>
    );
};

// Disable SSR for home page too
export default dynamic(() => Promise.resolve(HomeContent), { ssr: false });