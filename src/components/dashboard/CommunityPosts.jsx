// src/components/dashboard/CommunityPosts.jsx
import { useState, useEffect } from 'react'
import { communityService } from '../../services/communityService' // Si tienes este servicio

export const CommunityPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      // Si tienes un endpoint de comunidad, usarlo
      // const res = await communityService.getRecentPosts()
      // if (res.data.success) setPosts(res.data.posts)
      
      // Si no, mostrar datos de ejemplo (o vacío)
      setPosts([])
    } catch (error) {
      console.error('Error loading community posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const colors = [
    'bg-purple-100 text-purple-600',
    'bg-blue-100 text-blue-600',
    'bg-green-100 text-green-600',
    'bg-pink-100 text-pink-600',
    'bg-orange-100 text-orange-600'
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-4">👥 Comunidad</h4>
        <div className="text-center py-6 text-gray-400 text-sm">
          <span className="text-3xl block mb-2">💬</span>
          <p>Próximamente actividades en comunidad</p>
          <p className="text-xs mt-1">Mantente atento a las novedades</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h4 className="font-bold text-gray-900 mb-4">👥 Comunidad</h4>
      <div className="space-y-4">
        {posts.slice(0, 2).map((post, i) => {
          const color = colors[i % colors.length]
          const initials = post.userName?.split(' ').map(n => n[0]).join('') || 'U'
          return (
            <div key={i} className="flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${color}`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{post.userName}</span>
                  <span className="text-xs text-gray-400">{post.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <button className="hover:text-primary transition-colors">❤️ {post.likes || 0}</button>
                  <button className="hover:text-primary transition-colors">💬 {post.comments || 0}</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}