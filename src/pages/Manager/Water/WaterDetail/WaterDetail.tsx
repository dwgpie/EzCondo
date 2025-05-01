import { Button } from '@mui/material'
import { getWater, getWaterDetail } from '~/apis/service.api'
import { useEffect, useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'

interface FormData {
  waterReadingId?: string
  fullName: string
  phoneNumber: string
  email: string
  apartmentNumber: string
  meterNumber: string
  readingPreDate: string
  readingCurrentDate: string
  pre_water_number: number
  current_water_number: number
  consumption: number
  price: number
}

interface WaterPrice {
  id?: string
  pricePerM3: number
}

export default function WaterDetail() {
  const [loading, setLoading] = useState(false)
  const { progress, buffer } = useBufferProgress(loading)
  const [water, setWater] = useState<FormData | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1 // vì getMonth() tính từ 0
  const year = today.getFullYear()
  const [price, setPrice] = useState<WaterPrice | null>(null)

  const getUserIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
  }

  const id = getUserIdFromURL()

  const getWaterMutation = useMutation({
    mutationFn: async (id: string) => {
      setLoading(true)
      const response = await getWaterDetail(id)
      return response.data
    },
    onSuccess: (data) => {
      setWater(data)
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  })

  useEffect(() => {
    if (id) {
      getWaterMutation.mutate(id)
    }
  }, [id])

  const handleExport = () => {
    if (!ref.current) return

    const options = {
      margin: 0.3,
      filename: 'hoa-don-nuoc.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        backgroundColor: null,
        onclone: (document: Document) => {
          const elements = document.getElementsByClassName('border-gray-300')
          for (let i = 0; i < elements.length; i++) {
            ;(elements[i] as HTMLElement).style.borderColor = '#d1d5db'
          }
        }
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }

    window.html2pdf().set(options).from(ref.current).save()
  }

  const waterPriceMutation = useMutation({
    mutationFn: async () => {
      const response = await getWater()
      return response.data
    },
    onSuccess: (data) => {
      setPrice(data)
    }
  })

  useEffect(() => {
    waterPriceMutation.mutate()
  }, [])

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      {water ? (
        <>
          <div
            ref={ref}
            className="px-8 py-3 pb-0 max-w-[700px] mx-auto border-2 bg-white border-gray-300 font-['Plus_Jakarta_Sans'] transition-all duration-300"
          >
            {/* Header */}
            <div className='flex justify-between items-center'>
              <p className='font-semibold text-lg'>Apartment Management Board</p>
              <img src='/public/imgs/logo/lo23-Photoroom.png' alt='Logo' className='w-16 h-16 object-cover' />
            </div>

            <div className='text-center mb-8'>
              <h2 className='text-2xl mt-2 font-bold text-[#2c3e50] uppercase tracking-wide leading-snug'>
                Water Bill
              </h2>
              <p className='font-semibold'>No: {id?.slice(-5).toUpperCase()}</p>
            </div>

            <div
              style={{
                color: '#000',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <div className='text-sm font-medium text-black space-y-2'>
                <div className='grid grid-cols-2 gap-y-1'>
                  <p>Apartment number: {water.apartmentNumber}</p>
                  <p>Meter number: {water.meterNumber}</p>

                  <p>Owner: {water.fullName}</p>
                  <p>Email: {water.email}</p>

                  <p>From: {new Date(water.readingPreDate).toLocaleDateString('en-US')}</p>
                  <p>To: {new Date(water.readingCurrentDate).toLocaleDateString('en-US')}</p>

                  <p>Previous Meter: {water.pre_water_number}</p>
                  <p>Current Meter: {water.current_water_number}</p>
                </div>
              </div>

              <table className='text-sm w-full border border-gray-300 mt-5'>
                <thead>
                  <tr>
                    <th className='px-3 py-2 border border-gray-300 text-left'>Consumption</th>
                    <th className='px-3 py-2 border border-gray-300 text-left'>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='px-3 py-2 border border-gray-300'>{water.consumption} m³</td>
                    <td className='px-3 py-2 border border-gray-300'>{water.price.toLocaleString('en-US')} VND</td>
                  </tr>
                </tbody>
              </table>

              <div className='flex items-center justify-between'>
                <table className='text-sm w-auto border border-gray-300'>
                  <thead>
                    <tr>
                      <th className='px-2 py-1 border border-gray-300 text-left'>Water Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {price ? (
                      <tr key={price.id}>
                        <td className='px-2 py-1 border border-gray-300'>
                          {price.pricePerM3.toLocaleString('en-US')} VND
                        </td>
                      </tr>
                    ) : (
                      <div>
                        <p className='px-2 py-1 border border-gray-300'>No data available</p>
                      </div>
                    )}
                  </tbody>
                </table>
                <div className='flex flex-col items-end mt-10 mb-5 text-sm'>
                  <p>
                    Day {day}, Month {month}, Year {year}
                  </p>
                  <p>Apartment Management Board</p>
                  <img src='/public/imgs/bg/ck-5.png' alt='Signature' className='w-30 mr-8 mt-2' />
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-4 mt-3'>
            <Button
              variant='contained'
              onClick={() => (window.location.href = '/manager/add-water-reading')}
              style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={handleExport}
              style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold' }}
            >
              export PDF
            </Button>
          </div>
        </>
      ) : (
        <div className='mt-3 flex flex-col items-center text-gray-500'>
          <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' viewBox='0 0 24 24'>
            <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'>
              <path d='m17.121 21.364l2.122-2.121m2.121-2.122l-2.121 2.122m0 0L17.12 17.12m2.122 2.122l2.121 2.121M4 6v6s0 3 7 3s7-3 7-3V6' />
              <path d='M11 3c7 0 7 3 7 3s0 3-7 3s-7-3-7-3s0-3 7-3m0 18c-7 0-7-3-7-3v-6' />
            </g>
          </svg>
          <p className='mt-2'>No data available</p>
        </div>
      )}
    </div>
  )
}
