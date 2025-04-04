import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');

    // Validate location
    if (!location) {
        return NextResponse.json(
            { error: 'Location parameter is required' },
            { status: 400 }
        );
    }

    try {
        const API_KEY = process.env.WEATHER_API_KEY;

        // Make sure API key exists
        if (!API_KEY) {
            console.error('API key is missing');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Properly encode the location for the URL
        const encodedLocation = encodeURIComponent(location);
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}?unitGroup=us&key=${API_KEY}&contentType=json`;

        console.log(`Fetching weather for: ${location}`);

        const response = await fetch(url);

        if (!response.ok) {
            console.error(`API error: ${response.status} for location ${location}`);

            if (response.status === 404) {
                return NextResponse.json(
                    { error: 'Location not found. Please check the city name and try again.' },
                    { status: 404 }
                );
            }

            if (response.status === 429) {
                return NextResponse.json(
                    { error: 'API call limit exceeded. Please try again later.' },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: `Weather API error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch weather data. Please try again later.' },
            { status: 500 }
        );
    }
}