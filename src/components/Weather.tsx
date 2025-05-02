import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, CircularProgress } from '@mui/material'
import { WbSunny, Cloud, WaterDrop, Air } from '@mui/icons-material'

interface WeatherData {
  temperature: number
  weather_descriptions: string[]
  humidity: number
  wind_speed: number
  timestamp: number
}

const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds
const CACHE_KEY = 'weatherData'

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          const parsedData = JSON.parse(cachedData)
          const now = Date.now()

          // If cache is still valid, use it
          if (now - parsedData.timestamp < CACHE_DURATION) {
            setWeather(parsedData)
            setLoading(false)
            setError(null) // Clear any previous errors when using valid cache
            return
          }
        }

        // If no cache or cache expired, fetch new data
        const apiKey = import.meta.env.VITE_WEATHERSTACK_API_KEY
        const response = await fetch(`https://api.weatherstack.com/current?access_key=${apiKey}&query=Ho Chi Minh`)
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error.info)
        }

        const weatherData = {
          temperature: data.current.temperature,
          weather_descriptions: data.current.weather_descriptions,
          humidity: data.current.humidity,
          wind_speed: data.current.wind_speed,
          timestamp: Date.now()
        }

        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(weatherData))
        setWeather(weatherData)
        setLoading(false)
        setError(null) // Clear any previous errors
      } catch (err) {
        console.error('Error fetching weather:', err)
        // If there's an error but we have cached data, use it silently
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          setWeather(JSON.parse(cachedData))
          // Don't set error message when using cache as fallback
        } else {
          setError('Unable to fetch weather data')
        }
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  if (loading) {
    return (
      <Card className='rounded-2xl shadow-md'>
        <CardContent className='flex justify-center items-center h-[200px]'>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='rounded-2xl shadow-md'>
      <CardContent>
        <div className='flex justify-between items-center mb-4'>
          <Typography variant='h6'>Weather in Ho Chi Minh City</Typography>
          {weather && (
            <Typography variant='caption' color='textSecondary' className='text-xs'>
              Updated: {new Date(weather.timestamp).toLocaleTimeString()}
            </Typography>
          )}
        </div>

        {error ? (
          <Typography color='error' className='mb-4 text-sm'>
            {error}
          </Typography>
        ) : (
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <WbSunny className='text-yellow-500' />
              <div>
                <Typography variant='body2' color='textSecondary'>
                  Temperature
                </Typography>
                <Typography variant='h6'>{weather?.temperature}°C</Typography>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Cloud className='text-gray-500' />
              <div>
                <Typography variant='body2' color='textSecondary'>
                  Condition
                </Typography>
                <Typography variant='h6'>{weather?.weather_descriptions[0]}</Typography>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <WaterDrop className='text-blue-500' />
              <div>
                <Typography variant='body2' color='textSecondary'>
                  Humidity
                </Typography>
                <Typography variant='h6'>{weather?.humidity}%</Typography>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Air className='text-green-500' />
              <div>
                <Typography variant='body2' color='textSecondary'>
                  Wind Speed
                </Typography>
                <Typography variant='h6'>{weather?.wind_speed} km/h</Typography>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
