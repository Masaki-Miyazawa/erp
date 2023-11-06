import React from 'react'

// ButtonコンポーネントのPropsの型を定義
interface ButtonProps {
  label: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}) => {
  // Tailwind CSSのクラスを組み合わせてスタイルを適用
  const baseStyle = 'px-4 py-2 border rounded focus:outline-none transition ease-in-out duration-150'
  const enabledStyle = 'bg-blue-500 hover:bg-blue-700 text-white'
  const disabledStyle = 'bg-gray-300 text-gray-500 cursor-not-allowed'

  // disabled状態に応じてスタイルを切り替え
  const buttonStyle = `${baseStyle} ${disabled ? disabledStyle : enabledStyle} ${className}`

  return (
    <button
      type={type}
      className={buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default Button
