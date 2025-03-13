import { Button } from '@mui/material'
import SideBarAdmin from '~/components/SideBar/SideBarAdmin'
import { useForm } from 'react-hook-form'
// import { Link, useNavigate } from 'react-router-dom'
import Input from '~/components/Input'
// import { getRules } from '~/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { RegisterSchema, CitizenSchema, combinedSchema, MergedSchema, registerSchema } from '~/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { registerAccount, addOrUpdateCitizen } from '~/apis/auth.api'
import { ErrorRespone } from '~/types/utils.type'
import { isAxiosUnprocessableEntityError } from '~/utils/utils'
import { useState } from 'react'
// import InputAdornment from '@mui/material/InputAdornment'
// import IconButton from '@mui/material/IconButton'
// import { AppContext } from '~/contexts/app.context'
// import { log } from 'node:console'

// interface FormData {
//   name: string
//   phone: string
//   dateOfBirth: string
//   email: string
//   gender: string
//   apartment: string
//   role: string
//   citizenId: string
//   dateOfIssue: string
//   dateOfExpiry: string
//   frontCardImage?: File
//   backCardImage?: File
// }

type FormData = RegisterSchema

interface CitizenData {
  userId: string
  no: string
  dateOfIssue: string
  dateOfExpiry: string
  frontImage: string
  backImage: string
}

export default function AddUser() {
  // const [formData, setFormData] = useState<FormData>({
  //   name: '',
  //   phone: '',
  //   dateOfBirth: '',
  //   email: '',
  //   gender: '',
  //   apartment: '',
  //   role: 'resident',
  //   citizenId: '',
  //   dateOfIssue: '',
  //   dateOfExpiry: ''
  // })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({ resolver: yupResolver(registerSchema) })

  // API 1: Đăng ký tài khoản
  const registerAccountMutation = useMutation({
    mutationFn: async (body: RegisterSchema) => {
      const response = await registerAccount(body)
      return response.data // API 1 trả về userId
    },
    onSuccess: (userId) => {
      console.log('User ID:', userId)

      // Tạo dữ liệu cho API 2 từ form
      const citizenData: CitizenData = {
        userId,
        no: '',
        dateOfIssue: new Date().toISOString().split('T')[0],
        dateOfExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0],
        frontImage: '',
        backImage: ''
      }

      addOrUpdateCitizenMutation.mutate(citizenData)
    },
    onError: (error) => {
      console.error('Lỗi khi đăng ký tài khoản:', error)
    }
  })

  // API 2: Thêm hoặc cập nhật công dân
  const addOrUpdateCitizenMutation = useMutation({
    mutationFn: async (body: CitizenSchema) => {
      const response = await addOrUpdateCitizen(body)
      return response.data
    },
    onSuccess: (data) => {
      console.log('Cập nhật công dân thành công:', data)
    },
    onError: (error) => {
      console.error('Lỗi khi cập nhật công dân:', error)
    }
  })

  // Xử lý submit form
  const onSubmit = handleSubmit((formData) => {
    registerAccountMutation.mutate(formData)
  })

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
            <form className='rounded' noValidate onSubmit={onSubmit}>
              <div className='grid grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Name</label>
                  <Input
                    name='fullName'
                    type='fullName'
                    placeholder='Name'
                    register={register}
                    className='mt-7'
                    errorMessage={errors.fullName?.message}
                  />
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Phone number</label>
                  <Input
                    name='phoneNumber'
                    type='phoneNumber'
                    placeholder='Phone Nunber'
                    register={register}
                    className='mt-7'
                    errorMessage={errors.phoneNumber?.message}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Date of birth</label>
                  <Input
                    name='dateOfBirth'
                    type='dateOfBirth'
                    placeholder='Date of Birth'
                    register={register}
                    className='mt-7'
                    errorMessage={errors.dateOfBirth?.message}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Email</label>
                  <Input
                    name='email'
                    type='email'
                    placeholder='Email'
                    register={register}
                    className='mt-7'
                    errorMessage={errors.email?.message}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Gender</label>
                  <Input
                    name='gender'
                    type='gender'
                    placeholder='Gender'
                    register={register}
                    className='mt-7'
                    errorMessage={errors.gender?.message}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Apartment</label>
                  <Input
                    name='apartmentNumber'
                    type='apartmentNumber'
                    placeholder='Apartment Number'
                    register={register}
                    className='mt-7'
                    errorMessage={errors.apartmentNumber?.message}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>Role</label>
                  {/* <select
                    name='role'
                    value={formData.role}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-md'
                  >
                    <option value='resident'>Resident</option>
                    <option value='admin'>Manager</option>
                    <option value='support_team'>Support team</option>
                  </select> */}
                  <Input
                    name='roleName'
                    type='roleName'
                    placeholder='Role Name'
                    register={register}
                    className='mt-7'
                    errorMessage={errors.roleName?.message}
                  />
                </div>
              </div>

              <div className='mt-8'>
                <h3 className='text-lg mb-4 font-semibold'>Citizen Identity Card</h3>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium'>No</label>
                    <Input
                      name='no'
                      type='no'
                      placeholder='Citizen ID'
                      register={register}
                      className='mt-7'
                      // errorMessage={errors.no?.message}
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium'>Date of issue</label>
                    <Input
                      name='dateOfIssue'
                      type='dateOfIssue'
                      placeholder='Date of Issue'
                      register={register}
                      className='mt-7'
                      // errorMessage={errors.dateOfIssue?.message}
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium'>Date of expiry</label>
                    <Input
                      name='dateOfExpiry'
                      type='dateOfExpiry'
                      placeholder='Date of Expiry'
                      register={register}
                      className='mt-7'
                      // errorMessage={errors.dateOfExpiry?.message}
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium'>Font</label>
                    <Input
                      name='frontImage'
                      type='frontImage'
                      placeholder='Font Image'
                      register={register}
                      className='mt-7'
                      // errorMessage={errors.dateOfExpiry?.message}
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium'>Back</label>
                    <Input
                      name='dateOfExpiry'
                      type='dateOfExpiry'
                      placeholder='Back Image'
                      register={register}
                      className='mt-7'
                      // errorMessage={errors.dateOfExpiry?.message}
                    />
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
                  type='submit'
                  variant='contained'
                  style={{ color: 'white', background: '#2976ce', fontWeight: 'semi-bold', width: '100%' }}
                >
                  Submit
                </Button>
              </div>

              {/* <div className='mt-8'>
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

              </div> */}
            </form>
          </div>
        </div>
        <div className='col-span-1'></div>
      </div>
    </div>
  )
}
