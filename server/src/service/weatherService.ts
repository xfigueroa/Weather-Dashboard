import dotenv from 'dotenv';
dotenv.config();

// Interface for Coordinates
interface Coordinates {
  latitude: number;
  longitude: number;
}

// Class for Weather data
class Weather {
  humidity: number;
  precipitation: number;
  temperature: number;
  pressure: number;
  wind: number;

  constructor(humidity: number, precipitation: number, temperature: number, pressure: number, wind: number) {
    this.humidity = humidity;
    this.precipitation = precipitation;
    this.temperature = temperature;
    this.pressure = pressure;
    this.wind = wind;
  }
}

// WeatherService class
class WeatherService {
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5/';
  private apiKey: string | undefined = process.env.API_KEY;
  private city: string;

  constructor(city: string, baseUrl: string = 'https://api.openweathermap.org/data/2.5/') {
    this.baseUrl = baseUrl;
    this.city = city;
  }

  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = `${this.baseUrl}weather?q=${query}&appid=${this.apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error fetching location data');
    }

    const locationData = await response.json();
    return {
      latitude: locationData.coord.lat,
      longitude: locationData.coord.lon,
    };
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.city);
    return locationData;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseUrl}forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const forecastUrl = this.buildWeatherQuery(coordinates);

    const response = await fetch(forecastUrl);

    if (!response.ok) {
      throw new Error('Error fetching forecast data');
    }

    const forecastData = await response.json();
    const forecastArray = this.buildForecastArray(forecastData.list);

    return forecastArray;
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map(data => {
      const humidity = data.main?.humidity || 0;
      const precipitation = data.rain ? data.rain['1h'] || 0 : 0;
      const temperature = data.main?.temp || 0;
      const pressure = data.main?.pressure || 0;
      const wind = data.wind?.speed || 0;

      return new Weather(humidity, precipitation, temperature, pressure, wind);
    });
  }
}

export default new WeatherService('New York'); 