import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: '{colors.brand.500}' },
        secondary: { value: '{colors.brand.300}' },
        brand: {
          '50': { value: '#fbeaef' },
          '100': { value: '#f7d4e0' },
          '200': { value: '#efa9c0' },
          '300': { value: '#e77ea1' },
          '400': { value: '#de5482' },
          '500': { value: '#d62963' },
          '600': { value: '#ab214f' },
          '700': { value: '#81183b' },
          '800': { value: '#561027' },
          '900': { value: '#2b0814' },
          '950': { value: '#1e060e' },
        },
      },
      fonts: {
        body: { value: 'system-ui, sans-serif' },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.500}' },
          contrast: { value: '{colors.brand.100}' },
          fg: { value: '{colors.brand.700}' },
          muted: { value: '{colors.brand.100}' },
          subtle: { value: '{colors.brand.200}' },
          emphasized: { value: '{colors.brand.300}' },
          focusRing: { value: '{colors.brand.500}' },
        },
      },
    },
  },
})

export default createSystem(defaultConfig, config)
