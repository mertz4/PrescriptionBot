"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Button from "@components/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCalendar, faCircleUser, faUser } from '@fortawesome/free-regular-svg-icons';
import SignOutButton from "@components/SignOutButton";

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current page is either sign-in or sign-up
  const isAuthPage = pathname.includes("/sign-in") || pathname.includes("/sign-up");

  return (
    <nav className="h-15 flex items-center justify-between px-6 bg-indigo-400 text-white">
      {/* Left Side (Placeholder for spacing) */}
      <div className="flex-1">
        <h1 className="text-xl font-extrabold leading-tight text-white">
          Prescription Helper
        </h1>
      </div>

      {/* Logo in the center */}
      <div className="flex justify-center">
        {/*
        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 cursor-pointer"
          onClick={() => router.push("/")}
        />
        */}
      </div>

      {/* Conditional Rendering for Buttons */}
      <div className="flex justify-end space-x-4">
        {!isAuthPage && (
          <>
            <Button color="red" variant="square">
              <FontAwesomeIcon icon={faBell} size="xl" />
            </Button>
            <Button color="red" variant="square">
              <FontAwesomeIcon icon={faCalendar} size="xl" />
            </Button>
            <Button color="red" variant="square" onClick="profile">
              <FontAwesomeIcon icon={faUser} size="xl" />
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
