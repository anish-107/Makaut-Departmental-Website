/**
 * @author Anish
 * @description This is the layout file for Common Section
 * @date 30-11-2025
 * @returns a JSX page
 */

import React from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 flex flex-col">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
