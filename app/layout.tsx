// No global CSS import needed
import { Inter } from 'next/font/google';
import ThemeRegistry from './ThemeRegistry';

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
    // Use a fixed year instead of dynamic Date()
    const currentYear = "2025";

    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeRegistry>
            {/* All the dynamic content moved to ThemeRegistry */}
            {children}
        </ThemeRegistry>
        </body>
        </html>
    );
}