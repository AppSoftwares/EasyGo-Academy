import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../ui/Logo'

export const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú al hacer scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        (scrolled || mobileMenuOpen) ? 'bg-white/95 backdrop-blur-lg border-b border-gray-100 py-3 shadow-sm' : 'bg-transparent py-4 sm:py-5'
      }`}>
        <div className="container-custom flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 z-50">
           <Logo scrolled={(scrolled || mobileMenuOpen) } />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {/* Redes Sociales */}
            <a href="https://www.facebook.com/share/1DNBQfid66/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                scrolled ? 'bg-gray-100 text-gray-500 hover:bg-[#1877F2] hover:text-white' : 'bg-white/10 text-white/70 hover:bg-[#1877F2] hover:text-white'
              }`} title="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/easygoacademyaz?igsh=dTBubGZkcG84aG4x" target="_blank" rel="noopener noreferrer"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                scrolled ? 'bg-gray-100 text-gray-500 hover:bg-[#E4405F] hover:text-white' : 'bg-white/10 text-white/70 hover:bg-[#E4405F] hover:text-white'
              }`} title="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@easygoacademy?_r=1&_t=ZS-95sYbshPpG1" target="_blank" rel="noopener noreferrer"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                scrolled ? 'bg-gray-100 text-gray-500 hover:bg-black hover:text-white' : 'bg-white/10 text-white/70 hover:bg-black hover:text-white'
              }`} title="TikTok">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>

            <div className="w-px h-6 bg-gray-300/50 mx-1" />

            <Link to="/login" className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              scrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              Iniciar sesión
            </Link>
            <a href="#register" className="bg-accent hover:bg-accent-light text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md">
              Comenzar gratis
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
            aria-label="Menú"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                mobileMenuOpen 
                  ? 'bg-gray-900 rotate-45 translate-y-2' 
                  : scrolled ? 'bg-gray-900' : 'bg-white'
              }`} />
              <span className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                mobileMenuOpen 
                  ? 'opacity-0' 
                  : scrolled ? 'bg-gray-900' : 'bg-white'
              }`} />
              <span className={`block w-6 h-0.5 rounded-full transition-all duration-300 ${
                mobileMenuOpen 
                  ? 'bg-gray-900 -rotate-45 -translate-y-2' 
                  : scrolled ? 'bg-gray-900' : 'bg-white'
              }`} />
            </div>
          </button>
        </div>
      </header>

      {/* ============ MOBILE MENU OVERLAY ============ */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
        mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Fondo oscuro */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Panel del menú */}
        <div className={`absolute top-[65px] right-0 w-80 max-w-[85vw] h-full bg-white shadow-2xl transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full p-6">
            {/* Header del menú */}
            {/* <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                <Logo scrolled={scrolled} />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div> */}

            {/* Redes Sociales */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Síguenos</p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/share/1DNBQfid66/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/easygoacademyaz?igsh=dTBubGZkcG84aG4x" target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 hover:bg-[#E4405F] hover:text-white flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.tiktok.com/@easygoacademy?_r=1&_t=ZS-95sYbshPpG1" target="_blank" rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 hover:bg-black hover:text-white flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              </div>
            </div>

            {/* Navegación */}
            <nav className="flex-1 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menú</p>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                <span className="text-lg">✨</span> Características
              </a>
              <a href="#method" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                <span className="text-lg">🧠</span> Método EASYGO
              </a>
              <a href="#levels" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                <span className="text-lg">📚</span> Niveles A1-C1
              </a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                <span className="text-lg">💬</span> Testimonios
              </a>
            </nav>

            {/* Botones de acción */}
            <div className="mb-14 space-y-3 pt-4 border-t border-gray-100">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-3.5 border-2 border-primary text-primary rounded-2xl font-semibold hover:bg-primary hover:text-white transition-all"
              >
                Iniciar sesión
              </Link>
             
            </div>
          </div>
        </div>
      </div>
    </>
  )
}