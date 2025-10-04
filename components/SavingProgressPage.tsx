/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useState} from 'react';

interface SavingProgressPageProps {
  context: 'new' | 'remix';
}

const messages = [
  'Warming up the virtual cameras...',
  'Analyzing your creative prompt...',
  'Casting the digital actors...',
  'Rendering the first frames...',
  'Adding special effects...',
  'Polishing the final cut...',
];

/**
 * A fullscreen overlay that displays a loading animation and text indicating that
 * a video is being created.
 */
export const SavingProgressPage: React.FC<SavingProgressPageProps> = ({
  context,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const title =
    context === 'remix'
      ? 'Creating your remix...'
      : 'Bringing your vision to life...';

  return (
    <div
      className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50 animate-fade-in"
      aria-live="polite"
      aria-busy="true">
      <svg
        className="w-24 h-24 text-purple-500 animate-spin-slow"
        viewBox="0 0 100 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100ZM50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85Z"
        />
        <circle cx="50" cy="25" r="5" />
        <circle cx="75" cy="50" r="5" />
        <circle cx="50" cy="75" r="5" />
        <circle cx="25" cy="50" r="5" />
      </svg>
      <h2 className="text-2xl font-bold text-white mt-8">{title}</h2>
      <p className="text-gray-400 mt-2 min-h-[1.5rem] transition-opacity duration-500 text-center px-4">
        {messages[currentMessageIndex]}
      </p>
    </div>
  );
};