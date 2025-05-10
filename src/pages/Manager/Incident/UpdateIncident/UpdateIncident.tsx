import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { getIncidentById, getImageIncidentById, updateIncidentStatus } from '~/apis/incident.api'
import { getUserById } from '~/apis/user.api'

import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'
import { useTranslation } from 'react-i18next'

interface IncidentForm {
  id?: string
  userId: string
  type: string
  title: string
  description: string
  status: string
  reportedAt: string
  priority: number
}

interface UserForm {
  id?: string
  fullName: string
  email: string
  phoneNumber: string
  apartmentNumber: string
}

interface IncidentImage {
  id: string
  idIncident: string
  imgPath: string
}

export default function UpdateIncident() {
  const { t } = useTranslation('incidentManager')
  const [loading, setLoading] = useState(false)
  const [images, setImage] = useState<IncidentImage[]>([])
  const { progress, buffer } = useBufferProgress(loading)

  const [incident, setIncident] = useState<IncidentForm | null>(null)
  const [statusIncident, setStatusIncident] = useState('')
  const [user, setUser] = useState<UserForm | null>(null)

  const getUserIdFromURL = () => {
    const params = new URLSearchParams(window.location.search)
    return params.get('id') // Đảm bảo đúng với cách truyền userId
  }

  const id = getUserIdFromURL()

  const getIncidentMutation = useMutation({
    mutationFn: async (id: string) => {
      setLoading(true)
      const response = await getIncidentById(id)
      return response.data
    },
    onSuccess: (data) => {
      setIncident(data)
      setStatusIncident(data.status)
      const userId = data.userId
      getUserById(userId).then((response) => setUser(response.data))
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    },
    onError: (error) => {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error)
    }
  })

  const getImageIncidentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await getImageIncidentById(id)
      return response.data
    },
    onSuccess: (data) => {
      setImage(data)
    },
    onError: (error) => {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error)
    }
  })

  useEffect(() => {
    if (id) {
      getIncidentMutation.mutate(id)
      getImageIncidentMutation.mutate(id)
    }
  }, [id])

  const getImageSrc = (image: string | File | null | undefined) => {
    if (image instanceof File) {
      return URL.createObjectURL(image)
    }
    return image || undefined
  }

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-gradient-to-r from-green-200 to-green-300 text-green-700 font-semibold rounded-lg shadow-sm'
      case 'underway':
        return 'bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-700 font-semibold rounded-lg shadow-sm'
      case 'pending':
        return 'bg-gradient-to-r from-orange-200 to-orange-300 text-orange-700 font-semibold rounded-lg shadow-sm'
    }
  }

  const handleUpdate = async () => {
    if (id) {
      await updateIncidentStatus({ incidentId: id, status: statusIncident })
      getIncidentMutation.mutate(id)
    }
  }

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      {loading && (
        <div className='w-full px-6 fixed top-2 left-0 z-50'>
          <LinearProgress variant='buffer' value={progress} valueBuffer={buffer} />
        </div>
      )}
      {incident && user ? (
        <div className='flex justify-between shadow-md border-1 border-[#ccc] bg-white h-[520px]'>
          <div className='w-[70%] border-r-1 border-[#333] py-[10px] px-[20px] overflow-y-auto custom-scrollbar'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-[10px]'>
                <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M7.001 16.154q.328 0 .548-.222t.22-.549t-.221-.548t-.55-.22t-.547.222t-.22.549t.221.548t.55.22M7 13.23q.213 0 .356-.144t.143-.356V8.346q0-.212-.144-.356t-.357-.144t-.356.144t-.143.356v4.385q0 .212.144.356t.357.144m4 1.269h6q.213 0 .356-.144t.144-.357t-.144-.356T17 13.5h-6q-.213 0-.356.144t-.144.357t.144.356t.356.143m0-4h6q.213 0 .356-.144t.144-.357t-.144-.356T17 9.5h-6q-.213 0-.356.144t-.144.357t.144.356t.356.143M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z'
                  />
                </svg>
                <span className='text-2xl text-[#4D5969] font-bold'>{t('detail_report')}</span>
              </div>

              <span
                className={`${getStatusColor(incident.status)} capitalize px-2 py-1 rounded-full text-sm font-semibold`}
              >
                {incident.status}
              </span>
            </div>

            <div className='ml-[45px] text-[#29313b] '>
              <p className='mt-[20px]'>
                <strong>Type: </strong> {incident.type}
              </p>
              <p className='mt-[20px]'>
                <strong>Title: </strong> {incident.title}
              </p>
              <p style={{ textAlign: 'justify' }} className='mt-[20px] leading-[170%] '>
                {incident.description}
              </p>
            </div>

            <div className='flex items-center gap-[10px] mt-[20px] mb-[20px]'>
              <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 48 48'>
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={4}
                  d='M24.707 9.565L9.858 24.415a9 9 0 0 0 0 12.727v0a9 9 0 0 0 12.728 0l17.678-17.677a6 6 0 0 0 0-8.486v0a6 6 0 0 0-8.486 0L14.101 28.657a3 3 0 0 0 0 4.243v0a3 3 0 0 0 4.242 0l14.85-14.85'
                />
              </svg>
              <span className='text-2xl text-[#4D5969] font-bold'>{t('image')}</span>
            </div>
            <div className='flex gap-[15px] ml-[45px] flex-wrap'>
              {images.length > 0 ? (
                images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageSrc(img?.imgPath)}
                    alt={`incident-${index}`}
                    className='w-[125px] h-[125px] rounded-md cursor-pointer object-cover shadow-lg hover:scale-105 transition-transform duration-300'
                    onClick={() => {
                      setCurrentImageIndex(index)
                      setLightboxOpen(true)
                    }}
                  />
                ))
              ) : (
                <div className='mt-3 flex flex-col items-center justify-center m-auto text-gray-500'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' viewBox='0 0 512 512'>
                    <path
                      fill='currentColor'
                      fill-rule='evenodd'
                      d='m72.837 72.837l362.667 362.667l-30.17 30.17L387.66 448H64V124.34l-21.333-21.332zm204.497 289.83L170.667 256l-64.001 101.12v48.213h238.327l-56.282-56.283zM448 64v323.661L313.796 253.457l27.538-27.537l63.999 64V106.666H167.005L124.339 64zM106.666 167.005v108.872l41.741-67.131zm202.668-17.671c17.673 0 32 14.327 32 32s-14.327 32-32 32s-32-14.327-32-32s14.327-32 32-32'
                    />
                  </svg>
                  <p className='mt-2'>{t('no_image_available')}</p>
                </div>
              )}

              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={currentImageIndex}
                slides={images.map((img) => ({ src: getImageSrc(img.imgPath) || '' }))}
              />
            </div>
          </div>

          <div className='w-[27%] py-[20px] text-[14px]'>
            <div className='mb-[10px]'>
              <p className='text-[#29313b] mb-[10px]'>{t('full_name')}</p>
              <input
                type='text'
                value={user.fullName}
                disabled
                className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              />
            </div>

            <div className='mb-[20px]'>
              <p className='text-[#29313b] mb-[10px]'>{t('email')}</p>
              <input
                type='text'
                value={user.email}
                disabled
                className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              />
            </div>

            <div className='mb-[20px]'>
              <p className='text-[#29313b] mb-[10px]'>{t('phone_number')}</p>
              <input
                type='text'
                value={user.phoneNumber}
                disabled
                className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              />
            </div>

            <div className='mb-[20px]'>
              <p className='text-[#29313b] mb-[10px]'>{t('apartment')}</p>
              <input
                type='text'
                value={user.apartmentNumber}
                disabled
                className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              />
            </div>

            <div className='mb-[20px]'>
              <label className='block text-sm font-semibold my-2'>{t('status')}</label>
              <select
                value={statusIncident} // ưu tiên state đã chọn, nếu chưa thì lấy từ incident
                onChange={(e) => setStatusIncident(e.target.value)}
                className=' w-[85%]  h-10 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='pending'>{t('pending')}</option>
                <option value='underway'>{t('underway')}</option>
                <option value='resolved'>{t('resolved')}</option>
              </select>
            </div>

            <div className='flex justify-between mt-6 mr-[15%] '>
              <Button
                className='w-[120px]'
                variant='contained'
                onClick={() => (window.location.href = '/manager/list-incident')}
                style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }}
              >
                {t('cancel')}
              </Button>
              <Button
                className='w-[120px]'
                variant='contained'
                type='submit'
                style={{ color: 'white', fontWeight: 'semi-bold' }}
                onClick={handleUpdate}
              >
                {t('update')}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p>{t('data_loading')}</p>
      )}
    </div>
  )
}
