import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { HERO_ROOM } from '../../data/products';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB limit
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function RoomUploadEmptyState({ onRoomImageLoaded, isLoading = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    setErrorMessage(null);

    if (!file) return;

    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileNameLower = (file.name || '').toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileNameLower.endsWith(ext));
    const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type);

    if (!hasValidExt && !hasValidMime) {
      setErrorMessage(
        `Unsupported file type (${file.type || file.name || 'unknown'}). Please upload a JPEG, PNG, or WebP photo.`
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(
        `File is too large (${sizeMb} MB). Please choose an image under 15 MB for optimal performance.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      onRoomImageLoaded({
        url: dataUrl,
        name: file.name,
        type: file.type,
        size: file.size,
        isDemo: false,
      });
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadDemo = () => {
    setErrorMessage(null);
    onRoomImageLoaded({
      url: HERO_ROOM.image,
      name: 'Sample Scandinavian Residence (Demo)',
      type: 'image/jpeg',
      size: null,
      isDemo: true,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragging
            ? 'border-[#62694A] bg-[#ECEFE6]/70'
            : 'border-[#D8D2C8] bg-[#FFFDFA] hover:border-[#62694A]/60'
        } shadow-xs`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          id="room-file-upload"
          aria-label="Upload room photograph"
        />

        <div className="w-16 h-16 mx-auto rounded-full bg-[#F5F1E9] border border-[#D8D2C8] flex items-center justify-center text-[#62694A] mb-5">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-[#62694A] border-t-transparent rounded-full animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-[#292923] font-normal">
          Upload Your Room Photograph
        </h3>
        <p className="mt-2 text-sm sm:text-base text-[#4A463D] max-w-lg mx-auto font-light leading-relaxed">
          Drag and drop a photo of your living room, or browse from your device. Supported formats: JPEG, PNG, and WebP (up to 15 MB).
        </p>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-[#FDF2F0] border border-[#E0B4AD] text-[#7A271A] text-xs sm:text-sm flex items-center justify-center space-x-2 max-w-md mx-auto text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full sm:w-auto min-h-[44px] px-7 py-3 text-sm uppercase tracking-wider font-medium bg-[#62694A] hover:bg-[#4B5237] text-[#FFFDFA] transition-colors border border-[#62694A] cursor-pointer shadow-xs focus-visible:outline-2 focus-visible:outline-[#62694A]"
          >
            {isLoading ? 'Processing...' : 'Browse Room Photo'}
          </button>

          <span className="text-xs uppercase tracking-widest text-[#4A463D] font-mono sm:px-2">or</span>

          <button
            type="button"
            onClick={handleLoadDemo}
            disabled={isLoading}
            className="w-full sm:w-auto min-h-[44px] px-6 py-3 text-sm uppercase tracking-wider font-medium bg-[#F5F1E9] hover:bg-[#EAE5DC] text-[#292923] transition-colors border border-[#D8D2C8] cursor-pointer shadow-xs flex items-center justify-center space-x-2 focus-visible:outline-2 focus-visible:outline-[#62694A]"
          >
            <Sparkles className="w-4 h-4 text-[#62694A]" />
            <span>Load Sample Room (Demo)</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-8 pt-6 border-t border-[#D8D2C8] text-xs text-[#4A463D] font-light max-w-md mx-auto">
          <p className="flex items-center justify-center space-x-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#62694A]" />
            <span>Privacy Notice: Your room photos are processed 100% locally in your browser and are never uploaded to any remote server.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
