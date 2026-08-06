import React, { useState } from 'react';
import { CommunityPost, StudyGroup } from '../types';
import { INITIAL_COMMUNITY_POSTS, STUDY_GROUPS, WEEKLY_CHALLENGE } from '../data';
import { Heart, MessageSquare, PlusCircle, CheckCircle2, Award, Users, Filter, BookOpen, Clock, Send } from 'lucide-react';

interface CommunityViewProps {
  onEarnXp: (xp: number) => void;
  userEmail: string;
  userName: string;
  isDarkMode: boolean;
}

export default function CommunityView({ onEarnXp, userEmail, userName, isDarkMode }: CommunityViewProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [groups, setGroups] = useState<StudyGroup[]>(STUDY_GROUPS);
  
  // Create Post States
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'Tips' | 'Historias' | 'Preguntas' | 'General'>('General');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Comments Active Modal
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  
  // Challenge action tracker
  const [joinedWeeklyChallenge, setJoinedWeeklyChallenge] = useState(false);

  const filterCategories = ['all', 'Tips', 'Preguntas', 'Historias', 'General'];

  const filteredPosts = posts.filter(p => activeCategory === 'all' || p.category === activeCategory);

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const liked = !p.likedByUser;
        return {
          ...p,
          likedByUser: liked,
          likes: p.likes + (liked ? 1 : -1)
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      userEmail: userEmail,
      userName: userName,
      category: newPostCategory,
      title: newPostTitle ? newPostTitle : `${newPostCategory} de ${userName.split(" ")[0]} 🗣️`,
      content: newPostContent,
      likes: 1,
      commentsCount: 0,
      comments: [],
      likedByUser: true,
      createdAt: "Recién publicado"
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setIsCreatingPost(false);
    
    // Award XP
    onEarnXp(50);
  };

  const handleToggleGroup = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const joined = !g.joined;
        return {
          ...g,
          joined,
          membersCount: g.membersCount + (joined ? 1 : -1)
        };
      }
      return g;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, {
            userName: userName.split(" ")[0],
            content: newCommentText,
            createdAt: "Reciente"
          }]
        };
      }
      return p;
    }));

    setNewCommentText('');
    onEarnXp(10); // Award small XP
  };

  const handleJoinChallenge = () => {
    setJoinedWeeklyChallenge(true);
    onEarnXp(100);
  };

  const currentCommentPost = posts.find(p => p.id === activeCommentPostId);

  const pageTextClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const pageBgClass = isDarkMode ? 'bg-brand-dark text-white' : 'bg-slate-100 text-slate-900';
  const panelClass = isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-white/95 border border-slate-200 shadow-sm';
  const bannerClass = isDarkMode
    ? 'brand-gradient border border-white/10 shadow-xl'
    : 'bg-brand-orange/10 border border-brand-orange/20 shadow-sm';

  return (
    <div id="community-view-container" className={`space-y-6 ${pageBgClass}`}>
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <span className="font-academy text-brand-orange text-3xl font-semibold">Tus Aliados</span>
        <h1 className={`font-display font-extrabold text-2xl tracking-tight ${pageTextClass}`}>Comunidad e Intercambio</h1>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Comparte tus triunfos, supera dudas de adaptación y desafíate con otros Hispanos.</p>
      </div>

      {/* Weekly Challenge Banner */}
      <div className={`rounded-3xl p-5 ${bannerClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isDarkMode ? 'animate-pulse-slow' : ''}`}>
        <div className="space-y-1.5 text-left max-w-sm">
          <span className={`text-[10px] uppercase font-mono tracking-widest font-extrabold flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-brand-orange'}`}>
            <Award className="w-4 h-4 text-brand-orange" /> DESAFÍO DE LA SEMANA
          </span>
          <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{WEEKLY_CHALLENGE.title}</h3>
          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/95' : 'text-slate-700'}`}>{WEEKLY_CHALLENGE.description}</p>
        </div>

        {!joinedWeeklyChallenge ? (
          <button
            onClick={handleJoinChallenge}
            className={`px-6 py-3 rounded-full font-bold text-xs pointer transition-all active:scale-95 shadow-lg shrink-0 self-start sm:self-center ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-brand-orange text-white hover:bg-brand-coral'}`}
          >
            Participar y Grabar (+100 XP) 🎤
          </button>
        ) : (
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shrink-0 self-start sm:self-center ${isDarkMode ? 'bg-black/40 border border-white/10 text-white' : 'bg-slate-100 border border-slate-200 text-slate-900'}`}>
            <CheckCircle2 className="w-4 h-4 text-brand-success shrink-0" /> Participando (¡+{WEEKLY_CHALLENGE.xpBonus} XP extra!)
          </div>
        )}
      </div>

      {/* Grid: Study Groups on left or top, Post Feed on right */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Side: Study Groups List */}
        <div className="space-y-4 md:col-span-1">
          <div className={`${panelClass} rounded-3xl p-5 space-y-4`}>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-orange shrink-0" />
              <h3 className={`font-bold text-sm font-display ${pageTextClass}`}>Grupos de Estudio Activos</h3>
            </div>

            <div className="grid gap-3">
              {groups.map((grp) => (
                <div
                  key={grp.id}
                  className={`${panelClass} rounded-2xl p-4 space-y-3`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full">
                        Nivel {grp.level}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {grp.membersCount} miembros
                      </span>
                    </div>
                    <h4 className={`text-xs font-bold mt-2 leading-snug ${pageTextClass}`}>{grp.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{grp.description}</p>
                  </div>

                  <button
                    onClick={() => handleToggleGroup(grp.id)}
                    className={`w-full py-2 rounded-xl text-[10px] font-bold transition-all pointer ${
                      grp.joined
                        ? 'border border-brand-orange text-brand-orange'
                        : 'bg-brand-orange text-white hover:bg-brand-coral shadow-md shadow-brand-orange/15'
                    }`}
                  >
                    {grp.joined ? '✓ Unido al Grupo' : 'Unirme al Grupo'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Posting board scroll feed */}
        <div className="md:col-span-2 space-y-4">
          
          {/* Post Header with Add Action */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 pointer ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-brand-orange to-brand-purple text-white'
                      : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'Todos 📑' : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCreatingPost(!isCreatingPost)}
              className="p-1 px-3 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-brand-coral hover:bg-white/10 transition-all pointer shrink-0 flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4 text-brand-orange" /> Crear Publicación
            </button>
          </div>

          {/* New Post Modal/Form Overlay */}
          {isCreatingPost && (
            <form
              onSubmit={handleCreatePost}
              className="glass border border-brand-orange/30 rounded-3xl p-5 space-y-3 animate-fade-in text-left"
            >
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-brand-orange mb-1">Nueva Pregunta o Tip para Hispanos</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Título breve (opcional)..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className={`bg-white/5 border border-white/5 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-orange ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                />

                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value as any)}
                  className={`rounded-xl p-3 text-xs focus:outline-none focus:border-brand-orange pointer ${isDarkMode ? 'bg-zinc-900 border border-white/5 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                >
                  <option value="General">Categoría: General</option>
                  <option value="Tips">Categoría: Tips</option>
                  <option value="Preguntas">Categoría: Preguntas</option>
                  <option value="Historias">Categoría: Historias</option>
                </select>
              </div>

              <textarea
                required
                rows={3}
                placeholder="Explica qué necesitas saber, tu tip laboral o tu victoria..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className={`w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-orange resize-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              />

              <div className="flex justify-end gap-2 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-all pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-orange hover:bg-brand-coral font-bold text-white shadow-lg pointer active:scale-95 transition-all"
                >
                  Publicar en EasyGo (+50 XP)
                </button>
              </div>
            </form>
          )}

          {/* Post Deck Item Feed */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={`rounded-2xl p-5 space-y-4 ${isDarkMode ? 'bg-brand-dark/40 border border-white/5' : 'bg-white/95 border border-slate-200'}`}
                >
                  {/* Post Metadata row */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-center">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-orange to-brand-purple flex items-center justify-center text-sm font-bold text-white font-display">
                        {post.userName.charAt(0)}
                      </div>
                      <div className="text-left font-display">
                        <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{post.userName}</span>
                        <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{post.createdAt}</span>
                      </div>
                    </div>

                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-violet bg-brand-violet/10 px-2.5 py-1 rounded-full border border-brand-violet/20 font-mono">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-1">
                    {post.title && (
                      <h4 className={`text-sm font-extrabold leading-snug ${pageTextClass}`}>{post.title}</h4>
                    )}
                    <p className="text-xs leading-relaxed text-slate-300">{post.content}</p>
                  </div>

                  {/* Post Stats/Actions footer */}
                  <div className="flex items-center gap-4 pt-3.5 border-t border-white/5">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 text-[11px] font-bold pointer transition-all ${
                        post.likedByUser ? 'text-brand-orange scale-105' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 shrink-0 ${post.likedByUser && 'fill-brand-orange'}`} /> {post.likes} Likes
                    </button>

                    <button
                      onClick={() => {
                        setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id);
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white pointer transition-all"
                    >
                      <MessageSquare className="w-4 h-4 shrink-0" /> {post.commentsCount} Comentarios
                    </button>
                  </div>

                  {/* Active Comments box */}
                  {activeCommentPostId === post.id && (
                    <div className={`space-y-3.5 rounded-xl border animate-fade-in text-left ${isDarkMode ? 'bg-black/40 border border-white/5' : 'bg-slate-100 border border-slate-200'}`}>
                      <span className="text-[10px] uppercase font-bold text-brand-orange tracking-widest block mb-1">Respuestas de Estudiantes</span>
                      
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-2 max-h-[150px] overflow-y-auto scrollbar-none">
                          {post.comments.map((comm, idx) => (
                            <div key={idx} className={`p-2 px-3.5 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-slate-100 border border-slate-200'}`}>
                              <span className={`text-[10px] font-bold shrink-0 block ${pageTextClass}`}>{comm.userName}</span>
                              <p className="text-xs text-slate-500 mt-0.5 leading-normal">{comm.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Form input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Añade una respuesta constructiva..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className={`flex-1 ${isDarkMode ? 'bg-white/5 border border-white/5 text-white' : 'bg-slate-100 border border-slate-200 text-slate-900'} rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-orange`}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="p-2 rounded-lg bg-brand-orange text-white hover:bg-brand-coral pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-white/5 rounded-2xl border border-white/5">
                <Users className="w-8 h-8 text-zinc-650 mx-auto opacity-30 animate-pulse" />
                <p className="text-sm text-slate-500 mt-2">No se encontraron comentarios aún en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
