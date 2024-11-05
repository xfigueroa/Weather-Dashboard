import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {    
    // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city);
  
  // TODO: save city to search history
  await HistoryService.addCity(city);

    return res.json(weatherData);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error retrieving weather data', error: error.message });
  }
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities(); // Fetch the search history
    return res.json(cities);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error fetching search history', error: error.message });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params; // Extract city ID from URL parameters

  if (!id) {
    return res.status(400).json({ message: 'City ID is required' });
  }

  try {
    await HistoryService.removeCity(id); // Call the service to remove the city
    return res.status(204).send(); // Send a 204 No Content response on successful deletion
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting city from search history', error: error.message });
  }
});

export default router;
