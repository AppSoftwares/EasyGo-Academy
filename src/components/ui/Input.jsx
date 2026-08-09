import { useState } from 'react'

export const Input = ({ 
  label, 
  icon, 
  error, 
  className = '', 
  ...props 
}) => {
  const [focused, setFocused] = useState(false)
  
  return (
    <div className="relative mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors duration-300 ${
            focused ? 'text-primary' : 'text-gray-400'
          }`}>
            {icon}
          </span>
        )}
        <input
          className={`w-full px-4 py-3 ${icon ? 'pl-12' : ''} 
            border-2 border-gray-200 rounded-xl 
            focus:border-primary focus:ring-4 focus:ring-primary/10 
            transition-all duration-300 bg-gray-50 focus:bg-white
            text-gray-900 font-medium
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
            ${className}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}