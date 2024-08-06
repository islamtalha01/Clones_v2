"use client";

import React, { useState, useEffect } from "react";
import SubmitButton from "../../components/submit-button";
import GoogleButton from "../../components/google-button";
import { login } from "./actions";

import LoginModal from "../../components/LoginModal";

// const Modal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="relative w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
//         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//           <button
//             className="absolute top-2 right-2 text-white"
//             onClick={onClose}
//           >
//             &times;
//           </button>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

export default function LoginPage({ searchParams }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   setIsModalOpen(true);
  // }, []);

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
    // <section className="flex flex-col items-center pt-6">
    //   <Modal isOpen={isModalOpen} onClose={closeModal}>
    //     <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
    //       Login to your account
    //     </h1>
    //     {searchParams?.message && (
    //       <p className="mt-4 p-4 bg-gray-900 border-red-500 border-2 rounded-md text-white text-center">
    //         {searchParams.message}
    //       </p>
    //     )}
    //     <form className="space-y-4 md:space-y-6">
    //       <div>
    //         <label
    //           htmlFor="email"
    //           className="block mb-2 text-sm font-medium text-white"
    //         >
    //           Email
    //         </label>
    //         <input
    //           type="text"
    //           name="email"
    //           id="email"
    //           className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
    //           placeholder="Enter your email address"
    //           required
    //         />
    //       </div>
    //       <SubmitButton
    //         formAction={login}
    //         pendingText="Signing In..."
    //         className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
    //       >
    //         Sign In
    //       </SubmitButton>
    //     </form>
    //     <div className="flex justify-center text-white">
    //       <p>OR</p>
    //     </div>
    //     <GoogleButton />
    //   </Modal>
    // </section>
    <LoginModal />
  );
}
