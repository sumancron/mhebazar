"use client";
import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  UserPlus,
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard',
      subItems: [
        { label: 'Analytics', href: '/dashboard/analytics' },
        { label: 'Reports', href: '/dashboard/reports' },
        { label: 'Statistics', href: '/dashboard/statistics' }
      ]
    },
    {
      icon: FileText,
      label: 'All Forms',
      href: '/forms',
      subItems: [
        { label: 'Contact Forms', href: '/forms/contact' },
        { label: 'Registration Forms', href: '/forms/registration' },
        { label: 'Feedback Forms', href: '/forms/feedback' },
        { label: 'Survey Forms', href: '/forms/survey' }
      ]
    },
    {
      icon: Users,
      label: 'Registered User',
      href: '/users',
      subItems: [
        { label: 'Active Users', href: '/users/active' },
        { label: 'Pending Users', href: '/users/pending' },
        { label: 'Blocked Users', href: '/users/blocked' },
        { label: 'User Analytics', href: '/users/analytics' }
      ]
    },
    {
      icon: UserPlus,
      label: 'Add Sub Admin',
      href: '/add-admin',
      subItems: [
        { label: 'Create Admin', href: '/add-admin/create' },
        { label: 'Admin Permissions', href: '/add-admin/permissions' },
        { label: 'Admin Roles', href: '/add-admin/roles' }
      ]
    },
    {
      icon: Plus,
      label: 'Add Product',
      href: '/add-product',
      subItems: [
        { label: 'New Product', href: '/add-product/new' },
        { label: 'Product Categories', href: '/add-product/categories' },
        { label: 'Bulk Import', href: '/add-product/bulk' },
        { label: 'Product Templates', href: '/add-product/templates' }
      ]
    },
    {
      icon: MessageSquare,
      label: 'Enquiry History',
      href: '/enquiry',
      subItems: [
        { label: 'Recent Enquiries', href: '/enquiry/recent' },
        { label: 'Pending Enquiries', href: '/enquiry/pending' },
        { label: 'Resolved Enquiries', href: '/enquiry/resolved' },
        { label: 'Enquiry Reports', href: '/enquiry/reports' }
      ]
    },
  ];

  const toggleSubmenu = (index: number) => {
    if (!isExpanded) return;
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return (
    <div className="sticky top-0 left-0 w-fit h-screen">
      <div
        className={`h-full bg-gradient-to-b from-white to-green-50 border-r-2 border-[#5da031]/20 shadow-lg transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'w-20'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-4 border-b-2 border-[#5da031]/20 bg-gradient-to-r from-[#5da031]/5 to-white">
            <div className="flex items-center justify-between">
              {isExpanded ? (
                <div className="flex items-center space-x-3 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5da031] to-[#4a8b2a] rounded-lg flex items-center justify-center shadow-lg shadow-[#5da031]/25 transform transition-transform hover:scale-105 ring-2 ring-[#5da031]/10">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div className="transition-all duration-300">
                    <h1 className="text-xl font-bold text-gray-800">MTE</h1>
                    <p className="text-sm text-[#5da031] font-semibold">Jagrat</p>
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-[#5da031] to-[#4a8b2a] rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-[#5da031]/25 transform transition-transform hover:scale-105 ring-2 ring-[#5da031]/10">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-[#5da031]/10 transition-all duration-200 hover:scale-110 active:scale-95 border border-transparent hover:border-[#5da031]/20"
              >
                {isExpanded ? (
                  <ChevronLeft className="w-5 h-5 text-gray-600 hover:text-[#5da031]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600 hover:text-[#5da031]" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={item.label}>
                  <div>
                    <div
                      className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-[#5da031]/10 hover:to-[#5da031]/20 transition-all duration-200 cursor-pointer group hover:shadow-md hover:shadow-[#5da031]/10 transform hover:-translate-y-0.5 border border-transparent hover:border-[#5da031]/30"
                      onClick={() => item.subItems ? toggleSubmenu(index) : null}
                    >
                      <div className="p-1.5 rounded-md group-hover:bg-[#5da031]/10 group-hover:shadow-sm transition-all duration-200 border border-transparent group-hover:border-[#5da031]/20">
                        <item.icon className="w-5 h-5 text-gray-600 group-hover:text-[#5da031] transition-colors" />
                      </div>

                      {isExpanded && (
                        <>
                          <span className="ml-3 text-gray-700 group-hover:text-[#5da031] font-medium flex-1 transition-colors group-hover:font-semibold">
                            {item.label}
                          </span>

                          {item.subItems && (
                            <div className="p-1 rounded group-hover:bg-[#5da031]/10 transition-all duration-200">
                              <ChevronDown
                                className={`w-4 h-4 text-gray-400 group-hover:text-[#5da031] transition-all duration-300 ${openSubmenu === index ? 'rotate-0' : '-rotate-90'
                                  }`}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Submenu */}
                    {isExpanded && item.subItems && (
                      <div className={`overflow-hidden transition-all duration-300 ${openSubmenu === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                        <div className="mt-2 ml-8 space-y-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              className="flex items-center p-2 pl-4 rounded-lg hover:bg-gradient-to-r hover:from-[#5da031]/10 hover:to-[#5da031]/20 transition-all duration-200 group border-l-2 border-[#5da031]/20 hover:border-[#5da031] hover:shadow-md hover:shadow-[#5da031]/10 transform hover:translate-x-1 hover:bg-[#5da031]/5"
                              style={{
                                animationDelay: `${subIndex * 50}ms`,
                                animation: openSubmenu === index ? 'slideInLeft 0.3s ease-out forwards' : 'none'
                              }}
                            >
                              <div className="w-2 h-2 bg-[#5da031]/40 rounded-full mr-3 group-hover:bg-[#5da031] transition-all duration-200 group-hover:scale-125 group-hover:shadow-sm"></div>
                              <span className="text-sm text-gray-600 group-hover:text-[#5da031] transition-colors group-hover:font-medium">
                                {subItem.label}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-[#5da031]/20 bg-gradient-to-r from-[#5da031]/5 to-white">
            {isExpanded ? (
              <div className="text-center transition-all duration-300">
                <p className="text-xs text-[#5da031] font-medium">© 2025 MTE Jagrat</p>
                <p className="text-xs text-[#5da031]/70">All rights reserved</p>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-[#5da031]/20 to-[#5da031]/40 rounded-lg mx-auto transition-all duration-300 hover:from-[#5da031]/40 hover:to-[#5da031]/60 shadow-sm hover:shadow-md" />
            )}
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Sidebar;