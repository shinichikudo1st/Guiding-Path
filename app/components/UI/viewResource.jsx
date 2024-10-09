import React from "react";
import { FaTimes, FaExternalLinkAlt, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";

const ResourceModal = ({ resource, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-3xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">{resource.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            {resource.img_path && (
              <div className="relative w-full h-80 rounded-lg overflow-hidden">
                <Image
                  src={resource.img_path}
                  alt={resource.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <p className="text-gray-700 text-lg leading-relaxed">
              {resource.description}
            </p>
            {resource.link && (
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                Learn More
                <FaExternalLinkAlt className="ml-2" />
              </a>
            )}
          </div>
        </div>
        <div className="bg-gray-100 p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 flex items-center justify-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Posted on: {new Date(resource.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;
