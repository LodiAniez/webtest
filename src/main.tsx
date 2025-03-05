import "@/main.css"
import { createRoot } from 'react-dom/client'
import Pagination from '@/screens/pagination/index.tsx'
import AuthContextProvider from '@/services/context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
    <AuthContextProvider>
        <Pagination />
    </AuthContextProvider>
)
