"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
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

  const sidebarVariants = {
    expanded: {
      width: 320,
      transition: {
        duration: 0.3,
        ease: easeInOut
      }
    },
    collapsed: {
      width: 80,
      transition: {
        duration: 0.3,
        ease: easeInOut
      }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: 0.1,
        ease: easeInOut
      }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  };

  const iconVariants = {
    expanded: {
      scale: 1,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    },
    collapsed: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  };

  return (
    <div className="sticky top-0 left-0 w-fit">
      <motion.div
        className="h-full bg-white border border-slate-200 overflow-hidden"
        variants={sidebarVariants}
        animate={isExpanded ? "expanded" : "collapsed"}
        initial="expanded"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-800">MTE</h1>
                      <p className="text-sm text-cyan-500 font-medium">Jagrat</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isExpanded && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto"
                >
                  <span className="text-white font-bold text-lg">M</span>
                </motion.div>
              )}

              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isExpanded ? (
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div>
                    <motion.div
                      className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 group cursor-pointer"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => item.subItems ? toggleSubmenu(index) : null}
                    >
                      <motion.div
                        variants={iconVariants}
                        animate={isExpanded ? "expanded" : "collapsed"}
                        className="flex-shrink-0"
                      >
                        <item.icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {isExpanded && (
                          <motion.span
                            variants={contentVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className="ml-3 text-slate-700 group-hover:text-blue-700 font-medium transition-colors duration-200 flex-1"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {isExpanded && item.subItems && (
                          <motion.div
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{
                              opacity: 1,
                              rotate: openSubmenu === index ? 0 : -90
                            }}
                            exit={{ opacity: 0, rotate: -90 }}
                            transition={{ duration: 0.2 }}
                            className="ml-auto"
                          >
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" />
                          </motion.div>
                        )}
                        {isExpanded && !item.subItems && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ delay: 0.1 }}
                            className="ml-auto"
                          >
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Submenu */}
                    <AnimatePresence>
                      {isExpanded && item.subItems && openSubmenu === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <motion.ul
                            className="mt-2 ml-8 space-y-1"
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            {item.subItems.map((subItem, subIndex) => (
                              <motion.li
                                key={subItem.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: subIndex * 0.05,
                                  duration: 0.2
                                }}
                              >
                                <motion.a
                                  href={subItem.href}
                                  className="flex items-center p-2 pl-4 rounded-lg hover:bg-blue-50 transition-all duration-200 group cursor-pointer border-l-2 border-transparent hover:border-blue-300"
                                  whileHover={{ x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="w-2 h-2 bg-slate-300 rounded-full mr-3 group-hover:bg-blue-500 transition-colors duration-200"></div>
                                  <span className="text-sm text-slate-600 group-hover:text-blue-700 transition-colors duration-200">
                                    {subItem.label}
                                  </span>
                                </motion.a>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100">
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="text-center"
                >
                  <p className="text-xs text-slate-500">© 2025 MTE Jagrat</p>
                  <p className="text-xs text-slate-400">All rights reserved</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-8 h-8 bg-slate-100 rounded-lg mx-auto"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;