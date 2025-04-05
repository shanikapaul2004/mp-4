'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import SearchForm from '../components/SearchForm';
import ErrorDisplay from '../components/ErrorDisplay';
import { Container, Typography, Box, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';

const ForecastPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [forecastData, setForecastData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Fix for hydration errors - only render after mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Get location from URL or use default
    const location = searchParams?.get('location') || 'New York';

    useEffect(() => {
        // Only fetch data after component is mounted on client
        if (isMounted && location) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    setError('');

                    const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
                    const data = await response.json();

                    if (!response.ok) throw new Error(data.error || 'Failed to fetch forecast');

                    setForecastData(data);
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Error fetching forecast data';
                    setError(errorMessage);
                    console.error('API Error:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [location, isMounted]);

    const handleSearch = (newLocation: string) => {
        router.replace(`/forecast?location=${encodeURIComponent(newLocation)}`);
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch (_) {
            return dateStr;
        }
    };

    const getWeatherIcon = (conditions: string) => {
        const lower = conditions.toLowerCase();
        if (lower.includes('sun') || lower.includes('clear')) return <WbSunnyIcon color="warning" sx={{ fontSize: 40 }} />;
        if (lower.includes('rain') || lower.includes('storm')) return <ThunderstormIcon color="info" sx={{ fontSize: 40 }} />;
        if (lower.includes('snow') || lower.includes('ice')) return <AcUnitIcon color="action" sx={{ fontSize: 40 }} />;
        return <CloudIcon color="action" sx={{ fontSize: 40 }} />;
    };

    // Return a loading state until client-side hydration is complete
    if (!isMounted) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ textAlign: 'center' }}>
                    Weather Forecast
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ textAlign: 'center' }}>
                Weather Forecast
            </Typography>

            <Box sx={{ maxWidth: 'md', mx: 'auto', mb: 4 }}>
                <SearchForm onSearch={handleSearch} defaultLocation={location} />
            </Box>

            {error && <ErrorDisplay message={error} />}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : forecastData?.days ? (
                <Grid container spacing={2}>
                    {forecastData.days.slice(0, 7).map((day: any) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={day.datetimeEpoch}>
                            <Card elevation={3} sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {formatDate(day.datetime)}
                                    </Typography>
                                    <Box sx={{ textAlign: 'center', my: 2 }}>
                                        {getWeatherIcon(day.conditions)}
                                        <Typography variant="h4" sx={{ my: 1 }}>
                                            {Math.round(day.temp)}°F
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Chip label={`H: ${Math.round(day.tempmax)}°`} size="small" color="error" />
                                            <Chip label={`L: ${Math.round(day.tempmin)}°`} size="small" color="info" />
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {day.conditions}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography sx={{ textAlign: 'center' }}>
                    {forecastData ? 'No forecast data available' : 'Enter a location to begin'}
                </Typography>
            )}
        </Container>
    );
};

export default dynamic(() => Promise.resolve(ForecastPageContent), { ssr: false });