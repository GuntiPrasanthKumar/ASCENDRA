import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Share2, Plus } from 'lucide-react';
import PageTransition from '../components/common/PageTransition';

export default function Echo() {
  const posts = [
    { id: 1, author: 'Sarah J.', dept: 'Computer Science', time: '2h ago', title: 'Tips for passing the Data Structures Midterm', tags: ['CS', 'Exams', 'Tips'], likes: 45, comments: 12 },
    { id: 2, author: 'Mike T.', dept: 'Electronics', time: '5h ago', title: 'Anyone want to form a study group for Circuit Analysis?', tags: ['StudyGroup', 'Electronics'], likes: 12, comments: 5 },
    { id: 3, author: 'Dr. Alan', dept: 'Faculty', time: '1d ago', title: 'Guest lecture on Quantum Computing tomorrow at 4 PM', tags: ['Announcement', 'Event'], likes: 156, comments: 24 },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
          
          {/* Main Feed */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-display font-bold text-primary mb-2">Echo</h1>
                <p className="text-textMuted">Community discussions and announcements.</p>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-accent transition-colors">
                <Plus className="w-5 h-5" /> New Post
              </button>
            </div>

            {posts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-3xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">{post.author}</h4>
                      <p className="text-xs text-textMuted">{post.dept} • {post.time}</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-primary mb-3">{post.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/50 border border-muted rounded-full text-xs font-medium text-textMuted">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-muted text-textMuted">
                  <button className="flex items-center gap-2 hover:text-accent transition-colors">
                    <Heart className="w-5 h-5" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-2 hover:text-primary transition-colors">
                    <MessageSquare className="w-5 h-5" /> {post.comments}
                  </button>
                  <button className="flex items-center gap-2 hover:text-primary transition-colors ml-auto">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <div className="glass p-6 rounded-3xl">
              <h3 className="font-display font-bold text-primary mb-4">Trending Topics</h3>
              <div className="space-y-4">
                {['#Midterms2026', '#ReactJS', '#StudyHacks', '#CampusLife'].map((tag, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-medium text-textPrimary">{tag}</span>
                    <span className="text-xs text-textMuted">{120 - (i * 20)} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
