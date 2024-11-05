import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
 class Weather {
  humidity: number;
  precipitation: number;
  temperature: number;
  pressure: number;
  wind: number;

  constructor(humidity: number, precipitation: number, temperature: number, pressure: number, wind: number){
    this.humidity = humidity,
    this.precipitation = precipitation,
    this.temperature = temperature,
    this.pressure = pressure,
    this.wind = wind
  }
 }

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5/';
  private apiKey: string| undefined =  process.env.API_KEY;
  private city: string;

  constructor(city: string, baseUrl: string = 'https://api.openweathermap.org/data/2.5/') {
    this.baseUrl = baseUrl,    
    this.city = city
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const url = `${this.baseUrl}weather?q=${query}&appid=${this.apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching location data');
    }
    return response.json();
    }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    }
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseUrl}weather?q=${this.city}&appid=${this.apiKey}`;

  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseUrl}weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.city);
    return this.destructureLocationData(locationData.coord);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherUrl = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error('Error fetching weather data');
    }
    const weatherData = await response.json();
    return this.parseCurrentWeather(weatherData);
  } catch (error: any) {
    console.error('Failed to fetch weather data:', error);
    throw new Error('Could not retrieve weather data at this time');
}
  
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {

    const humidity = response.main?.humidity || 0;
    const precipitation = response.rain ? response.rain['1h'] || 0 : 0;
    const temperature = response.main?.temp || 0;
    const pressure = response.main?.pressure || 0;
    const wind = response.wind?.speed || 0;

    return new Weather(humidity, precipitation, temperature, pressure, wind);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    return weatherData.map(data => {
      const humidity = data.main?.humidity || 0;
      const precipitation = data.rain ? data.rain['1h'] || 0 : 0;
      const temperature = data.main?.temp || 0;
      const pressure = data.main?.pressure || 0;
      const wind = data.wind?.speed || 0;

      return new Weather(humidity, precipitation, temperature, pressure, wind);
    });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    return this.fetchWeatherData(coordinates);
  }
}

export default new WeatherService('New York');
