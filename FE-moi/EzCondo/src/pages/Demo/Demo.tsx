// import { useRef } from 'react'
// import LoadingBar from 'react-top-loading-bar'
// import AppBar from '@mui/material/AppBar'
// import Toolbar from '@mui/material/Toolbar'
// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'
// import Container from '@mui/material/Container'

// const DemoApp = () => {
//   const ref = useRef(null)

//   return (
//     <div>
//       {/* Loading Bar */}
//       <LoadingBar color='#f11946' ref={ref} />

//       {/* Header */}
//       <AppBar position='static'>
//         <Toolbar>
//           <Typography variant='h6' sx={{ flexGrow: 1 }}>
//             My App
//           </Typography>
//           <Button color='inherit' onClick={() => ref.current.continuousStart()}>
//             Start Loading
//           </Button>
//           <Button color='inherit' onClick={() => ref.current.complete()}>
//             Complete Loading
//           </Button>
//         </Toolbar>
//       </AppBar>

//       {/* Content */}
//       <Container sx={{ mt: 4 }}>
//         <Typography variant='h5'>Welcome to the Demo</Typography>
//       </Container>
//     </div>
//   )
// }

// export default DemoApp
