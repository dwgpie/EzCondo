import { Button } from '@mui/material'
import { getWater, getWaterDetail } from '~/apis/service.api'
import { useEffect, useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'
import html2canvas from 'html2canvas-pro'

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
  const { t, i18n } = useTranslation('electricManager')
  const currentLang = i18n.language
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

  const handleExportImage = async () => {
    if (!ref.current) return
    try {
      const canvas = await html2canvas(ref.current, {
        useCORS: true,
        scale: 2
      })
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = imgData
      link.download = 'hoa-don-nuoc.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Lỗi khi xuất ảnh:', error)
    }
  }

  const handleExportPDF = () => {
    if (!ref.current) return

    const options = {
      margin: 0.3,
      filename: 'hoa-don-nuoc.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
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
            style={{
              width: 'fit-content',
              background: '#fff',
              padding: '12px 24px 24px 24px',
              fontFamily: 'Plus Jakarta Sans',
              border: '2px solid #e5e7eb',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            <img
              src='/imgs/logo/lo23-Photoroom.png'
              alt='Watermark'
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 350,
                opacity: 0.08,
                zIndex: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <img
                src='/imgs/logo/lo23-Photoroom.png'
                alt='Logo'
                style={{ width: 64, height: 64, objectFit: 'cover' }}
              />
              <p style={{ fontWeight: 600, fontSize: 15, color: '#000' }}>{t('apartment_management_board')}</p>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase' }}>
                {t('water_bill')}
              </h2>
              <p style={{ fontWeight: 600 }}>
                <span style={{ color: '#2563eb' }}>{t('no')}</span>:{' '}
                <span style={{ color: 'black' }}> {id?.slice(-5).toUpperCase()}</span>
              </p>
            </div>

            <div style={{ color: '#000', fontSize: 16, fontWeight: 500 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 24 }}>
                <p>
                  <span style={{ color: '#2563eb' }}>{t('apartment_number')}</span>: {water.apartmentNumber}
                </p>
                <p>
                  <span style={{ color: '#2563eb' }}>{t('meter_number')}</span>: {water.meterNumber}
                </p>
                <p style={{ marginTop: 5 }}>
                  <span style={{ color: '#2563eb' }}>{t('owner')}</span>: {water.fullName}
                </p>
                <p style={{ marginTop: 5 }}>
                  <span style={{ color: '#2563eb' }}>Email</span>: {water.email}
                </p>
                <p style={{ marginTop: 20 }}>
                  <span style={{ color: '#2563eb' }}>{t('from')}</span>:{' '}
                  {new Date(water.readingPreDate).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'Asia/Ho_Chi_Minh'
                  })}
                </p>
                <p style={{ marginTop: 20 }}>
                  <span style={{ color: '#2563eb' }}>{t('to')}</span>:{' '}
                  {new Date(water.readingCurrentDate).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'Asia/Ho_Chi_Minh'
                  })}
                </p>
                <p style={{ marginTop: 5 }}>
                  <span style={{ color: '#2563eb' }}>{t('previous_meter')}</span>: {water.pre_water_number}
                </p>
                <p style={{ marginTop: 5 }}>
                  <span style={{ color: '#2563eb' }}>{t('current_meter')}</span>: {water.current_water_number}
                </p>
              </div>
              <table style={{ width: '100%', border: '1px solid #ccc', marginTop: 16 }}>
                <thead>
                  <tr>
                    <th style={{ padding: 8, border: '1px solid #ccc', width: '50%', color: '#2563eb' }}>
                      {t('consumption')}
                    </th>
                    <th style={{ padding: 8, border: '1px solid #ccc', width: '50%', color: '#2563eb' }}>
                      {t('total_price')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: 8, border: '1px solid #ccc', width: '50%' }}>{water.consumption} kWh</td>
                    <td style={{ padding: 8, border: '1px solid #ccc', width: '50%' }}>
                      {Number(water.price).toLocaleString('en-US')} VND
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginTop: 16,
                  columnGap: 30
                }}
              >
                <table style={{ border: '1px solid #ccc', fontSize: 14 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: 6, border: '1px solid #ccc', color: '#2563eb' }}>{t('water_price')}</th>
                      <th style={{ padding: 6, border: '1px solid #ccc', color: '#2563eb' }}>{t('unit_price')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: 6, border: '1px solid #ccc' }}>1 m³</td>
                      <td style={{ padding: 6, border: '1px solid #ccc' }}>
                        {price?.pricePerM3?.toLocaleString('en-US')} VND
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    marginBottom: 20,
                    fontSize: 14
                  }}
                >
                  <p>
                    {t('day')} {day}, {t('month')} {month}, {t('year')} {year}
                  </p>
                  <p>{t('apartment_management_board')}</p>
                  <img src='/imgs/bg/ck-5.png' alt='Signature' style={{ width: 120, marginRight: 32, marginTop: 8 }} />
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end gap-4 mt-5'>
            <Button
              variant='contained'
              onClick={() => (window.location.href = '/manager/add-water-reading')}
              style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}
            >
              {t('cancel')}
            </Button>
            <Button
              variant='contained'
              onClick={handleExportImage}
              style={{ color: 'white', background: '#1eade5', fontWeight: 'semi-bold' }}
            >
              {t('export_image')}
            </Button>
            <Button
              variant='contained'
              onClick={handleExportPDF}
              style={{ color: 'white', background: '#4ace29', fontWeight: 'semi-bold' }}
            >
              {t('export_pdf')}
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
          <p className='mt-2'>{t('no_data_available')}</p>
        </div>
      )}
    </div>
  )
}
