/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {Video} from '../types';
import {PencilSquareIcon, PlayIcon} from './icons';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onRemix: (video: Video) => void;
}

/**
 * A component that renders a video card with a thumbnail, title, and play button.
 */
export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  onRemix,
}) => {
  return (
    <div className="group w-full text-left bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-gray-500/30 transform transition-all duration-300 hover:-translate-y-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900">
      <button
        type="button"
        className="relative block w-full focus:outline-none"
        onClick={() => onPlay(video)}
        aria-label={`Play video: ${video.title}`}>
        <div className="relative">
          <video
            className="w-full h-48 object-cover pointer-events-none"
            src={video.videoUrl}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"></video>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
            <PlayIcon className="w-16 h-16 text-white opacity-80 drop-shadow-lg group-hover:opacity-100 transform group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </button>

      <div className="p-4">
        <h3
          className="text-base font-semibold text-gray-200 truncate"
          title={video.title}>
          {video.title}
        </h3>
        <button
          onClick={() => onRemix(video)}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors"
          aria-label={`Remix video: ${video.title}`}>
          <PencilSquareIcon className="w-4 h-4" />
          <span>Remix this video</span>
        </button>
      </div>
    </div>
  );
};
