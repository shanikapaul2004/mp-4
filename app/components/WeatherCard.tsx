'use client';

import { Paper, Typography, Grid, Box, Divider } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import { WeatherResponse } from '../types';

interface WeatherCardProps {
    data: WeatherResponse;
}

export default function WeatherCard({ data }: WeatherCardProps) {
    if (!data || !data.currentConditions) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">No weather data available</Typography>
            </Paper>
        );
    }

    const current = data.currentConditions;
    const temp = Math.round(current.temp);
    const feelsLike = Math.round(current.feelslike);

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {data.resolvedAddress}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                    {temp}°F
                </Typography>
                <Typography variant="h6">
                    {current.conditions}
                </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
                Feels like: {feelsLike}°F
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <WaterDropIcon color="primary" sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="body2">Humidity</Typography>
                        <Typography variant="body1">{current.humidity}%</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <AirIcon sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="body2">Wind</Typography>
                        <Typography variant="body1">{Math.round(current.windspeed)} mph</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <ThermostatIcon color="error" sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="body2">UV Index</Typography>
                        <Typography variant="body1">{current.uvindex}</Typography>
                    </Box>
                </Grid>
            </Grid>

            {data.days && data.days.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>Today&apos;s Forecast</Typography>
                    <Typography variant="body2">
                        {data.days[0].description || `High: ${Math.round(data.days[0].tempmax)}°F, Low: ${Math.round(data.days[0].tempmin)}°F`}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}