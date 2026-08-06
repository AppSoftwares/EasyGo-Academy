export const FeatureCard = ({ number, icon, title, description }) => {
  return (
    <div className="group bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl text-center transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 sm:hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      
      <span className="absolute top-4 right-4 sm:top-6 sm:right-8 text-4xl sm:text-5xl lg:text-6xl font-black text-primary/5">{number}</span>
      
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
        {icon}
      </div>
      
      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}