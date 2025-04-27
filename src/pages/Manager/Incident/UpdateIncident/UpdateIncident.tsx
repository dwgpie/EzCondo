import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
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

  return (
    <div className='mx-5 mt-5 mb-5 p-6 bg-gradient-to-br from-white via-white to-blue-100 drop-shadow-md rounded-xl'>
      UpdateIncident
    </div>
  )
}
