/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

export type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

interface SortControlsProps {
  sortOrder: SortOption;
  onSortChange: (sortOrder: SortOption) => void;
}

/**
 * A component that provides UI controls for sorting the video grid.
 */
export const SortControls: React.FC<SortControlsProps> = ({
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="flex justify-end mb-6">
      <div className="relative">
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="appearance-none w-full md:w-auto bg-gray-800 border border-gray-700 text-white py-2 pl-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-700 focus:border-purple-500"
          aria-label="Sort videos by">
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="title-asc">Title: A-Z</option>
          <option value="title-desc">Title: Z-A</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
