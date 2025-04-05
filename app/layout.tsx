// No global CSS import needed
import { Inter } from 'next/font/google';
import ThemeRegistry from './ThemeRegistry';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Weather Forecast App',
    description: 'Get real-time weather forecasts for any location',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeRegistry>
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
                       Data from VisualCrossing Weather API
                    </Typography>
                </Container>
            </Box>
        </ThemeRegistry>
        </body>
        </html>
    );
}