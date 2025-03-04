import React from 'react'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { SvgIconComponent } from '@mui/icons-material'

interface CustomListItemButtonProps {
  icon?: React.ReactElement<SvgIconComponent>
  text: string
  isActive?: boolean
  onClick?: () => void
  pl?: number
  py?: number
  endIcon?: React.ReactNode
}

export default function CustomListItemButton({
  icon,
  text,
  isActive = false,
  onClick,
  pl = 0,
  py = 0.5,
  endIcon
}: CustomListItemButtonProps) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        py: py,
        pl: pl,
        backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
      }}
    >
      {icon && (
        <ListItemIcon sx={{ minWidth: '35px', color: isActive ? 'primary.main' : 'inherit' }}>{icon}</ListItemIcon>
      )}
      <ListItemText primary={text} sx={{ color: isActive ? 'primary.main' : 'inherit' }} />
      {endIcon}
    </ListItemButton>
  )
}
