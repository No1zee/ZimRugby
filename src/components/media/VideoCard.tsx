'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Clock, Eye, Calendar, Sparkles } from 'lucide-react'
import { VideoPlayer } from './VideoPlayer'

export interface VideoItem {
  id: string
  title: string
  category?: string
  duration?: string
  date?: string
  thumbnail?: string
  embedUrl: string
  description?: string
  views?: string
}

interface VideoCardProps {
  video: VideoItem
  variant?: 'featured' | 'grid' | 'compact'
  onSelect?: (video: VideoItem) => void
}

function extractYouTubeId(url?: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export default function VideoCard({ video, variant = 'grid', onSelect }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const youtubeId = extractYouTubeId(video.embedUrl) || (video.id.startsWith('live-') ? video.id.replace('live-', '') : null)

  // Smart high-definition thumbnail fallback sequence
  const youtubeThumb = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null
  const defaultRugbyThumb = 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=800&q=80'

  const thumbnailSrc =
    video.thumbnail &&
    video.thumbnail.length > 5 &&
    !video.thumbnail.includes('placeholder')
      ? video.thumbnail
      : youtubeThumb || defaultRugbyThumb

  const handleClick = () => {
    if (onSelect) {
      onSelect(video)
    } else {
      setIsPlaying(true)
    }
  }

  if (variant === 'featured') {
    return (
      <div className="group relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl transition-all hover:border-zru-green/40">
        {isPlaying ? (
          <div className="aspect-video w-full">
            <VideoPlayer embedUrl={video.embedUrl} title={video.title} autoPlay />
          </div>
        ) : (
          <div className="relative aspect-video w-full cursor-pointer overflow-hidden" onClick={handleClick}>
            <Image
              src={thumbnailSrc}
              alt={video.title}
              fill
              sizes="(max-width: 1200px) 100vw, 70vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zru-green/90 group-hover:bg-zru-green text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,107,63,0.6)] group-hover:scale-110 transition-all duration-300">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Overlay Metadata */}
            <div className="absolute bottom-0 inset-x-0 p-6 space-y-2">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-zru-green">
                <span className="px-2.5 py-1 bg-zru-green/20 border border-zru-green/40 rounded-md">
                  {video.category || 'Highlights'}
                </span>
                {video.duration && (
                  <span className="flex items-center gap-1 text-white/70">
                    <Clock className="w-3.5 h-3.5" />
                    {video.duration}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight font-heading leading-tight group-hover:text-zru-green transition-colors">
                {video.title}
              </h3>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="group relative bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-lg hover:border-zru-green/40 transition-all flex flex-col justify-between">
      {isPlaying ? (
        <div className="aspect-video w-full">
          <VideoPlayer embedUrl={video.embedUrl} title={video.title} autoPlay />
        </div>
      ) : (
        <div className="relative aspect-video w-full cursor-pointer overflow-hidden" onClick={handleClick}>
          <Image
            src={thumbnailSrc}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-zru-green/90 group-hover:bg-zru-green text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            </div>
          </div>

          {video.duration && (
            <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded">
              {video.duration}
            </span>
          )}
        </div>
      )}

      <div className="p-4 space-y-2">
        <span className="text-[10px] text-zru-green font-bold uppercase tracking-wider block">
          {video.category || 'Sables Video'}
        </span>
        <h4 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-2 group-hover:text-zru-green transition-colors">
          {video.title}
        </h4>
      </div>
    </div>
  )
}
