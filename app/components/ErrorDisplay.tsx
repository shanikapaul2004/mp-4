'use client';

import { Alert, AlertTitle } from '@mui/material';

interface ErrorDisplayProps {
    message: string;
}

export default function ErrorDisplay({ message }: ErrorDisplayProps) {
    return (
        <Alert severity="error" sx={{ my: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {message}
        </Alert>
    );
}