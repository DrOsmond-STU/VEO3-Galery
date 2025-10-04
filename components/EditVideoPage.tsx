/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {Video} from '../types';
import {XMarkIcon} from './icons';

interface EditVideoPageProps {
  video: Video;
  onSave: (updatedVideo: Video) => void;
  onCancel: () => void;
}

/**
 * A modal that allows the user to edit the description of a video to remix it.
 */
export const EditVideoPage: React.FC<EditVideoPageProps> = ({
  video,
  onSave,
  onCancel,
}) => {
  const [description, setDescription] = useState(video.description);

  const handleSave = () => {
    onSave({...video, description});
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
      aria-labelledby="remix-modal-title">
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl relative p-6 md:p-8 m-4"
        onClick={(e) => e.stopPropagation()}>
        <header className="mb-6 flex justify-between items-start">
          <h1
            id="remix-modal-title"
            className="text-2xl md:text-3xl font-bold text-white mb-1">
            Remix Video
          </h1>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-2 -mt-2 -mr-2 rounded-full bg-transparent hover:bg-gray-700 transition-colors"
            aria-label="Close remix modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <main>
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2">
              Video text prompt
            </label>
            <textarea
              id="description"
              rows={10}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label={`Remix prompt for the video`}
            />
          </div>
        </main>

        <footer className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors">
            Generate new video
          </button>
        </footer>
      </div>
    </div>
  );
};
