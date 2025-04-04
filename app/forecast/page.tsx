import SearchForm from '../components/SearchForm';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Divider,
    Alert,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CloudIcon from '@mui/icons-material/Cloud';

export default async function ForecastPage({
                                               searchParams
                                           }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const location = typeof searchParams.location === 'string' ? searchParams.location : 'New York';
    let forecastData = null;
    let error = null;

    try {
        // Call our API route for forecast
        const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || ''}/api/weather?location=${encodeURIComponent(location)}&days=7&type=forecast`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error: ${response.status}`);
        }

        forecastData = await response.json();
    } catch (err: any) {
        error = err.message || 'Failed to fetch forecast data';
        console.error('Error fetching forecast:', err);
    }

    // Format date to readable string - ensuring consistent output on server and client
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            // Use fixed English locale rather than user's locale to ensure consistency
            return new Intl.DateTimeFormat('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }).format(date);
        } catch (e) {
            // Fallback if date parsing fails
            return dateStr;
        }
    };

    // Function to get the appropriate weather icon based on conditions
    const getWeatherIcon = (conditions: string) => {
        const lowerCaseConditions = conditions.toLowerCase();
        if (lowerCaseConditions.includes('sun') || lowerCaseConditions.includes('clear')) {
            return <WbSunnyIcon color="warning" sx={{ fontSize: 40 }} />;
        } else if (lowerCaseConditions.includes('rain') || lowerCaseConditions.includes('storm')) {
            return <ThunderstormIcon color="info" sx={{ fontSize: 40 }} />;
        } else if (lowerCaseConditions.includes('snow') || lowerCaseConditions.includes('ice')) {
            return <AcUnitIcon color="action" sx={{ fontSize: 40 }} />;
        } else {
            return <CloudIcon color="action" sx={{ fontSize: 40 }} />;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ textAlign: 'center' }}>
                Weather Forecast
            </Typography>

            <Box sx={{ maxWidth: 'md', mx: 'auto', mb: 4 }}>
                <SearchForm defaultLocation={location} />
            </Box>

            {error ? (
                <ErrorDisplay message={error} />
            ) : forecastData ? (
                <Box>
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            {forecastData.resolvedAddress}
                        </Typography>

                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                            {forecastData.description}
                        </Typography>

                        {forecastData.alerts && forecastData.alerts.length > 0 && (
                            <Box sx={{ mt: 2, mb: 3 }}>
                                <Alert severity="warning">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Weather Alerts
                                    </Typography>
                                    {forecastData.alerts.map((alert: any, index: number) => (
                                        <Box key={index} sx={{ mt: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {alert.event}
                                            </Typography>
                                            <Typography variant="body2">{alert.description}</Typography>
                                        </Box>
                                    ))}
                                </Alert>
                            </Box>
                        )}
                    </Paper>

                    <Typography variant="h5" sx={{ mb: 3 }}>7-Day Forecast</Typography>

                    <Grid container spacing={2}>
                        {forecastData.days.map((day: any, index: number) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card raised={index === 0} sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                                            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: index === 0 ? 'primary.main' : 'inherit' }}>
                                                {formatDate(day.datetime)}
                                            </Typography>

                                            <Box sx={{ my: 2 }}>
                                                {getWeatherIcon(day.conditions)}
                                            </Box>

                                            <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                                                {Math.round(day.temp)}°F
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                                                <Chip
                                                    label={`High: ${Math.round(day.tempmax)}°F`}
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={`Low: ${Math.round(day.tempmin)}°F`}
                                                    size="small"
                                                    color="info"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 1.5 }} />

                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                                                {day.conditions}
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                <Typography variant="body2">
                                                    Humidity: {day.humidity}%
                                                </Typography>
                                                <Typography variant="body2">
                                                    Wind: {Math.round(day.windspeed)} mph
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ) : (
                <Box sx={{ textAlign: 'center', p: 8 }}>
                    <Typography>Loading forecast data...</Typography>
                </Box>
            )}
        </Container>
    );
}