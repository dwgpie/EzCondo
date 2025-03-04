import { Button } from '@mui/material'
import { useState } from 'react'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin'

interface FormData {
  name: string
  phone: string
  dateOfBirth: string
  email: string
  gender: string
  apartment: string
  role: string
  citizenId: string
  dateOfIssue: string
  dateOfExpiry: string
  frontCardImage?: File
  backCardImage?: File
}

export default function AddUser() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    dateOfBirth: '',
    email: '',
    gender: '',
    apartment: '',
    role: 'resident',
    citizenId: '',
    dateOfIssue: '',
    dateOfExpiry: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [side === 'front' ? 'frontCardImage' : 'backCardImage']: file
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý logic gửi form ở đây
    console.log(formData)
  }

  return (
    <div className='bg-[#EDF2F9] pt-25 z-13'>
      <div className='grid grid-cols-12 gap-5 items-start'>
        <div className='col-span-1'></div>
        <div className='col-span-2 sticky top-25'>
          <SideBarAdmin />
        </div>
        <div className='col-span-8 rounded-lg'>
          <div className='text-2xl font-semibold mb-5 py-4 px-6 bg-white drop-shadow-md rounded-xl'>Add User</div>
          <div className='mb-6 p-6 bg-white drop-shadow-md rounded-xl'>
            <h2 className='text-xl mb-4 text-black font-semibold'>Account Information</h2>
            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Name</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Phone number</label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Date of birth</label>
                  <input
                    type='date'
                    name='dateOfBirth'
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Gender</label>
                  <input
                    type='text'
                    name='gender'
                    value={formData.gender}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Apartment</label>
                  <input
                    type='text'
                    name='apartment'
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Role</label>
                  <select
                    name='role'
                    value={formData.role}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                  >
                    <option value='resident'>Resident</option>
                    <option value='admin'>Manager</option>
                    <option value='support_team'>Support team</option>
                  </select>
                </div>
              </div>

              <div className='mt-8'>
                <h3 className='text-lg mb-4 font-semibold'>Citizen Identity Card</h3>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium'>No</label>
                    <input
                      type='text'
                      name='citizenId'
                      value={formData.citizenId}
                      onChange={handleInputChange}
                      className='w-full p-2 border rounded-md'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium'>Date of issue</label>
                    <input
                      type='date'
                      name='dateOfIssue'
                      value={formData.dateOfIssue}
                      onChange={handleInputChange}
                      className='w-full p-2 border rounded-md'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium'>Date of expiry</label>
                    <input
                      type='date'
                      name='dateOfExpiry'
                      value={formData.dateOfExpiry}
                      onChange={handleInputChange}
                      className='w-full p-2 border rounded-md'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4 mt-4'>
                  <div className='space-y-2'>
                    <div className='h-40 bg-gray-200 rounded-md flex items-center justify-center'>
                      {formData.frontCardImage ? (
                        <img
                          src={URL.createObjectURL(formData.frontCardImage)}
                          alt='Front of card'
                          className='max-h-full'
                        />
                      ) : (
                        <span className='text-gray-500 '>Front card preview</span>
                      )}
                    </div>
                    <div className='flex justify-center'>
                      <label className='cursor-pointer text-blue-600'>
                        Front of card
                        <input
                          type='file'
                          className='hidden'
                          accept='image/*'
                          onChange={(e) => handleImageUpload(e, 'front')}
                        />
                      </label>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='h-40 bg-gray-200 rounded-md flex items-center justify-center'>
                      {formData.backCardImage ? (
                        <img
                          src={URL.createObjectURL(formData.backCardImage)}
                          alt='Back of card'
                          className='max-h-full'
                        />
                      ) : (
                        <span className='text-gray-500'>Back card preview</span>
                      )}
                    </div>
                    <div className='flex justify-center'>
                      <label className='cursor-pointer text-blue-600'>
                        Back of card
                        <input
                          type='file'
                          className='hidden'
                          accept='image/*'
                          onChange={(e) => handleImageUpload(e, 'back')}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-4 mt-6'>
                <Button
                  variant='contained'
                  onClick={() => {
                    // Xử lý logic cancel
                  }}
                  style={{ color: 'white', background: 'red', fontWeight: 'semi-bold' }} // Add this line
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  onClick={() => {
                    // Xử lý logic cancel
                  }}
                  style={{ color: 'white', fontWeight: 'semi-bold' }} // Add this line
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className='col-span-1'></div>
      </div>
    </div>
  )
}
