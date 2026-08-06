// src/pages/admin/AdminLeads.jsx
import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/dashboard/AdminLayout'
import api from '../../services/api'

export const AdminLeads = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [stats, setStats] = useState({ total: 0, newLeads: 0, contacted: 0, converted: 0, todayLeads: 0 })

  useEffect(() => { 
    loadLeads()
    loadStats()
  }, [])

  const loadLeads = async () => {
    try {
      const res = await api.get('/leads')
      setLeads(res.data?.leads || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const loadStats = async () => {
    try {
      const res = await api.get('/leads/stats')
      setStats(res.data?.stats || {})
    } catch (err) { console.error(err) }
  }

  const filtered = leads.filter(l => {
    const matchSearch = !searchTerm || 
      l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone?.includes(searchTerm)
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    const matchLevel = levelFilter === 'all' || l.recommendedLevel === levelFilter
    return matchSearch && matchStatus && matchLevel
  })

  const updateStatus = async (id, status) => {
    try { 
      await api.put(`/leads/${id}`, { status })
      loadLeads()
      loadStats()
    } catch { 
      alert('Error al actualizar estado') 
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-amber-100 text-amber-700',
      converted: 'bg-green-100 text-green-700',
      discarded: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-500'
  }

  const getStatusIcon = (status) => {
    const icons = {
      new: '🆕',
      contacted: '📞',
      converted: '✅',
      discarded: '❌'
    }
    return icons[status] || '📌'
  }

  const getSourceIcon = (source) => {
    const icons = {
      landing_hero: '🏠',
      landing_footer: '📧',
      level_test: '📝',
      website: '🌐',
      referral: '👥',
      social: '📱'
    }
    return icons[source] || '📧'
  }

  const getLevelBadge = (level) => {
    const colors = {
      A1: 'bg-emerald-100 text-emerald-700',
      A2: 'bg-blue-100 text-blue-700',
      B1: 'bg-amber-100 text-amber-700',
      B2: 'bg-orange-100 text-orange-700',
      C1: 'bg-rose-100 text-rose-700'
    }
    return colors[level] || 'bg-gray-100 text-gray-500'
  }

  const viewDetails = (lead) => {
    setSelectedLead(lead)
    setShowDetailModal(true)
  }

  // Estadísticas rápidas
  const levelStats = {
    A1: leads.filter(l => l.recommendedLevel === 'A1').length,
    A2: leads.filter(l => l.recommendedLevel === 'A2').length,
    B1: leads.filter(l => l.recommendedLevel === 'B1').length,
    B2: leads.filter(l => l.recommendedLevel === 'B2').length,
    C1: leads.filter(l => l.recommendedLevel === 'C1').length,
    pending: leads.filter(l => !l.recommendedLevel).length
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">📋 Leads</h1>
          <p className="text-xs text-gray-500">{leads.length} contactos registrados</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-primary">{stats.todayLeads || 0}</p>
            <p className="text-[10px] text-gray-500">Hoy</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-blue-600">{stats.newLeads || 0}</p>
            <p className="text-[10px] text-gray-500">Nuevos</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-amber-600">{stats.contacted || 0}</p>
            <p className="text-[10px] text-gray-500">Contactados</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-green-600">{stats.converted || 0}</p>
            <p className="text-[10px] text-gray-500">Convertidos</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-700">{stats.total || 0}</p>
            <p className="text-[10px] text-gray-500">Total</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder="🔍 Buscar por nombre, email o teléfono..." 
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" 
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">✕</button>
            )}
          </div>
          
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          >
            <option value="all">📋 Todos los estados</option>
            <option value="new">🆕 Nuevos</option>
            <option value="contacted">📞 Contactados</option>
            <option value="converted">✅ Convertidos</option>
            <option value="discarded">❌ Descartados</option>
          </select>

          <select 
            value={levelFilter} 
            onChange={e => setLevelFilter(e.target.value)} 
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          >
            <option value="all">🎯 Todos los niveles</option>
            <option value="A1">🌟 Nivel A1 ({levelStats.A1})</option>
            <option value="A2">📘 Nivel A2 ({levelStats.A2})</option>
            <option value="B1">📗 Nivel B1 ({levelStats.B1})</option>
            <option value="B2">📕 Nivel B2 ({levelStats.B2})</option>
            <option value="C1">🎓 Nivel C1 ({levelStats.C1})</option>
            <option value="pending">⏳ Sin test ({levelStats.pending})</option>
          </select>
        </div>

        {/* Versión Desktop - Tabla */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Nombre</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Email</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Teléfono</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Nivel</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Fuente</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Fecha</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Estado</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 border-t border-gray-50">
                    <td className="px-3 py-2 text-xs font-semibold text-gray-900">{lead.name}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{lead.email}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">{lead.phone || '-'}</td>
                    <td className="px-3 py-2">
                      {lead.recommendedLevel ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getLevelBadge(lead.recommendedLevel)}`}>
                          {lead.recommendedLevel}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">{getSourceIcon(lead.source)} {lead.source === 'level_test' ? 'Test' : (lead.source || '-')}</span>
                    </td>
                    <td className="px-3 py-2 text-[10px] text-gray-400">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(lead.status)}`}>
                        {getStatusIcon(lead.status)} {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => viewDetails(lead)} className="text-primary text-xs p-1 hover:bg-primary/10 rounded">🔍</button>
                        <select 
                          value={lead.status || 'new'} 
                          onChange={e => updateStatus(lead.id, e.target.value)}
                          className="text-[10px] border border-gray-200 rounded-lg px-2 py-1 bg-white"
                        >
                          <option value="new">🆕 Nuevo</option>
                          <option value="contacted">📞 Contactado</option>
                          <option value="converted">✅ Convertido</option>
                          <option value="discarded">❌ Descartado</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">No se encontraron leads</div>
          )}
        </div>

        {/* Versión Mobile - Tarjetas */}
        <div className="md:hidden space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border">No se encontraron leads</div>
          ) : (
            filtered.map(lead => (
              <div key={lead.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </div>
                  <button onClick={() => viewDetails(lead)} className="text-primary text-xs p-1">🔍</button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">📞 Teléfono</p>
                    <p className="text-gray-700">{lead.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">📊 Nivel</p>
                    {lead.recommendedLevel ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getLevelBadge(lead.recommendedLevel)}`}>
                        {lead.recommendedLevel}
                      </span>
                    ) : <span className="text-gray-400">-</span>}
                  </div>
                  <div>
                    <p className="text-gray-400">📅 Fecha</p>
                    <p className="text-gray-700">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">📊 Estado</p>
                    <select 
                      value={lead.status || 'new'} 
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      className="text-[10px] border border-gray-200 rounded-lg px-1.5 py-0.5 bg-white"
                    >
                      <option value="new">🆕 Nuevo</option>
                      <option value="contacted">📞 Contactado</option>
                      <option value="converted">✅ Convertido</option>
                      <option value="discarded">❌ Descartado</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Detalles (con resultados del test) */}
        {showDetailModal && selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={() => setShowDetailModal(false)}>
            <div className="bg-white rounded-2xl p-4 max-w-sm w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Detalles del Lead</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 text-xl">✕</button>
              </div>
              
              <div className="space-y-3">
                <div className="text-center pb-2 border-b">
                  <p className="text-lg font-bold text-gray-900">{selectedLead.name}</p>
                  <p className="text-xs text-gray-500">{selectedLead.email}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 text-xs">📞 Teléfono</span>
                    <span className="text-xs text-gray-700">{selectedLead.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 text-xs">🔗 Fuente</span>
                    <span className="text-xs text-gray-700">{getSourceIcon(selectedLead.source)} {selectedLead.source || '-'}</span>
                  </div>
                  
                  {/* Resultados del test (si existen) */}
                  {selectedLead.recommendedLevel && (
                    <>
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-400 text-xs">🎯 Nivel recomendado</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getLevelBadge(selectedLead.recommendedLevel)}`}>
                          {selectedLead.recommendedLevel}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-400 text-xs">📊 Puntaje</span>
                        <span className="text-xs text-gray-700 font-semibold">
                          {selectedLead.testScore ? `${Math.round(selectedLead.testScore)}%` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-400 text-xs">📅 Test completado</span>
                        <span className="text-xs text-gray-700">
                          {selectedLead.testCompletedAt ? new Date(selectedLead.testCompletedAt).toLocaleString() : '-'}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400 text-xs">📅 Fecha registro</span>
                    <span className="text-xs text-gray-700">
                      {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString() : '-'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400 text-xs">📊 Estado</span>
                    <select 
                      value={selectedLead.status || 'new'} 
                      onChange={e => {
                        updateStatus(selectedLead.id, e.target.value)
                        setShowDetailModal(false)
                      }}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="new">🆕 Nuevo</option>
                      <option value="contacted">📞 Contactado</option>
                      <option value="converted">✅ Convertido</option>
                      <option value="discarded">❌ Descartado</option>
                    </select>
                  </div>
                </div>

                {/* Notas (si existen) */}
                {selectedLead.notes && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-gray-400 text-xs mb-1">📝 Notas</p>
                    <p className="text-xs text-gray-600">{selectedLead.notes}</p>
                  </div>
                )}
                
                <button onClick={() => setShowDetailModal(false)} className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold text-sm mt-2">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}