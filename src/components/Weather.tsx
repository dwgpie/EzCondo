import { useEffect, useState } from 'react'
import { Droplet, Thermometer, Wind, Cloud, MapPin } from 'lucide-react'

interface WeatherData {
  name: string
  weather: {
    description: string
    icon: string
  }[]
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  wind: {
    speed: number
  }
  clouds: {
    all: number
  }
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          'https://api.openweathermap.org/data/2.5/weather?q=Da Nang&appid=4826c4e083ab858ef406d375b38621e7&units=metric&lang=vi'
        )
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu thời tiết')
        const data = await res.json()
        setWeather(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  if (loading)
    return <div className='flex justify-center items-center h-48 text-gray-600'>Đang tải dữ liệu thời tiết...</div>

  if (error) return <div className='text-red-500 text-center p-4'>Có lỗi xảy ra: {error}</div>

  if (!weather) return <div className='text-center p-4 text-gray-500'>Không có dữ liệu thời tiết</div>

  return (
    <div className='w-[580px] h-[50px] px-2 bg-white rounded-full shadow-sm	text-sm flex items-center justify-between border-1.5 border-blue-200'>
      {/* Icon thời tiết */}
      <div className='flex flex-col items-center min-w-[40px] mr-3'>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className='w-10 h-10 shadow-sm rounded-full'
        />
      </div>

      {/* Tên thành phố */}
      <div className='flex items-center min-w-[80px] space-x-1'>
        <MapPin size={18} className='text-blue-500' />
        <span className='font-medium text-gray-700'>{weather.name}</span>
      </div>

      {/* Nhiệt độ */}
      <div className='flex flex-col items-center min-w-[80px]'>
        <div className='flex items-center space-x-1'>
          <Thermometer size={19} className='text-red-500' />
          <span className='font-medium text-gray-700'>{weather.main.temp.toFixed(1)}°C</span>
        </div>
      </div>

      {/* Mô tả thời tiết */}
      <div className='min-w-[130px] text-center capitalize text-gray-700 text-sm mx-3 border-l-2 border-r-2 border-gray-300 font-medium'>
        {weather.weather[0].description}
      </div>

      {/* Độ ẩm + Gió */}
      <div className='flex flex-col items-start min-w-[110px] text-xs text-gray-600 space-y-1'>
        <div className='flex items-center space-x-1'>
          <Droplet size={15} className='text-cyan-500' />
          <span className='font-medium'>Độ ẩm: {weather.main.humidity}%</span>
        </div>
        <div className='flex items-center space-x-1'>
          <Wind size={15} className='text-sky-500' />
          <span className='font-medium'>Gió: {weather.wind.speed} m/s</span>
        </div>
      </div>

      {/* Độ che phủ mây */}
      <div className='flex items-center min-w-[55px] text-xs text-gray-600 space-x-1'>
        <Cloud size={19} className='text-gray-400' />
        <div className='font-medium'>{weather.clouds.all}%</div>
      </div>
    </div>
  )
}
