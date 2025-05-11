import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import serviceEn from './locales/Admin/service/en.json'
import serviceVi from './locales/Admin/service/vi.json'
import apartmentEn from './locales/Admin/apartment/en.json'
import apartmentVi from './locales/Admin/apartment/vi.json'
import userEn from './locales/Admin/user/en.json'
import userVi from './locales/Admin/user/vi.json'
import electricEn from './locales/Admin/electric/en.json'
import electricVi from './locales/Admin/electric/vi.json'
import waterEn from './locales/Admin/water/en.json'
import waterVi from './locales/Admin/water/vi.json'
import parkingEn from './locales/Admin/parking/en.json'
import parkingVi from './locales/Admin/parking/vi.json'
import notificationEn from './locales/Admin/notification/en.json'
import notificationVi from './locales/Admin/notification/vi.json'
import sidebaradminEn from './locales/Admin/sidebaradmin/en.json'
import sidebaradminVi from './locales/Admin/sidebaradmin/vi.json'
import residentEn from './locales/Manager/resident/en.json'
import residentVi from './locales/Manager/resident/vi.json'
import electricManagerEn from './locales/Manager/electricManager/en.json'
import electricManagerVi from './locales/Manager/electricManager/vi.json'
import parkingManagerEn from './locales/Manager/parkingManager/en.json'
import parkingManagerVi from './locales/Manager/parkingManager/vi.json'
import incidentManagerEn from './locales/Manager/incidentManager/en.json'
import incidentManagerVi from './locales/Manager/incidentManager/vi.json'
import sidebarmanagerEn from './locales/Manager/sidebarmanager/en.json'
import sidebarmanagerVi from './locales/Manager/sidebarmanager/vi.json'
import profileEn from './locales/profile/en.json'
import profileVi from './locales/profile/vi.json'
import headerEn from './locales/header/en.json'
import headerVi from './locales/header/vi.json'
import bookingEn from './locales/Manager/booking/en.json'
import bookingVi from './locales/Manager/booking/vi.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      service: serviceEn,
      apartment: apartmentEn,
      user: userEn,
      electric: electricEn,
      water: waterEn,
      parking: parkingEn,
      notification: notificationEn,
      sidebaradmin: sidebaradminEn,
      resident: residentEn,
      electricManager: electricManagerEn,
      parkingManager: parkingManagerEn,
      incidentManager: incidentManagerEn,
      sidebarmanager: sidebarmanagerEn,
      profile: profileEn,
      header: headerEn,
      booking: bookingEn
    },
    vi: {
      service: serviceVi,
      apartment: apartmentVi,
      user: userVi,
      electric: electricVi,
      water: waterVi,
      parking: parkingVi,
      notification: notificationVi,
      sidebaradmin: sidebaradminVi,
      resident: residentVi,
      electricManager: electricManagerVi,
      parkingManager: parkingManagerVi,
      incidentManager: incidentManagerVi,
      sidebarmanager: sidebarmanagerVi,
      profile: profileVi,
      header: headerVi,
      booking: bookingVi
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
