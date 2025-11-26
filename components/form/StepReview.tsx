'use client';
import React from 'react';
import {
  FiArrowLeft,
  FiSend,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPaperclip,
} from 'react-icons/fi';
import { FormSchemaType } from '../../features/multi-step-form/schemas/formSchemas';

interface StepReviewProps {
  data: FormSchemaType;
  onSubmit: (payload: FormSchemaType) => void;
  onBack: () => void;
  disabled?: boolean;
}

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Component to render a single review item
const ReviewItem: React.FC<{
  icon: React.ElementType;
  label: string;
  // **FIXED:** Replacing 'jsx.Element' with 'React.ReactNode'
  value: string | number | React.ReactNode;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
    <Icon className="w-5 h-5 mt-1 text-emerald-500 flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-gray-800 font-semibold">{value}</span>
    </div>
  </div>
);

const StepReview: React.FC<StepReviewProps> = ({
  data,
  onSubmit,
  onBack,
  disabled = false,
}) => {
  const handleSubmit = () => {
    onSubmit(data);
  };

  // Custom ReactNode for attachments (list of file names)
  const attachmentList: React.ReactNode = data?.attachments?.length ? (
    <ul className="list-none space-y-1">
      {data.attachments.map((file, index) => (
        <li key={index} className="text-xs text-gray-600 truncate">
          {file.name} ({formatFileSize(file.size)})
        </li>
      ))}
    </ul>
  ) : (
    'None'
  );

  return (
    // Reusing the Material Design Card style with Emerald accents
    <div className="p-8 bg-gray-50 rounded-lg shadow-2xl shadow-gray-300/50 border border-gray-200 space-y-8 transition-all duration-500">
      <h2 className="text-3xl font-extrabold text-gray-800 border-l-4 border-emerald-500 pl-3">
        Final Review & Submit
      </h2>
      <p className="text-gray-600">
        Please check all the information below is correct before submitting your
        form.
      </p>

      {/* Structured Review Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Details Section */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xl font-bold text-gray-700 pb-2 border-b border-gray-200">
            Personal & Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReviewItem icon={FiUser} label="Full Name" value={data.fullName} />
            <ReviewItem
              icon={FiMail}
              label="Email Address"
              value={data.email}
            />
            <ReviewItem
              icon={FiPhone}
              label="Phone Number"
              value={data.phone || 'N/A'}
            />
            <ReviewItem
              icon={FiMapPin}
              label="Address"
              value={data.address || 'N/A'}
            />
          </div>
        </div>

        {/* Files Section */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xl font-bold text-gray-700 pb-2 border-b border-gray-200 mt-4">
            Attachments
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <ReviewItem
              icon={FiPaperclip}
              label={`Total Files Attached (${data?.attachments?.length || 0})`}
              value={attachmentList}
            />
          </div>
        </div>
      </div>

      {/* Button Layout */}
      <div className="grid grid-cols-2 gap-4 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 font-semibold border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition duration-300 disabled:opacity-50"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Go Back & Edit</span>
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className={`flex items-center justify-center space-x-2 px-6 py-3 font-semibold rounded-xl 
            bg-emerald-600 text-white shadow-lg shadow-emerald-500/50 hover:bg-emerald-700 
            transition duration-300 
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
        >
          <span>Submit Form</span>
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepReview;
