import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Plus Jakarta Sans", sans-serif'
        }
      }
    }
  }
})

export default theme
