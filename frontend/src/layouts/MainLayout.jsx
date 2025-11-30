/**
 * @author Anish
 * @description This is the layout file for Common Section
 * @date 30-11-2025
 * @returns a JSX page
 */


import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Header />

        <main>
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}
