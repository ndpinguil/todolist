import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Esto expone el servidor a todas las interfaces de red
    port: 5173,        // Asegúrate de que el puerto sea el correcto
    open: true          // Abre automáticamente el navegador (opcional)
  }
})
