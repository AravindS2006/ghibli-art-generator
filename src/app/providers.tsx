'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      light: '#818CF8',
      dark: '#3730A3',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </ThemeProvider>
  )
} 