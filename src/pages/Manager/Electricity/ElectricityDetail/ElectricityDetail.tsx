import { Button } from '@mui/material'
import { getElectricDetail } from '~/apis/service.api'
import { useEffect, useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined'

interface FormData {
  id?: string
  fullName: string
  phoneNumber: string
  email: string
  apartmentNumber: string
  meterNumber: string
  readingDate: string
  pre_electric_number: number
  current_electric_number: number
  consumption: number
  price: number
}

export default function ElectricityDetail() {
  const [electric, setElectric] = useState<FormData | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1 // vì getMonth() tính từ 0
  const year = today.getFullYear()

  const getUserIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('electricReadingId')
  }

  const id = getUserIdFromURL()

  const getElectricMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await getElectricDetail(id)
      return response.data
    },
    onSuccess: (data) => {
      setElectric(data)
    }
  })

  useEffect(() => {
    if (id) {
      getElectricMutation.mutate(id)
    }
  }, [id])

  const handleExport = () => {
    if (!ref.current) return

    const options = {
      margin: 0.3,
      filename: 'hoa-don-dien.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }

    window.html2pdf().set(options).from(ref.current).save()
  }

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {electric ? (
        <>
          <div
            ref={ref}
            style={{
              padding: '32px 32px 0px 32px',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              maxWidth: '700px',
              margin: '10px auto',
              border: '2px solid #ccc',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Header */}
            <div className='relative'>
              <p className='font-medium text-[20px]'>Apartment Management Board</p>
              <img
                className='absolute w-[100px] h-[100px] object-cover top-0 right-0'
                src='/public/imgs/logo/lo23-Photoroom.png'
                alt='avt'
              />
            </div>
            <div
              style={{
                position: 'relative',
                textAlign: 'center',
                padding: '0px 20px',
                marginTop: '20px',
                borderRadius: '16px',
                marginBottom: '32px'
              }}
            >
              <h2
                style={{
                  fontSize: '34px',
                  fontWeight: '700',
                  color: '#2c3e50',
                  letterSpacing: '1px',
                  margin: '0',
                  textTransform: 'uppercase',
                  lineHeight: '1.3'
                }}
              >
                Electricity Bill
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
              <p className=''>Apartment number: {electric.apartmentNumber}</p>
              <table className='border-separate border-spacing-y-2  w-full '>
                <tr>
                  <td className='px-0 py-2'>
                    <p>
                      From:{' '}
                      {new Date(
                        new Date(electric.readingDate).setMonth(new Date(electric.readingDate).getMonth() - 1)
                      ).toLocaleDateString('en-US')}
                    </p>
                  </td>
                  <td className='px-4 py-2'>
                    <p>To: {new Date(electric.readingDate).toLocaleDateString('en-US')}</p>
                  </td>
                </tr>
                <tr>
                  <td className='px-0 py-2'>
                    <p>Owner: {electric.fullName}</p>
                  </td>
                  <td className='px-4 py-2'>
                    <p>Email: {electric.email}</p>
                  </td>
                </tr>
              </table>

              <p className='mt-[20px]'>Meter number: {electric.meterNumber}</p>
              <p className='mt-[10px]'>Previous Meter: {electric.pre_electric_number}</p>
              <p className='mt-[10px]'>Current Meter: {electric.current_electric_number}</p>
              <table className='border-1 border-separate border-spacing-y-2  w-full mt-[20px] '>
                <tr>
                  <td className='px-2 py-2'>Consumption</td>
                  <td className='px-4 py-2'>Unit Price</td>
                  <td className='px-2 py-2'>Total Price</td>
                </tr>
                <tr>
                  <td className='px-2 py-2'>
                    <p>{electric.consumption} kWh</p>
                  </td>
                  <td className='px-4 py-2'>
                    <p>{electric.price} VND</p>
                  </td>
                  <td className='px-2 py-2'>
                    <p>{electric.price * electric.consumption} VND</p>
                  </td>
                </tr>
              </table>

              <div className='flex flex-col items-end mt-[40px] mb-[20px]'>
                <p>
                  Day {day}, Month {month}, Year {year}
                </p>
                <p>Apartment Management Board</p>
                <img src='/public/imgs/bg/ck-5.png' alt='Signature' className='w-[200px]' />
              </div>

              {/* ['Total Price', `${electric.price.toLocaleString('en-US')} VND`] */}
            </div>
          </div>

          <div className='flex justify-end gap-4'>
            <Button
              variant='contained'
              onClick={() => window.history.back()}
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
        <div className='mt-3 text-center text-gray-500'>
          <PlagiarismOutlinedIcon fontSize='large' />
          <p className='mt-2'>No data available</p>
        </div>
      )}
    </div>
  )
}
