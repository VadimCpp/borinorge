"use client"

import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface DropdownProps {
  title: string;
  titleClassName?: string;
  children: ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ title, titleClassName, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className={`dropdown-button ${titleClassName}`}>
        {title}
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
