import { Link } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { RegisterForm } from '../components/auth/RegisterForm'

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-[#0a041e] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-4">
            <Logo scrolled={true} />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-6 mb-2 tracking-tight">
            Crea tu{' '}
            <span className="bg-gradient-to-r from-primary-light via-accent to-gold bg-clip-text text-transparent">
              cuenta gratis
            </span>
          </h1>
          <p className="text-gray-400 text-sm">Empieza tu camino con el inglés hoy</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-[1px] rounded-3xl opacity-50 blur-sm bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="relative bg-[#0f0729]/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}
