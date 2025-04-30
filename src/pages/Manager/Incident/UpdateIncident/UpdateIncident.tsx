import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { getIncidentById, getImageIncidentById, updateIncidentStatus } from '~/apis/incident.api'
import { getUserById } from '~/apis/user.api'

import LinearProgress from '@mui/material/LinearProgress'
import useBufferProgress from '~/components/useBufferProgress'

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
      case 'pending':
        return 'bg-red-200 text-red-800'
      case 'underway':
        return 'bg-orange-200 text-orange-800'
      case 'resolved':
        return 'bg-green-200 text-green-800'
      default:
        return ''
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
                <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M7.001 16.154q.328 0 .548-.222t.22-.549t-.221-.548t-.55-.22t-.547.222t-.22.549t.221.548t.55.22M7 13.23q.213 0 .356-.144t.143-.356V8.346q0-.212-.144-.356t-.357-.144t-.356.144t-.143.356v4.385q0 .212.144.356t.357.144m4 1.269h6q.213 0 .356-.144t.144-.357t-.144-.356T17 13.5h-6q-.213 0-.356.144t-.144.357t.144.356t.356.143m0-4h6q.213 0 .356-.144t.144-.357t-.144-.356T17 9.5h-6q-.213 0-.356.144t-.144.357t.144.356t.356.143M4.616 19q-.691 0-1.153-.462T3 17.384V6.616q0-.691.463-1.153T4.615 5h14.77q.69 0 1.152.463T21 6.616v10.769q0 .69-.463 1.153T19.385 19zm0-1h14.769q.23 0 .423-.192t.192-.424V6.616q0-.231-.192-.424T19.385 6H4.615q-.23 0-.423.192T4 6.616v10.769q0 .23.192.423t.423.192M4 18V6z'
                  />
                </svg>
                <span className='text-[26px] text-[#4D5969] font-bold'>Detail report</span>
              </div>

              <span className={`${getStatusColor(incident.status)} px-2 py-1 rounded-full text-sm font-semibold`}>
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
              <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' viewBox='0 0 48 48'>
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={4}
                  d='M24.707 9.565L9.858 24.415a9 9 0 0 0 0 12.727v0a9 9 0 0 0 12.728 0l17.678-17.677a6 6 0 0 0 0-8.486v0a6 6 0 0 0-8.486 0L14.101 28.657a3 3 0 0 0 0 4.243v0a3 3 0 0 0 4.242 0l14.85-14.85'
                />
              </svg>
              <span className='text-[26px] text-[#4D5969] font-bold'>Image</span>
            </div>
            <div className='flex gap-[15px] ml-[45px] flex-wrap'>
              {images.length > 0 ? (
                images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageSrc(img?.imgPath)}
                    alt={`incident-${index}`}
                    className='w-[125px] h-[125px] rounded-[5px] cursor-pointer object-cover shadow-md hover:scale-105 transition-transform duration-300'
                    onClick={() => {
                      setCurrentImageIndex(index)
                      setLightboxOpen(true)
                    }}
                  />
                ))
              ) : (
                <p>Không có ảnh đính kèm</p>
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
              <p className='text-[#29313b] mb-[10px]'> Name</p>
              <input
                type='text'
                value={user.fullName}
                disabled
                className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              />
            </div>

            <div className='mb-[20px]'>
              <p className='text-[#29313b] mb-[10px]'> Email</p>
              <input
                type='text'
                value={user.email}
                disabled
                className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              />
            </div>

            <div className='mb-[20px]'>
              <p className='text-[#29313b] mb-[10px]'> Phone Number</p>
              <input
                type='text'
                value={user.phoneNumber}
                disabled
                className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              />
            </div>

            <div className='mb-[20px]'>
              <p className='text-[#29313b] mb-[10px]'> Apartment</p>
              <input
                type='text'
                value={user.apartmentNumber}
                disabled
                className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
              />
            </div>

            <div className='mb-[20px]'>
              <label className='block text-sm font-semibold my-2'>Status</label>
              <select
                value={statusIncident} // ưu tiên state đã chọn, nếu chưa thì lấy từ incident
                onChange={(e) => setStatusIncident(e.target.value)}
                className=' w-[85%]  h-10 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              >
                <option value='pending'>Pending</option>
                <option value='underway'>Underway</option>
                <option value='resolved'>Resolved</option>
              </select>
            </div>

            <div className='flex justify-between mt-6 mr-[15%] '>
              <Button
                className='w-[120px]'
                variant='contained'
                onClick={() => (window.location.href = '/manager/list-incident')}
                style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }} // Add this line
              >
                Cancel
              </Button>
              <Button
                className='w-[120px]'
                variant='contained'
                type='submit'
                style={{ color: 'white', fontWeight: 'semi-bold' }} // Add this line
                onClick={handleUpdate}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p>Data loading...</p>
      )}
    </div>
  )
}
