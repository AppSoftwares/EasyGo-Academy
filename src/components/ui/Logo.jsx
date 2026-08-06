import logoTop from '../../assets/images/logo2.png'
import logoScroll from '../../assets/images/logoScroll.png'

export const Logo = ({ scrolled = false, className = '' }) => {
  return (
    <img 
      src={scrolled ? logoScroll : logoTop} 
      alt="EasyGo Academy" 
      className={`h-10 sm:h-12 lg:h-14 w-auto transition-all duration-300 ${className}`}
    />
  )
}