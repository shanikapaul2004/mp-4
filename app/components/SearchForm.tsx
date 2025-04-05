'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, Box, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFormProps {
    onSearch: (location: string) => void;
    defaultLocation?: string;
}

export default function SearchForm({ onSearch, defaultLocation = '' }: SearchFormProps) {
    const [location, setLocation] = useState('');

    // Sync with defaultLocation after hydration
    useEffect(() => {
        setLocation(defaultLocation);
    }, [defaultLocation]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = location.trim();
        if (trimmed) {
            onSearch(trimmed);
            setLocation(trimmed); // Clear input after search
        }
    };

    return (
        <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    fullWidth
                    label="Enter city or location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    variant="outlined"
                    autoComplete="off"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!location.trim()}
                    startIcon={<SearchIcon />}
                >
                    Search
                </Button>
            </Box>
        </Paper>
    );
}