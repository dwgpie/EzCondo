import React from 'react'

interface ParkingBillProps {
  data: any
  price: any
  t: any
  i18n: any
}

const ParkingBillComponent = React.forwardRef<HTMLDivElement, ParkingBillProps>(({ data, price, t, i18n }, ref) => {
  const currentLang = i18n.language
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  return (
    <div
      ref={ref}
      style={{
        width: 'fit-content',
        background: '#fff',
        padding: '12px 24px 24px 24px',
        fontFamily: 'Plus Jakarta Sans',
        border: '2px solid #e5e7eb',
        position: 'relative'
      }}
    >
      <img
        src='/imgs/logo/lo23-Photoroom.png'
        alt='Parkingmark'
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
        <img src='/imgs/logo/lo23-Photoroom.png' alt='Logo' style={{ width: 64, height: 64, objectFit: 'cover' }} />
        <p style={{ fontWeight: 600, fontSize: 15, color: '#000' }}>{t('apartment_management_board')}</p>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase' }}>
          {t('parking_bill')}
        </h2>
        <p style={{ fontWeight: 600 }}>
          <span style={{ color: '#2563eb' }}>{t('no')}</span>:{' '}
          <span style={{ color: 'black' }}> {data.parkingId?.slice(-5).toUpperCase()}</span>
        </p>
      </div>
      <div style={{ color: '#000', fontSize: 16, fontWeight: 500 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 24 }}>
          <p>
            <span style={{ color: '#2563eb' }}>{t('apartment_number')}</span>: {data.apartmentNumber}
          </p>
          <p>
            <span style={{ color: '#2563eb' }}>{t('phone')}</span>: {data.phoneNumber}
          </p>
          <p style={{ marginTop: 5 }}>
            <span style={{ color: '#2563eb' }}>{t('owner')}</span>: {data.fullName}
          </p>
          <p style={{ marginTop: 5 }}>
            <span style={{ color: '#2563eb' }}>Email</span>: {data.email}
          </p>
          <p style={{ marginTop: 20 }}>
            <span style={{ color: '#2563eb' }}>{t('from')}</span>:{' '}
            {new Date(data.createDate).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              timeZone: 'Asia/Ho_Chi_Minh'
            })}
          </p>
          <p style={{ marginTop: 20 }}>
            <span style={{ color: '#2563eb' }}>{t('to')}</span>:{' '}
            {new Date(new Date(data.createDate).setMonth(new Date(data.createDate).getMonth() + 1)).toLocaleDateString(
              currentLang === 'vi' ? 'vi-VN' : 'en-GB',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'Asia/Ho_Chi_Minh'
              }
            )}
          </p>
          <p style={{ marginTop: 5 }}>
            <span style={{ color: '#2563eb' }}>{t('number_of_motobike')}</span>: {data.numberOfMotorbike}
          </p>
          <p style={{ marginTop: 5 }}>
            <span style={{ color: '#2563eb' }}>{t('number_of_car')}</span>: {data.numberOfCar}
          </p>
        </div>
        <table style={{ width: '100%', border: '1px solid #ccc', marginTop: 16 }}>
          <thead>
            <tr>
              <th style={{ padding: 8, border: '1px solid #ccc', width: '50%', color: '#2563eb' }}>
                {t('total_vehicle')}
              </th>
              <th style={{ padding: 8, border: '1px solid #ccc', width: '50%', color: '#2563eb' }}>
                {t('total_price')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 8, border: '1px solid #ccc', width: '50%' }}>{data.total}</td>
              <td style={{ padding: 8, border: '1px solid #ccc', width: '50%' }}>
                {Number(data.amount).toLocaleString('en-US')} VND
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
                <th style={{ padding: 6, border: '1px solid #ccc', color: '#2563eb' }}>{t('type_vehicle')}</th>
                <th style={{ padding: 6, border: '1px solid #ccc', color: '#2563eb' }}>{t('unit_price')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 6, border: '1px solid #ccc' }}>{t('motorbike')}</td>
                <td style={{ padding: 6, border: '1px solid #ccc' }}>
                  {price?.pricePerMotor?.toLocaleString('en-US')} VND
                </td>
              </tr>
              <tr>
                <td style={{ padding: 6, border: '1px solid #ccc' }}>{t('car')}</td>
                <td style={{ padding: 6, border: '1px solid #ccc' }}>
                  {price?.pricePerOto?.toLocaleString('en-US')} VND
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
  )
})

export default ParkingBillComponent
