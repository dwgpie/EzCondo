import React from 'react'

interface BillProps {
  data: any
  priceList: any[]
  t: any
  i18n: any
}

const BillComponent = React.forwardRef<HTMLDivElement, BillProps>(({ data, priceList, t, i18n }, ref) => {
  const currentLang = i18n.language
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  return (
    <div
      ref={ref}
      style={{
        width: 750,
        background: '#fff',
        padding: '12px 24px 24px 24px',
        fontFamily: 'Plus Jakarta Sans',
        border: '2px solid #e5e7eb',
        borderRadius: 12
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontWeight: 600, fontSize: 18 }}>{t('apartment_management_board')}</p>
        <img src='/imgs/logo/lo23-Photoroom.png' alt='Logo' style={{ width: 64, height: 64, objectFit: 'cover' }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#2c3e50', textTransform: 'uppercase' }}>
          {t('electricity_bill')}
        </h2>
        <p style={{ fontWeight: 600 }}>
          {t('no')}: {data.electricReadingId?.slice(-5).toUpperCase()}
        </p>
      </div>
      <div style={{ color: '#000', fontSize: 16, fontWeight: 500 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <p>
            {t('apartment_number')}: {data.apartmentNumber}
          </p>
          <p>
            {t('meter_number')}: {data.meterNumber}
          </p>
          <p>
            {t('owner')}: {data.fullName}
          </p>
          <p>Email: {data.email}</p>
          <p>
            {t('from')}:{' '}
            {new Date(data.readingPreDate).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              timeZone: 'Asia/Ho_Chi_Minh'
            })}
          </p>
          <p>
            {t('to')}:{' '}
            {new Date(data.readingCurrentDate).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              timeZone: 'Asia/Ho_Chi_Minh'
            })}
          </p>
          <p>
            {t('previous_meter')}: {data.pre_electric_number}
          </p>
          <p>
            {t('current_meter')}: {data.current_electric_number}
          </p>
        </div>
        <table style={{ width: '100%', border: '1px solid #ccc', marginTop: 16 }}>
          <thead>
            <tr>
              <th style={{ padding: 8, border: '1px solid #ccc' }}>{t('consumption')}</th>
              <th style={{ padding: 8, border: '1px solid #ccc' }}>{t('total_price')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{data.consumption} kWh</td>
              <td style={{ padding: 8, border: '1px solid #ccc' }}>{Number(data.price).toLocaleString('en-US')} VND</td>
            </tr>
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <table style={{ border: '1px solid #ccc', fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ padding: 6, border: '1px solid #ccc' }}>{t('electric_price')}</th>
                <th style={{ padding: 6, border: '1px solid #ccc' }}>{t('unit_price')}</th>
              </tr>
            </thead>
            <tbody>
              {priceList.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: 6, border: '1px solid #ccc' }}>
                    {p.minKWh} - {p.maxKWh} kWh
                  </td>
                  <td style={{ padding: 6, border: '1px solid #ccc' }}>{p.pricePerKWh.toLocaleString('en-US')} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              marginTop: 40,
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

export default BillComponent
