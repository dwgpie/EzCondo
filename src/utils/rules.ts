import * as yup from 'yup'

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
//   email: {
//     required: {
//       value: true,
//       message: 'Email là bắt buộc'
//     },
//     pattern: {
//       value: /^\S+@\S+\.\S+$/,
//       message: 'Email không đúng định dạng'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Độ dài từ 5 - 160 ký tự'
//     },
//     minLength: {
//       value: 5,
//       message: 'Độ dài từ 5 - 160 ký tự'
//     }
//   },
//   password: {
//     required: {
//       value: true,
//       message: 'Password là bắt buộc'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Độ dài từ 6 - 160 ký tự'
//     },
//     minLength: {
//       value: 6,
//       message: 'Độ dài từ 6 - 160 ký tự'
//     }
//   },
//   confirm_password: {
//     required: {
//       value: true,
//       message: 'Nhập lại password là bắt buộc'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Độ dài từ 6 - 160 ký tự'
//     },
//     minLength: {
//       value: 6,
//       message: 'Độ dài từ 6 - 160 ký tự'
//     },
//     validate:
//       typeof getValues === 'function'
//         ? (value) => value === getValues('password') || 'Nhập lại password không khớp'
//         : undefined
//   }
// })

// Validation có thể dùng cách này hoặc cách ở trên

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required')
})

//Register
export const registerSchema = yup.object({
  id: yup.string(),
  fullName: yup
    .string()
    .trim()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters long')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .min(5, 'Length must be between 5 - 160 characters')
    .max(160, 'Length must be between 5 - 160 characters'),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^[0-9]{10,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('not-today-or-future', 'Date of birth is not valid', (value) => {
      const inputDate = new Date(value)
      const today = new Date()
      inputDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      return inputDate < today
    }),
  gender: yup.string().required('Gender is required'),
  roleName: yup.string().required('Role is required'),
  apartmentNumber: yup
    .string()
    .trim()
    .required('Apartment number is required')
    .max(50, 'Apartment number cannot exceed 50 characters'),
  status: yup.string().required('Status is required'),
  userId: yup.string(),
  no: yup.string().required('ID card number is required'),
  dateOfIssue: yup
    .string()
    .required('Date of issue is required')
    .test('not-today-or-future', 'Date of issue is not valid', (value) => {
      const inputDate = new Date(value)
      const today = new Date()
      inputDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      return inputDate < today
    }),
  dateOfExpiry: yup
    .string()
    .required('Date of expiry is required')
    .test('after-issue-date', 'Date of expiry must be after date of issue', function (value) {
      const expiryDate = new Date(value)
      const issueDate = new Date(this.parent.dateOfIssue)
      return expiryDate > issueDate
    }),
  frontImage: yup.mixed<File>().required('Front image is required') as yup.Schema<File>,
  backImage: yup.mixed<File>().required('Back image is required') as yup.Schema<File>
})

//Confirm password
export const RSPassWord = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .min(5, 'Length must be between 5 - 160 characters')
    .max(160, 'Length must be between 5 - 160 characters'),
  newPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(160, 'Password must be less than 160 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  code: yup
    .string()
    .matches(/^\d+$/, 'OTP code must be numeric')
    .required('OTP code is required')
    .min(6, 'OTP code must be at least 6 characters long'),
  tokenMemory: yup.string(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required')
})

//Service
export const serviceSchema = yup.object({
  id: yup.string(),
  status: yup.string().required('Status is required'),
  serviceName: yup
    .string()
    .trim()
    .required('Service name is required')
    .max(100, 'Service name cannot exceed 100 characters'),
  description: yup
    .string()
    .trim()
    .required('Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  typeOfMonth: yup.boolean().default(false),
  typeOfYear: yup.boolean().default(false),
  priceOfMonth: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value)) // Chuyển rỗng thành null
    .nullable()
    .when('typeOfMonth', {
      is: true,
      then: (schema) => schema.required('Please enter the price').min(1, 'Price must be at least 1')
    }),
  priceOfYear: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value)) // Chuyển giá trị rỗng thành null
    .nullable()
    .when('typeOfYear', {
      is: true,
      then: (schema) => schema.required('Please enter the price').min(1, 'Price must be at least 1')
    }),
  service_Id: yup.string(),
  serviceImages: yup
    .array()
    .of(yup.mixed<File>().required('Each image is required'))
    .min(1, 'At least one image is required')
    .required('Image is required')
})

//Profile
export const profileSchema = yup.object({
  id: yup.string(),
  fullName: yup
    .string()
    .trim()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters long')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .min(5, 'Length must be between 5 - 160 characters')
    .max(160, 'Length must be between 5 - 160 characters'),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^[0-9]{10,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('not-today-or-future', 'Date of birth is not valid', (value) => {
      const inputDate = new Date(value)
      const today = new Date()
      inputDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      return inputDate < today
    }),
  gender: yup.string().required('Gender is required'),
  roleName: yup.string().required('Role is required'),
  apartmentNumber: yup
    .string()
    .trim()
    .required('Apartment number is required')
    .max(50, 'Apartment number cannot exceed 50 characters'),
  status: yup.string().required('Status is required'),
  no: yup.string().required('ID card number is required'),
  avatar: yup.mixed<File>() as yup.Schema<File>
})

export const profileAdminSchema = profileSchema.omit(['roleName', 'apartmentNumber', 'status', 'no'])

//Change password
export const changePasswordSchema = yup.object({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(160, 'Password must be less than 160 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required')
})

//Fee
export const electricitySchema = yup.object({
  id: yup.string(),
  minKWh: yup.number().required(),
  maxKWh: yup.number().required(),
  pricePerKWh: yup.number().required().max(100000, 'Price per KWh must be less than 100,000VND')
})

export const waterSchema = yup.object({
  id: yup.string(),
  pricePerM3: yup.number().required()
})

export const parkingSchema = yup.object({
  id: yup.string(),
  pricePerMotor: yup.number().required(),
  pricePerOto: yup.number().required()
})

//Apartment
export const apartmentSchema = yup.object({
  id: yup.string(),
  apartmentNumber: yup.string().required('Apartment number is required'),
  acreage: yup.number().required('Acreage is required'),
  description: yup.string().required('Description is required')
})

//Notification
export const notificationSchema = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  receiver: yup.string().required('Receiver is required'),
  type: yup.string().required('Type is required'),
  NotificationId: yup.string(),
  Image: yup
    .array()
    .of(yup.mixed<File>().required('Each image is required'))
    .min(1, 'At least one image is required')
    .required('Image is required')
})

export const notificationSchemaManager = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  type: yup.string().required('Type is required'),
  receiver: yup.string(),
  apartmentNumber: yup.string().when('receiver', {
    is: 'apartment',
    then: (schema) => schema.required('Apartment number is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  NotificationId: yup.string(),
  Image: yup
    .array()
    .of(yup.mixed<File>().required('Each image is required'))
    .min(1, 'At least one image is required')
    .required('Image is required')
})

//Add member
export const addMemberSchema = yup.object({
  id: yup.string(),
  apartmentNumber: yup.string(),
  fullName: yup
    .string()
    .trim()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters long')
    .max(100, 'Full name cannot exceed 100 characters'),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^[0-9]{10,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('not-today-or-future', 'Date of birth is not valid', (value) => {
      const inputDate = new Date(value)
      const today = new Date()
      inputDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      return inputDate < today
    }),
  gender: yup.string().required('Gender is required'),
  no: yup.string().required('ID card number is required'),
  relationship: yup.string().required('Relationship is required')
})

//Add Electric Meter
export const addElectricMeterSchema = yup.object({
  file: yup
    .mixed<FileList>()
    .required('File is required')
    .test('fileExists', 'You must upload a file', (value) => {
      return value instanceof FileList && value.length > 0
    })
}) as yup.ObjectSchema<{ file: FileList }>

//Add Electric Meter
export const addWaterMeterSchema = yup.object({
  file: yup
    .mixed<FileList>()
    .required('File is required')
    .test('fileExists', 'You must upload a file', (value) => {
      return value instanceof FileList && value.length > 0
    })
}) as yup.ObjectSchema<{ file: FileList }>

export type RegisterSchema = yup.InferType<typeof registerSchema>
// cái này dành cho login: OMIT bỏ confirm_password đi
export type LoginSchema = yup.InferType<typeof loginSchema>
export const forgotSchema = loginSchema.omit(['password'])
export type ForgotSchema = yup.InferType<typeof forgotSchema>
export const verifySchema = RSPassWord.omit(['newPassword', 'confirmPassword'])
export type VerifyOtpSchema = yup.InferType<typeof verifySchema>
export const resetPasswordSchema = RSPassWord.omit(['email', 'code'])
export type ResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>
export const addUserSchema = registerSchema.omit(['id', 'status'])
export const addServiceSchema = serviceSchema.omit(['id', 'status'])
export type AddApartmentSchema = yup.InferType<typeof apartmentSchema>
