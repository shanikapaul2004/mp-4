/**
 * Core types for the Visual Crossing Weather API responses
 */

export interface WeatherResponse {
    resolvedAddress: string;
    address: string;
    timezone: string;
    description: string;
    days: Day[];
    alerts?: Alert[];
    currentConditions: CurrentConditions;
}

export interface CurrentConditions {
    datetime: string;
    temp: number;
    feelslike: number;
    humidity: number;
    precip: number;
    precipprob: number;
    preciptype?: string[];
    windspeed: number;
    winddir: number;
    pressure: number;
    visibility: number;
    cloudcover: number;
    uvindex: number;
    conditions: string;
    icon: string;
    sunrise: string;
    sunset: string;
    moonphase: number;
}

export interface Day {
    datetime: string;
    datetimeEpoch: number;
    tempmax: number;
    tempmin: number;
    temp: number;
    feelslikemax: number;
    feelslikemin: number;
    feelslike: number;
    humidity: number;
    precip: number;
    precipprob: number;
    preciptype?: string[];
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    uvindex: number;
    sunrise: string;
    sunset: string;
    conditions: string;
    description: string;
    icon: string;
    hours: Hour[];
}

export interface Hour {
    datetime: string;
    temp: number;
    feelslike: number;
    humidity: number;
    precip: number;
    precipprob: number;
    preciptype?: string[];
    windspeed: number;
    conditions: string;
    icon: string;
}

export interface Alert {
    event: string;
    headline: string;
    description: string;
    onset: string;
    ends: string;
}

// Types for API request parameters
export interface WeatherRequestParams {
    location: string;
    days?: number;
    type?: 'forecast' | 'current';
}