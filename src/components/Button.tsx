"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: string;
  variant?: "default" | "wide" | "square" | "long";
  color?: "red" | "blue" | "white" | "gray";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "default",
  color = "red",
}) => {
  const router = useRouter();

  // Default click behavior (navigate to home)
  const handleClick = () => {
    if (onClick) {
      router.push(onClick); // Call custom function if provided
    } else {
      router.push("/home");
    }
  };

  // Define variant styles
  const variantStyles = {
    default: "w-full px-5",
    wide: "w-60 px-5",
    square: "w-12 flex",
    long: "w-full text-lg",
  };

  // Define color styles
  const colorStyles = {
    red: "bg-indigo-400 hover:bg-indigo-500 focus:ring-indigo-600 text-white",
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-400 text-white",
    white: "bg-gray-200 hover:bg-gray-300 focus:ring-gray-600 text-black",
    gray: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-400 text-white",
  };

  const buttonClasses = `
    h-10 items-center justify-center cursor-pointer font-medium rounded-lg text-m text-center focus:ring-2 focus:outline-none my-0 flex justify-center align-middle
    ${variantStyles[variant]} 
    ${colorStyles[color]}
  `;

  return (
    <button onClick={handleClick} className={buttonClasses}>
      {children}
    </button>
  );
};

export default Button;
