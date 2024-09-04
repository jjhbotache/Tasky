import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Tasky/', // Asegúrate de reemplazar 'nombre-del-repo' por el nombre de tu repositorio
})

