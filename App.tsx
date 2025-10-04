/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useMemo, useState} from 'react';
import {EditVideoPage} from './components/EditVideoPage';
import {ErrorModal} from './components/ErrorModal';
import {VideoCameraIcon} from './components/icons';
import {SavingProgressPage} from './components/SavingProgressPage';
import {SortControls, SortOption} from './components/SortControls';
import {VideoGenerator} from './components/VideoGenerator';
import {VideoGrid} from './components/VideoGrid';
import {VideoPlayer} from './components/VideoPlayer';
import {MOCK_VIDEOS} from './constants';
import {Video} from './types';

import {GeneratedVideo, GoogleGenAI} from '@google/genai';

const VEO_MODEL_NAME = 'veo-2.0-generate-001';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const LOCAL_STORAGE_KEY = 'veo-gallery-sort-order';

// ---

function bloblToBase64(blob: Blob) {
  return new Promise<string>(async (resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      resolve(url.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
}

// ---

async function generateVideoFromText(
  prompt: string,
  numberOfVideos = 1,
): Promise<string[]> {
  let operation = await ai.models.generateVideos({
    model: VEO_MODEL_NAME,
    prompt,
    config: {
      numberOfVideos,
      aspectRatio: '16:9',
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log('...Generating...');
    operation = await ai.operations.getVideosOperation({operation});
  }

  if (operation?.response) {
    const videos = operation.response?.generatedVideos;
    if (videos === undefined || videos.length === 0) {
      throw new Error('No videos generated');
    }

    return await Promise.all(
      videos.map(async (generatedVideo: GeneratedVideo) => {
        const url = decodeURIComponent(generatedVideo.video.uri);
        const res = await fetch(`${url}&key=${process.env.API_KEY}`);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch video: ${res.status} ${res.statusText}`,
          );
        }
        const blob = await res.blob();
        return bloblToBase64(blob);
      }),
    );
  } else {
    throw new Error('No videos generated');
  }
}

/**
 * Main component for the Veo3 Gallery app.
 * It manages the state of videos, playing videos, editing videos and error handling.
 */
export const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [savingContext, setSavingContext] = useState<'new' | 'remix' | null>(
    null,
  );
  const [generationError, setGenerationError] = useState<string[] | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<SortOption>(() => {
    const savedSortOrder = localStorage.getItem(LOCAL_STORAGE_KEY);
    return (savedSortOrder as SortOption) || 'date-desc';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, sortOrder);
  }, [sortOrder]);

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      switch (sortOrder) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'date-asc':
          return a.createdAt - b.createdAt;
        case 'date-desc':
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [videos, sortOrder]);

  const executeVideoGeneration = async (
    prompt: string,
    context: 'new' | 'remix',
    originalTitle?: string,
  ): Promise<void> => {
    setSavingContext(context);
    setGenerationError(null);

    try {
      console.log('Generating video...', prompt);
      const videoObjects = await generateVideoFromText(prompt);

      if (!videoObjects || videoObjects.length === 0) {
        throw new Error('Video generation returned no data.');
      }

      console.log('Generated video data received.');

      const mimeType = 'video/mp4';
      const videoSrc = videoObjects[0];
      const src = `data:${mimeType};base64,${videoSrc}`;

      const newVideo: Video = {
        id: self.crypto.randomUUID(),
        title: originalTitle
          ? `Remix of "${originalTitle}"`
          : `New: "${prompt.substring(0, 40)}..."`,
        description: prompt,
        videoUrl: src,
        createdAt: Date.now(),
      };

      setVideos((currentVideos) => [newVideo, ...currentVideos]);
      setPlayingVideo(newVideo); // Go to the new video
      setSavingContext(null);
    } catch (error) {
      console.error('Video generation failed:', error);
      setGenerationError([
        'Video generation failed.',
        'Please check your API key and try again.',
      ]);
      setSavingContext(null);
      throw error;
    }
  };

  const handlePlayVideo = (video: Video) => {
    setPlayingVideo(video);
  };

  const handleClosePlayer = () => {
    setPlayingVideo(null);
  };

  const handleStartEdit = (video: Video) => {
    setPlayingVideo(null); // Close player
    setEditingVideo(video); // Open edit page
  };

  const handleCancelEdit = () => {
    setEditingVideo(null); // Close edit page, return to grid
  };

  const handleSaveEdit = async (updatedVideo: Video) => {
    setEditingVideo(null);
    await executeVideoGeneration(
      updatedVideo.description,
      'remix',
      updatedVideo.title,
    ).catch(() => {
      // Errors are handled by showing the modal in executeVideoGeneration
      // No further action needed here.
    });
  };

  const handleGenerateNewVideo = async (prompt: string): Promise<void> => {
    await executeVideoGeneration(prompt, 'new');
  };

  if (savingContext) {
    return <SavingProgressPage context={savingContext} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="mx-auto max-w-[1080px]">
        <header className="p-6 md:p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text inline-flex items-center gap-4">
            <VideoCameraIcon className="w-10 h-10 md:w-12 md:h-12" />
            <span>Veo Gallery</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Generate new videos or select one to create your own variations.
          </p>
        </header>
        <main className="px-4 md:px-8 pb-8">
          <VideoGenerator
            onGenerate={handleGenerateNewVideo}
            isGenerating={!!savingContext}
          />
          <SortControls sortOrder={sortOrder} onSortChange={setSortOrder} />
          <VideoGrid
            videos={sortedVideos}
            onPlayVideo={handlePlayVideo}
            onRemixVideo={handleStartEdit}
          />
        </main>
      </div>

      {editingVideo && (
        <EditVideoPage
          video={editingVideo}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          onClose={handleClosePlayer}
          onEdit={handleStartEdit}
        />
      )}

      {generationError && (
        <ErrorModal
          message={generationError}
          onClose={() => setGenerationError(null)}
          onSelectKey={async () => await window.aistudio?.openSelectKey()}
        />
      )}
    </div>
  );
};
