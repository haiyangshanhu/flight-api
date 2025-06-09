import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import React from 'react';

function Header() {
  const [activeLink, setActiveLink] = useState('book');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  console.log('currentUser', currentUser);

  const handleLinkClick = (link) => {
    console.log('handleLinkClick', link);
    setActiveLink(link);
    navigate(`/${link}`);
    if (isMobile) {
      setIsMenuOpen(false);
    }
    console.log('activeLink', activeLink);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
    setIsDropdownOpen(false);
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!currentUser) return 'U';

    const firstInitial = currentUser.firstname ? currentUser.firstname.charAt(0) : '';
    const lastInitial = currentUser.lastname ? currentUser.lastname.charAt(0) : '';

    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (!currentUser) return 'User';

    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }

    return currentUser.email || 'User';
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown && !dropdown.contains(event.target) && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="border-b border-gray-100 shadow-sm bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-600"
          >
            <path d="M20 22H4C2.9 22 2 21.1 2 20V7C2 6.9 2 6.8 2 6.7V6.7C2 5.8 2.8 5 3.7 5H20.3C21.2 5 22 5.8 22 6.7V6.7C22 6.8 22 6.9 22 7V20C22 21.1 21.1 22 20 22Z"></path>
            <rect x="2" y="5" width="20" height="4"></rect>
            <path d="M22 9L12 13L2 9"></path>
          </svg>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className={`font-medium py-1 transition-all duration-200 relative ${
              activeLink === 'books' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-500'
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('books');
            }}
          >
            Book
            {activeLink === 'books' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
            )}
          </a>
          <a
            href="#"
            className={`font-medium py-1 transition-all duration-200 relative ${
              activeLink === 'manage' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-500'
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('manage');
            }}
          >
            Manage
            {activeLink === 'manage' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>
            )}
          </a>

          {currentUser ? (
            <div className="relative" id="user-dropdown">
              <Button
                size={'lg'}
                variant={'outline'}
                className="ml-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-all duration-200 flex items-center gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={currentUser.photoURL || ''} alt={getDisplayName()} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[120px] truncate">{getDisplayName()}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              size={'lg'}
              onClick={() => {
                handleLinkClick('login');
              }}
              variant={'outline'}
              className="ml-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-all duration-200"
            >
              Log in
            </Button>
          )}
        </nav>

        <button
          className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white border-t border-gray-100 shadow-md">
          <nav className="flex flex-col space-y-4">
            <a
              href="#"
              className={`font-medium py-2 px-2 rounded transition-all duration-200 ${
                activeLink === 'book'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-500 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('books');
              }}
            >
              Book
            </a>
            <a
              href="#"
              className={`font-medium py-2 px-2 rounded transition-all duration-200 ${
                activeLink === 'manage'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-500 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('manage');
              }}
            >
              Manage
            </a>

            {currentUser ? (
              <div className="flex flex-col space-y-2">
                <div className="font-medium py-2 px-2 text-indigo-600 bg-indigo-50 rounded flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={currentUser.photoURL || ''} alt={getDisplayName()} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{getDisplayName()}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Button
                size="default"
                variant={'outline'}
                className="ml-4 bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition-all duration-200"
                onClick={() => {
                  handleLinkClick('login');
                }}
              >
                Log in
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export { Header };
