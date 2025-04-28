import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { getAllIncident } from '~/apis/incident.api'

export default function UpdateIncident() {
  const [listIncident, setListIncident] = useState<[]>([])

  const getAllIncidentMutation = useMutation({
    mutationFn: async () => {
      const response = await getAllIncident()
      return response.data
    },
    onSuccess: (data) => {
      setListIncident(data)
    },
    onError: (error) => {
      console.error('Lỗi khi hiển thị danh sách incident:', error)
    }
  })
  useEffect(() => {
    getAllIncidentMutation.mutate()
    console.log('list: ', listIncident)
  }, [])

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = [
    { src: '/public/imgs/avt/ttt.webp' },
    { src: '/public/imgs/avt/ttt.webp' },
    { src: '/public/imgs/avt/ttt.webp' },
    { src: '/public/imgs/avt/ttt.webp' }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-red-200 text-red-800'
      case 'in progress':
        return 'bg-orange-200 text-orange-800'
      case 'resolved':
        return 'bg-green-200 text-green-800'
      default:
        return ''
    }
  }

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
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

            <span className={`${getStatusColor('pending')} px-2 py-1 rounded-full text-sm font-semibold`}>
              {/* {incident.status} */}
              Pending
            </span>
          </div>

          <div className='ml-[45px] text-[#29313b] '>
            <p className='mt-[20px]'>
              <strong>Type: </strong> An ninh
            </p>
            <p className='mt-[20px]'>
              <strong>Title: </strong> Xuất hiện người lạ
            </p>
            <p style={{ textAlign: 'justify' }} className='mt-[20px] leading-[170%] '>
              Vào khoảng 23h30 ngày 24/04/2025, cư dân tầng 5 tòa nhà A phát hiện một người đàn ông lạ mặt đứng trước
              cửa căn hộ 504 trong khoảng 10 phút mà không rõ lý do. Người này không mang đồng phục của bất kỳ đơn vị
              giao hàng hay kỹ thuật nào, liên tục nhìn quanh quan sát hành lang, có biểu hiện lén lút và căng thẳng.
              Khi bị một cư dân khác hỏi thăm, người này trả lời lấp lửng và sau đó rời khỏi khu vực nhanh chóng. Hình
              ảnh từ camera hành lang đã ghi nhận đầy đủ hành vi trên.
            </p>
          </div>

          <div className='flex items-center gap-[10px] mt-[20px] mb-[20px]'>
            <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' viewBox='0 0 48 48'>
              <path
                fill='none'
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='4'
                d='M24.707 9.565L9.858 24.415a9 9 0 0 0 0 12.727v0a9 9 0 0 0 12.728 0l17.678-17.677a6 6 0 0 0 0-8.486v0a6 6 0 0 0-8.486 0L14.101 28.657a3 3 0 0 0 0 4.243v0a3 3 0 0 0 4.242 0l14.85-14.85'
              />
            </svg>
            <span className='text-[26px] text-[#4D5969] font-bold'>Image</span>
          </div>
          <div className='flex gap-[15px] ml-[45px] flex-wrap'>
            {images.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={`incident-${index}`}
                className='w-[125px] h-[125px] rounded-[5px] cursor-pointer'
                onClick={() => {
                  setCurrentImageIndex(index)
                  setLightboxOpen(true)
                }}
              />
            ))}

            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={currentImageIndex}
              slides={images}
            />
          </div>
        </div>

        <div className='w-[27%] py-[20px] text-[14px]'>
          <div className='mb-[10px]'>
            <p className='text-[#29313b] mb-[10px]'> Name</p>
            <input
              type='text'
              value='Phan Minh Tuấn'
              disabled
              className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
            />
          </div>

          <div className='mb-[20px]'>
            <p className='text-[#29313b] mb-[10px]'> Email</p>
            <input
              type='text'
              value='minhtuan@gmail.com'
              disabled
              className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
            />
          </div>

          <div className='mb-[20px]'>
            <p className='text-[#29313b] mb-[10px]'> Phone Number</p>
            <input
              type='text'
              value='0847828516'
              disabled
              className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
            />
          </div>

          <div className='mb-[20px]'>
            <p className='text-[#29313b] mb-[10px]'> Apartment</p>
            <input
              type='text'
              value='101A'
              disabled
              className='w-[85%] px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed'
            />
          </div>

          <div className='mb-[20px]'>
            <label className='block text-sm font-semibold my-2'>Status</label>
            <select
              defaultValue='father'
              className=' w-[85%] h-10 pl-2 cursor-pointer outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
            >
              <option value='father'>Pending</option>
              <option value='mother'>Underway</option>
              <option value='wife'>Complete</option>
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
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
