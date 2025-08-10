import { useState, useRef, useEffect } from 'react'

const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close sidebar on mobile when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sidebar actions
  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  // Dropdown actions
  const openDropdown = () => setDropdownOpen(true);
  const closeDropdown = () => setDropdownOpen(false);
  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  // Combined actions
  const closeAll = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const handleLogoutAction = (logoutCallback: () => void) => {
    logoutCallback();
    closeAll();
  };

  return {
    // State
    isOpen,
    dropdownOpen,
    
    // Refs
    sidebarRef,
    dropdownRef,
    
    // Sidebar actions
    openSidebar,
    closeSidebar,
    toggleSidebar,
    
    // Dropdown actions
    openDropdown,
    closeDropdown,
    toggleDropdown,
    
    // Combined actions
    closeAll,
    handleLogoutAction,
  };
};

export default useSidebar;
