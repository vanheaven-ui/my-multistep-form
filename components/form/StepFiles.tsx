'use client';
import React, { useState, useCallback } from 'react';
import {
  FiArrowLeft,
  FiArrowRight,
  FiUploadCloud,
  FiFile,
  FiXCircle,
  FiAlertTriangle,
} from 'react-icons/fi';

interface StepFilesProps {
  defaultValues: {
    attachments: File[];
  };
  onSave: (data: { attachments: File[] }) => void;
  onNext: () => void;
  onBack: () => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_COUNT = 5;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const ALLOWED_TYPES_STRING = ALLOWED_TYPES.map((t) =>
  t.split('/')[1].toUpperCase(),
).join(', ');

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const StepFiles: React.FC<StepFilesProps> = ({
  defaultValues,
  onSave,
  onNext,
  onBack,
  disabled = false,
}) => {
  const [attachments, setAttachments] = useState<File[]>(
    defaultValues.attachments || [],
  );
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const addFiles = useCallback(
    (files: File[]) => {
      setUploadError(null);
      const newFiles = [...attachments]; // ✅ FIXED: const instead of let
      let hasError = false;

      files.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          setUploadError(
            `File ${file.name} exceeds the ${formatFileSize(MAX_FILE_SIZE)} size limit.`,
          );
          hasError = true;
          return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
          setUploadError(
            `File ${file.name} is an unsupported type. Allowed: ${ALLOWED_TYPES_STRING}.`,
          );
          hasError = true;
          return;
        }

        if (newFiles.length >= MAX_FILE_COUNT) {
          setUploadError(`Maximum of ${MAX_FILE_COUNT} files reached.`);
          hasError = true;
          return;
        }

        newFiles.push(file);
      });

      if (!hasError) {
        setAttachments(newFiles);
        onSave({ attachments: newFiles });
      }
    },
    [attachments, onSave],
  );

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      addFiles(files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const removeFile = (fileName: string) => {
    const newAttachments = attachments.filter((f) => f.name !== fileName);
    setAttachments(newAttachments);
    onSave({ attachments: newAttachments });
    setUploadError(null);
  };

  const isNextDisabled = disabled || attachments.length === 0;

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-2xl shadow-gray-300/50 border border-gray-200 space-y-8 transition-all duration-500">
      <h2 className="text-3xl font-extrabold text-gray-800 border-l-4 border-emerald-500 pl-3">
        Document Upload
      </h2>

      <p className="text-gray-600">
        Please attach the necessary files (e.g., CV, proof of ID).
        <span className="font-semibold text-emerald-700 block mt-1">
          Max {MAX_FILE_COUNT} files, {formatFileSize(MAX_FILE_SIZE)} limit per
          file. Allowed types: {ALLOWED_TYPES_STRING}.
        </span>
      </p>

      <div
        className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-300 
          ${dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="attachments"
          multiple
          accept={ALLOWED_TYPES.join(', ')}
          onChange={handleManualChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
          aria-label="Drag & Drop files here"
        />
        <FiUploadCloud className="w-12 h-12 mx-auto text-emerald-500 mb-2" />

        {/* react/no-unescaped-entities */}
        <p className="text-gray-700 font-medium">
          <span className="mr-1">Drag &amp; Drop files here or</span>
          <span className="text-emerald-600 underline cursor-pointer">
            click to browse
          </span>
        </p>
      </div>

      {uploadError && (
        <div
          className="flex items-center space-x-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          role="alert"
        >
          <FiAlertTriangle className="w-5 h-5" />
          <p className="text-sm font-medium">{uploadError}</p>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-3 p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            Uploaded Files ({attachments.length}/{MAX_FILE_COUNT})
          </h3>
          <ul className="space-y-2">
            {attachments.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
              >
                <span className="flex items-center space-x-2 truncate">
                  <FiFile className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium text-gray-700 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({formatFileSize(file.size)})
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(file.name)}
                  disabled={disabled}
                  className="text-red-500 hover:text-red-700 transition"
                  title={`Remove ${file.name}`}
                >
                  <FiXCircle className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 font-semibold border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition duration-300 disabled:opacity-50"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`flex items-center justify-center space-x-2 px-6 py-3 font-semibold rounded-xl 
            bg-emerald-600 text-white shadow-lg shadow-emerald-500/50 hover:bg-emerald-700 
            transition duration-300 
            ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
        >
          <span>Next Step</span>
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepFiles;
