import React from 'react'
import { CircularProgress, CircularProgressProps, Typography, Box } from '@mui/material'

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant='determinate' {...props} size={70} thickness={5} sx={{ color: '#2976ce' }} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant='button' component='div' sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  )
}

interface LoadingOverlayProps {
  value: number
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ value }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-white bg-opacity-70 z-50 flex items-center justify-center'>
      <CircularProgressWithLabel value={value} />
    </div>
  )
}

export default LoadingOverlay
