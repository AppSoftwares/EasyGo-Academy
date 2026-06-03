import React from 'react';
import { GRADIENT_CSS } from '../../utils/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider';

  const variants = {
    primary: `text-white shadow-[0_8px_16px_rgba(255,94,54,0.3)] hover:shadow-[0_12px_20px_rgba(255,94,54,0.4)] bg-[#FF5E36]`,
    secondary: 'bg-[#5D26C1] text-white hover:bg-[#4a1da1]',
    outline: 'border-2 border-[#FF5E36] text-[#FF5E36] hover:bg-[#FF5E36]/5',
    ghost: 'text-white/80 hover:bg-white/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3.5 text-xs',
    lg: 'px-8 py-4.5 text-sm',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'flat' | 'elevated';
}

export const Card: React.FC<CardProps> = ({ children, className = '', gradient = false, onClick, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-white/5 border border-white/10 backdrop-blur-md',
    flat: 'bg-[#1A153D] border border-white/5',
    elevated: 'bg-[#1A153D] shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10',
  };

  const gradientStyles = `bg-gradient-to-br from-[#FF5E36] to-[#5D26C1] text-white border-none`;

  return (
    <div
      className={`rounded-3xl p-6 ${gradient ? gradientStyles : variantStyles[variant]} ${onClick ? 'cursor-pointer hover:bg-white/10 transition-all active:scale-[0.98]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '', showLabel = false, color }) => (
  <div className={`relative ${className}`}>
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <div
        className={`h-full transition-all duration-700 ease-out ${color || 'bg-gradient-to-r from-[#5D26C1] to-[#FF5E36]'}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
    {showLabel && (
      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/40">
        {Math.round(progress)}%
      </span>
    )}
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient' | 'secondary' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-white/10 text-white/60',
    success: 'bg-[#00E676]/20 text-[#00E676]',
    warning: 'bg-[#FFD700]/20 text-[#FFD700]',
    error: 'bg-[#FF5E36]/20 text-[#FF5E36]',
    gradient: 'bg-gradient-to-r from-[#FF5E36] to-[#5D26C1] text-white',
    secondary: 'bg-[#5D26C1]/20 text-[#5D26C1]',
    info: 'bg-[#5D26C1]/20 text-[#5D26C1]',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return src ? (
    <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />
  ) : (
    <div className={`${sizes[size]} rounded-full ${GRADIENT_CSS} flex items-center justify-center text-white font-bold ${className}`}>
      {initials}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#120E2E]/80 backdrop-blur-lg animate-fade-in" onClick={onClose}>
      <div
        className="bg-[#1A153D] border border-white/10 rounded-[2.5rem] w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40">
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 ${colors[type]} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 animate-slide-up`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 opacity-75 hover:opacity-100">
          ✕
        </button>
      )}
    </div>
  );
};

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => (
  <div className="space-y-2">
    {label && <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">{label}</label>}
    <div className="relative">
      {leftIcon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors">{leftIcon}</div>}
      <input
        className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#FF5E36] focus:border-transparent outline-none transition-all backdrop-blur-sm ${leftIcon ? 'pl-12' : ''} ${rightIcon ? 'pr-12' : ''} ${className}`}
        {...props}
      />
      {rightIcon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">{rightIcon}</div>}
    </div>
    {error && <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>}
  </div>
);

interface XPBarProps {
  currentXp: number;
  nextLevelXp: number;
  level: number;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXp, nextLevelXp, level }) => {
  const progress = (currentXp % nextLevelXp) / nextLevelXp * 100;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Level {level}</span>
        <span className="text-xs text-gray-500">{currentXp % nextLevelXp} / {nextLevelXp} XP</span>
      </div>
      <ProgressBar progress={progress} />
    </div>
  );
};

interface StreakCounterProps {
  streak: number;
  isAtRisk?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak, isAtRisk = false }) => (
  <div className={`flex items-center gap-2 ${isAtRisk ? 'text-yellow-600' : 'text-orange-500'}`}>
    <span className="text-2xl">🔥</span>
    <span className="font-bold text-xl">{streak}</span>
  </div>
);

interface CircularProgressIndicatorProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CircularProgressIndicator: React.FC<CircularProgressIndicatorProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-white/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-[#FF5E36] transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
        <span className="text-[10px] text-white/50 uppercase font-semibold">Progreso</span>
      </div>
    </div>
  );
};

export default {
  Button,
  Card,
  ProgressBar,
  Badge,
  Avatar,
  Modal,
  Toast,
  Skeleton,
  Input,
  XPBar,
  StreakCounter,
  CircularProgressIndicator,
};