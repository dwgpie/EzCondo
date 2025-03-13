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
    .email('Email không đúng định dạng ')
    .required('Email là bắt buộc')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Nhập lại Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref('password')], 'Nhập lại Password không khớp')
})

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Họ và tên là bắt buộc')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được quá 100 ký tự'),

  email: yup
    .string()
    .email('Email không đúng định dạng ')
    .required('Email là bắt buộc')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),

  phoneNumber: yup
    .string()
    .trim()
    .matches(/^[0-9]{10,15}$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại là bắt buộc'),

  dateOfBirth: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải có định dạng YYYY-MM-DD')
    .required('Ngày sinh là bắt buộc'),
  gender: yup.string().oneOf(['Man', 'Male'], 'Giới tính không hợp lệ').required('Giới tính là bắt buộc'),

  roleName: yup.string().trim().oneOf(['Admin', 'Resident'], 'Vai trò không hợp lệ').required('Vai trò là bắt buộc'),

  apartmentNumber: yup.string().trim().required('Số căn hộ là bắt buộc').max(50, 'Số căn hộ không được quá 50 ký tự')
})

export const citizenSchema = yup.object({
  userId: yup.string().required('UserId là bắt buộc'),
  no: yup.string().required('Số CCCD là bắt buộc'),
  dateOfIssue: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải có định dạng YYYY-MM-DD')
    .required('Ngày sinh là bắt buộc'),
  dateOfExpiry: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải có định dạng YYYY-MM-DD')
    .required('Ngày sinh là bắt buộc'),
  frontImage: yup.string().required('Ảnh mặt trước là bắt buộc'),
  backImage: yup.string().required('Ảnh mặt sau là bắt buộc')
})

export type CitizenSchema = yup.InferType<typeof citizenSchema>

export type RegisterSchema = yup.InferType<typeof registerSchema>

// cái này dành cho login: OMIT bỏ confirm_password đi
export const loginSchema = schema.omit(['confirm_password'])
export type LoginSchema = yup.InferType<typeof loginSchema>
export type Schema = yup.InferType<typeof schema>

export const combinedSchema = registerSchema.concat(citizenSchema)

export type MergedSchema = yup.InferType<typeof combinedSchema>
