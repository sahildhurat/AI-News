"use client";

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import SaveButton from './SaveButton';

type ArticleCardProps = {
  article: {
    id: string;
    title: string;
    source: string;
    url: string;
    image_url: string | null;
    published_at: string;
  };
  isSaved?: boolean;
};

export default function ArticleCard({ article, isSaved = false }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(article.published_at), { addSuffix: true });

  return (
    <div className="group flex flex-col md:flex-row gap-5 p-6 glass rounded-2xl hover:glass-hover hover:-translate-y-1 transition-all duration-300">
      {/* Optional Image Area */}
      {article.image_url && !imgError ? (
        <div className="md:w-1/4 h-48 md:h-auto rounded-xl overflow-hidden bg-surface-bright flex-shrink-0 relative">
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none"></div>
        </div>
      ) : (
        <div className="md:w-1/4 h-32 md:h-auto rounded-xl bg-gradient-to-br from-surface-bright to-surface-container border border-white/5 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 to-transparent"></div>
          <span className="text-on-surface-variant font-mono text-xs uppercase tracking-widest relative z-10">{article.source}</span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex flex-col flex-grow justify-between py-1">
        <div>
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              {article.source}
            </span>
            <span className="text-xs text-on-surface-variant font-medium bg-surface-bright/50 px-2.5 py-1 rounded-md">
              {timeAgo}
            </span>
          </div>
          
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="block mt-3 group/link">
            <h3 className="text-2xl font-display font-bold text-on-surface leading-snug group-hover/link:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="mt-3 text-sm text-on-surface-variant line-clamp-2">
              Dive deeper into the latest insights from {article.source}.
            </p>
          </a>
        </div>

        {/* Actions Bottom Bar */}
        <div className="flex justify-between items-center mt-6 pt-5 border-t border-white/5">
          <SaveButton articleId={article.id} initialSaved={isSaved} />
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary-fixed transition-colors">
            <span>Read Article</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
