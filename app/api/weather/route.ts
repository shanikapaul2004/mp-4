import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');

    // Validate location
    if (!location) {
        console.log('API Error: Missing location parameter');
        return NextResponse.json(
            { error: 'Location parameter is required' },
            { status: 400 }
        );
    }

    try {
        const API_KEY = process.env.WEATHER_API_KEY;

        // Make sure API key exists
        if (!API_KEY) {
            console.error('API Error: Missing API key');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Properly encode the location for the URL
        const encodedLocation = encodeURIComponent(location);
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}?unitGroup=us&key=${API_KEY}&contentType=json`;

        console.log(`API: Fetching weather for: ${location}`);

        // Add headers to ensure JSON response
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        // Check if the response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Response is not JSON:', contentType);
            const text = await response.text();
            console.error(`First 100 chars of response: ${text.substring(0, 100)}`);
            return NextResponse.json(
                { error: 'Invalid response from weather service' },
                { status: 500 }
            );
        }

        console.log(`API: Response status: ${response.status}`);

        if (!response.ok) {
            console.error(`API Error: ${response.status} for location ${location}`);

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
        console.log(`API: Successfully retrieved weather data for ${location}`);

        return NextResponse.json(data);
    } catch (error) {
        console.error('API Error fetching weather data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch weather data. Please try again later.' },
            { status: 500 }
        );
    }
}