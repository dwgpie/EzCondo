import { Button } from '@mui/material'
import { getElectricDetail } from '~/apis/service.api'
import { ToastContainer } from 'react-toastify'
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
      console.log('Data received:', data)
      setElectric(data)
    }
  })

  useEffect(() => {
    if (id) {
      getElectricMutation.mutate(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className='pt-5 mx-5 z-13' style={{ height: 'calc(100vh - 80px)' }}>
      <ToastContainer />
      <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
        {electric ? (
          <>
            {/* <div ref={ref} style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>HÓA ĐƠN TIỀN ĐIỆN</h2>
                <p style={{ color: '#000000' }}>Ngày: {new Date(electric.readingDate).toLocaleDateString('vi-VN')}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#000000' }}>
                  <strong>Họ và tên:</strong> {electric.fullName}
                </p>
                <p style={{ color: '#000000' }}>
                  <strong>Email:</strong> {electric.email}
                </p>
                <p style={{ color: '#000000' }}>
                  <strong>Số điện thoại:</strong> {electric.phoneNumber}
                </p>
                <p style={{ color: '#000000' }}>
                  <strong>Số căn hộ:</strong> {electric.apartmentNumber}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#000000' }}>
                  Chi tiết tiêu thụ
                </h3>
                <p style={{ color: '#000000' }}>
                  <strong>Chỉ số cũ:</strong> {electric.pre_electric_number}
                </p>
                <p style={{ color: '#000000' }}>
                  <strong>Chỉ số mới:</strong> {electric.current_electric_number}
                </p>
                <p style={{ color: '#000000' }}>
                  <strong>Tiêu thụ:</strong> {electric.consumption} kWh
                </p>
                <p style={{ color: '#000000' }}>
                  <strong>Thành tiền:</strong> {electric.price.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            </div> */}

            <div
              ref={ref}
              style={{
                padding: '32px',
                background: '#f9fbfd',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                maxWidth: '960px',
                margin: '40px auto',
                border: '2px solid #d0e0f0',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Header */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px 20px',
                  background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
                  borderRadius: '16px',
                  border: '1px solid #c9dff0',
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
                <p
                  style={{
                    color: '#5d6d7e',
                    fontSize: '16px',
                    marginTop: '10px',
                    fontWeight: '500'
                  }}
                >
                  Date: {new Date(electric.readingDate).toLocaleDateString('en-US')}
                </p>
              </div>

              {/* Personal Info */}
              <div
                style={{
                  marginBottom: '32px',
                  padding: '28px',
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e0eaf0',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    color: '#2c3e50',
                    marginBottom: '20px',
                    fontWeight: '600',
                    borderBottom: '1px solid #ecf0f1',
                    paddingBottom: '10px',
                    textTransform: 'uppercase'
                  }}
                >
                  Customer Information
                </h3>
                {[
                  ['Full Name', electric.fullName],
                  ['Email', electric.email],
                  ['Phone Number', electric.phoneNumber],
                  ['Apartment Number', electric.apartmentNumber]
                ].map(([label, value], index) => (
                  <p
                    key={index}
                    style={{
                      color: '#34495e',
                      fontSize: '16px',
                      marginBottom: '12px',
                      fontWeight: '500',
                      lineHeight: '1.6'
                    }}
                  >
                    <strong>{label}:</strong> {value}
                  </p>
                ))}
              </div>

              {/* Consumption Info */}
              <div
                style={{
                  padding: '28px',
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e0eaf0',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '20px',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #ecf0f1',
                    paddingBottom: '10px'
                  }}
                >
                  Consumption Details
                </h3>

                {[
                  ['Previous Meter Reading', electric.pre_electric_number],
                  ['Current Meter Reading', electric.current_electric_number],
                  ['Consumption', `${electric.consumption} kWh`],
                  ['Total Price', `${electric.price.toLocaleString('en-US')} VND`]
                ].map(([label, value], index) => (
                  <p
                    key={index}
                    style={{
                      color: '#34495e',
                      fontSize: '16px',
                      marginBottom: '12px',
                      lineHeight: '1.5',
                      fontWeight: '500'
                    }}
                  >
                    <strong>{label}:</strong> {value}
                  </p>
                ))}
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
    </div>
  )
}
