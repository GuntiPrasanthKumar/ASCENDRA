import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Heart, Share2, Plus, Search, X, 
  TrendingUp, Users, Hash, Send, Image as ImageIcon, Loader2
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/common/Toast';
import api from '../utils/api';

export default function Echo() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/community');
      // Backend uses 'upvotes' and 'upvotedBy', map to frontend 'likes' and 'isLiked'
      const formattedPosts = response.data.map(post => ({
        id: post._id,
        author: post.author?.name || 'Anonymous',
        dept: post.author?.department || 'Student',
        time: new Date(post.createdAt).toLocaleDateString(),
        title: post.title,
        content: post.content,
        tags: post.tags,
        likes: post.upvotes,
        comments: post.comments?.length || 0,
        isLiked: post.upvotedBy?.includes(user?.id)
      }));
      setPosts(formattedPosts);
    } catch (err) {
      console.error("Fetch posts error:", err);
      addToast('Failed to load posts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [posts, searchQuery]);

  const handleLike = async (id) => {
    try {
      const response = await api.post(`/community/${id}/upvote`);
      if (response.data) {
        setPosts(prev => prev.map(post => {
          if (post.id === id) {
            const isNowLiked = response.data.upvotedBy.includes(user?.id);
            return {
              ...post,
              likes: response.data.upvotes,
              isLiked: isNowLiked
            };
          }
          return post;
        }));
      }
    } catch (err) {
      console.error("Upvote error:", err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      addToast('Please fill in both title and content', 'warning');
      return;
    }

    try {
      const response = await api.post('/community', {
        title: newPost.title,
        content: newPost.content,
        tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t)
      });

      if (response.data) {
        fetchPosts(); // Refresh list
        setNewPost({ title: '', content: '', tags: '' });
        setIsModalOpen(false);
        addToast('Post created successfully! 🚀', 'success');
      }
    } catch (err) {
      console.error("Create post error:", err);
      addToast('Failed to create post', 'error');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Main Feed */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-4xl font-display font-bold text-primary mb-2">Echo</h1>
                <p className="text-textMuted">Community discussions and academic insights.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search posts or tags..."
                    className="w-full bg-white/50 border border-muted rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-accent transition-colors text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-accent transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" /> New Post
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-accent" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="glass p-12 text-center rounded-3xl">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4 text-textMuted">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">No posts found</h3>
                <p className="text-textMuted">Try a different search term or be the first to post about it!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post, i) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 rounded-3xl hover:border-accent/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center font-bold text-white shadow-md">
                          {post.author.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-primary group-hover:text-accent transition-colors">{post.author}</h4>
                          <p className="text-xs text-textMuted font-medium">{post.dept} • {post.time}</p>
                        </div>
                      </div>
                      <div className="text-textMuted hover:text-primary cursor-pointer transition-colors">
                        <Share2 className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-primary mb-3 leading-tight">{post.title}</h3>
                    <p className="text-textSecondary text-sm mb-5 leading-relaxed">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-accent/5 border border-accent/10 rounded-full text-xs font-bold text-accent">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 pt-4 border-t border-muted/50">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-all hover:scale-105 ${post.isLiked ? 'text-accent2 font-bold' : 'text-textMuted hover:text-accent2'}`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-accent2' : ''}`} /> 
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-2 text-textMuted hover:text-primary transition-colors">
                        <MessageSquare className="w-5 h-5" /> {post.comments}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="glass p-6 rounded-3xl border border-accent/10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h3 className="font-display font-bold text-primary">Trending Topics</h3>
              </div>
              <div className="space-y-4">
                {[
                  { tag: '#Midterms2026', count: 124 },
                  { tag: '#ReactJS', count: 86 },
                  { tag: '#CircuitDesign', count: 54 },
                  { tag: '#AI_Ethics', count: 42 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm font-medium text-textPrimary group-hover:text-accent transition-colors">{item.tag}</span>
                    <span className="text-[10px] bg-muted/40 px-2 py-0.5 rounded-full text-textMuted font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-accent2" />
                <h3 className="font-display font-bold text-primary">Top Contributors</h3>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Alex Rodriguez', points: '2.4k' },
                  { name: 'Sarah J.', points: '1.8k' },
                  { name: 'Dr. Alan', points: '1.2k' },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center font-bold text-primary text-xs border border-muted">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-primary">{user.name}</p>
                      <p className="text-[10px] text-textMuted">{user.points} Echo points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative z-10 shadow-2xl border border-muted"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-primary">Create Echo Post</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-muted/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary ml-1">Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Give your post a catchy title"
                    className="w-full bg-white border border-muted rounded-xl py-3 px-4 focus:outline-none focus:border-accent transition-colors"
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary ml-1">Content</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Share your thoughts, tips, or questions..."
                    className="w-full bg-white border border-muted rounded-xl py-3 px-4 focus:outline-none focus:border-accent transition-colors resize-none"
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary ml-1">Tags (comma separated)</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Ex: CS, Midterms, React"
                      className="w-full bg-white border border-muted rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-accent transition-colors"
                      value={newPost.tags}
                      onChange={e => setNewPost({...newPost, tags: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    className="flex-1 py-3 rounded-xl border border-muted text-primary font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" /> Add Image
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-accent transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                  >
                    <Send className="w-4 h-4" /> Post Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
