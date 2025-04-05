'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blue, orange } from '@mui/material/colors';
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Link from 'next/link';

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: blue[700],
        },
        secondary: {
            main: orange[500],
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiAppBar: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
    },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    // Client-side only state
    const [mounted, setMounted] = useState(false);
    const [currentYear, setCurrentYear] = useState("");

    // Only run after hydration
    useEffect(() => {
        setMounted(true);
        setCurrentYear(new Date().getFullYear().toString());
    }, []);

    // Return empty div until client-side hydration is complete
    if (!mounted) {
        return <div style={{ visibility: 'hidden' }}></div>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" color="primary">
                <Toolbar>
                    <WbSunnyIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                            WeatherApp
                        </Link>
                    </Typography>
                    <Button color="inherit" component={Link} href="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} href="/forecast">
                        Forecast
                    </Button>
                </Toolbar>
            </AppBar>

            <main>
                {children}
            </main>

            <Box sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        Weather data provided by VisualCrossing Weather API
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {currentYear} Weather App - Educational Project
                    </Typography>
                </Container>
            </Box>
        </ThemeProvider>
    );
}