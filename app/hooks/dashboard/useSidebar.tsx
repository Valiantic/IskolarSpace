import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserSpaces } from '../../services/iskolarspace-api';
import { useAuth } from '../../hooks/auth/useAuth';

const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Spaces dropdown state
  const [spacesDropdownOpen, setSpacesDropdownOpen] = useState(false);
  const { user } = useAuth();

  // Fetch joined spaces using TanStack Query
  const {
    data: joinedSpaces = [],
    isLoading: joinedSpacesLoading,
    error: joinedSpacesError,
    refetch: refetchJoinedSpaces,
  } = useQuery({
    queryKey: ['joinedSpaces', user?.id],
    queryFn: () => (user?.id ? getUserSpaces(user.id) : Promise.resolve([])),
    enabled: !!user?.id,
  });

  const toggleSpacesDropdown = () => setSpacesDropdownOpen(prev => !prev);

  
  // Fetch user info and profile picture
  useEffect(() => {
    const fetchUserInfo = async () => {
      // Try to get user from localStorage/sessionStorage or supabase
      const { data: { session } } = await import('../../../lib/supabaseClient').then(m => m.supabase.auth.getSession());
      const user = session?.user;
      if (!user) {
        setUserFullName(null);
        setProfilePicture(null);
        return;
      }
      // Fetch full name from tbl_users
      const { data: userData, error: userError } = await import('../../../lib/supabaseClient').then(m => m.supabase
        .from('tbl_users')
        .select('full_name')
        .eq('id', user.id)
        .single());
      if (!userError && userData) {
        setUserFullName(userData.full_name);
      } else {
        setUserFullName(null);
      }
      // Fetch avatar from profiles
      const { data: profileData, error: profileError } = await import('../../../lib/supabaseClient').then(m => m.supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single());
      if (!profileError && profileData?.avatar_url) {
        setProfilePicture(profileData.avatar_url);
      } else {
        setProfilePicture(null);
      }
    };
    fetchUserInfo();
  }, []);
   

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
    userFullName,
    profilePicture,
    dropdownOpen,
    spacesDropdownOpen,
    joinedSpaces,

    // Refs
    sidebarRef,
    dropdownRef,

    // Sidebar actions
    openSidebar,
    setUserFullName,
    closeSidebar,
    toggleSidebar,

    // Dropdown actions
    openDropdown,
    closeDropdown,
    toggleDropdown,
    toggleSpacesDropdown,

    // Combined actions
    closeAll,
    handleLogoutAction,
  };
};

export default useSidebar;
