import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// TODO: Define a City class with name and id properties
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    // Set the path to the searchHistory.json file
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error: any) {
      // If the file doesn't exist, return an empty array
      if (error.code === 'ENOENT') {
        return [];
      }
      throw new Error('Error reading search history');
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      throw new Error('Error writing search history');
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.getCities();
    const cityId = (cities.length + 1).toString(); // Simple ID generation
    const newCity = new City(cityId, city);
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    let cities = await this.getCities();
    cities = cities.filter(city => city.id !== id); 
    await this.write(cities);
  }
}

export default new HistoryService();
