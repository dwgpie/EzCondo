import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const isVietnamese = i18n.language === 'vi'

  const toggleLanguage = () => {
    const newLang = isVietnamese ? 'en' : 'vi'
    i18n.changeLanguage(newLang)
    localStorage.setItem('lang', newLang)
  }

  const toggleStyle: React.CSSProperties = {
    width: '70px',
    height: '36px',
    borderRadius: '18px',
    backgroundColor: isVietnamese ? '#e7d1d1' : '#cfe2ff',
    border: '1px solid #ced4da',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    padding: '0 4px',
    overflow: 'hidden'
  }

  const circleStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundImage: `url(${isVietnamese ? 'https://flagcdn.com/w40/vn.png' : 'https://flagcdn.com/w40/gb.png'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute',
    top: '4px',
    left: isVietnamese ? '4px' : '38px',
    transition: 'left 0.3s ease, background-image 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    border: '1px solid #fff'
  }

  const textStyle: React.CSSProperties = {
    position: 'absolute',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
    transition: 'opacity 0.3s ease'
  }

  const viTextStyle: React.CSSProperties = {
    ...textStyle,
    left: isVietnamese ? '40px' : '-30px',
    opacity: isVietnamese ? 1 : 0
  }

  const enTextStyle: React.CSSProperties = {
    ...textStyle,
    right: isVietnamese ? '-30px' : '40px',
    opacity: isVietnamese ? 0 : 1
  }

  return (
    <div
      onClick={toggleLanguage}
      style={toggleStyle}
      title={isVietnamese ? 'Chuyển sang English' : 'Switch to Vietnamese'}
    >
      <div style={circleStyle} />
      <span style={viTextStyle}>VI</span>
      <span style={enTextStyle}>EN</span>
    </div>
  )
}
