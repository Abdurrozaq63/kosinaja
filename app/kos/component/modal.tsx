'use client';

import { FC, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="max-h-full fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50">
      <div className="rounded shadow-lg p-6 w-max relative top-0 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
