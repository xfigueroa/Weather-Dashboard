import dotenv from 'dotenv';
dotenv.config();

// Interface for Coordinates
interface Coordinates {
  latitude: number;
  longitude: number;
}

// Class for Weather data
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;   
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
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
    const dailyForecast = [];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
   
    for (let i = 0; i <= 5; i++) {
      const dailyData = weatherData[i * 8]; 
  
      if (dailyData) {
        const city = this.city;

        const dateObj = new Date(dailyData.dt_txt);
        const date = daysOfWeek[dateObj.getUTCDay()]; 
        const icon = dailyData.weather[0]?.icon || ''; 
        const iconDescription = dailyData.weather[0]?.description || '';
        const tempF = parseFloat(((dailyData.main?.temp - 273.15) * (9 / 5) + 32).toFixed(2)); 
        const windSpeed = dailyData.wind?.speed || 0;
        const humidity = dailyData.main?.humidity || 0; 
  
        dailyForecast.push(
          new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity)
        );
      }
    }
  
    return dailyForecast;
  }
  
}


export default new WeatherService('New York'); 