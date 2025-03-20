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

export const schema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .min(5, 'Length must be between 5 - 160 characters')
    .max(160, 'Length must be between 5 - 160 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Length must be between 5 - 160 characters')
    .max(160, 'Length must be between 5 - 160 characters'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .min(6, 'Length must be between 5 - 160 characters')
    .max(160, 'Length must be between 5 - 160 characters')
    .oneOf([yup.ref('password')], 'Confirm Password does not match')
})

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
  dateOfBirth: yup.string().required('Date of birth is required'),
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
  dateOfIssue: yup.string().required('Date of issue is required'),
  dateOfExpiry: yup.string().required('Date of expiry is required'),
  frontImage: yup.mixed<File>().required('Front image is required') as yup.Schema<File>,
  backImage: yup.mixed<File>().required('Back image is required') as yup.Schema<File>
})

export const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .min(5, 'Length must be between 5 - 160 characters')
    .max(160, 'Length must be between 5 - 160 characters'),
  newPassword: yup
    .string()
    .required('New Password is required')
    .min(6, 'Length must be between 5 - 160 characters')
    .max(160, 'Length must be between 5 - 160 characters'),
  code: yup
    .string()
    .matches(/^\d+$/, 'OTP code must be numeric')
    .required('OTP code is required')
    .min(6, 'OTP code must be at least 6 characters long')
})

export const serviceSchema = yup.object({
  serviceName: yup
    .string()
    .trim()
    .required('Service name is required')
    .max(100, 'Service name cannot exceed 100 characters'),
  description: yup
    .string()
    .trim()
    .required('Description is required')
    .max(500, 'Description cannot exceed 500 characters')
    .min(10, 'Description must be at least 10 characters long'),
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

export type RegisterSchema = yup.InferType<typeof registerSchema>

// cái này dành cho login: OMIT bỏ confirm_password đi
export const loginSchema = schema.omit(['confirm_password'])
export type LoginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>

export const forgotSchema = schema.omit(['confirm_password', 'password'])
export type ForgotSchema = yup.InferType<typeof forgotSchema>

export type ResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>

export const addUserSchema = registerSchema.omit(['id', 'status'])
