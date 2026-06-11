import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Users, BookOpen, BarChart3, MessageSquare, Settings, Database, Activity, Trash2, Calendar, FileDown, ShieldAlert, Key, Plus, Check } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  target: string;
}

export default function AdminDashboard() {
  const [activeMenuTab, setActiveMenuTab] = useState<'overview' | 'users' | 'lessons' | 'analytics' | 'community' | 'settings'>('overview');
  
  // Audits log array satisfying regulatory standards
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', timestamp: new Date().toISOString(), admin: 'admin@easygo.com', action: 'INICIO DE SESIÓN', target: 'Panel Admin' },
    { id: '2', timestamp: '2026-06-01T12:35:44Z', admin: 'admin@easygo.com', action: 'APROBAR LOG', target: 'Misión Vocabulario' },
    { id: '3', timestamp: '2026-06-01T10:14:15Z', admin: 'admin@easygo.com', action: 'CREAR LECCIÓN', target: 'Sonido R Inglés' }
  ]);

  // Mock list of 10 users in DB
  const [mockUsers, setMockUsers] = useState([
    { id: '101', name: 'Ignacio Ortiz', email: 'ignacio92@gmail.com', level: 'Principiante', xt: '4,120 XP', streak: '15 días', active: 'Hace 5 minutos' },
    { id: '102', name: 'Gabriela Soto', email: 'gabysoto@gmail.com', level: 'Intermedio', xt: '12,500 XP', streak: '42 días', active: 'Hace 1 hora' },
    { id: '103', name: 'Marcos Rivas', email: 'mrivas.houston@live.com', level: 'Avanzado', xt: '22,400 XP', streak: '89 días', active: 'Ayer' },
    { id: '104', name: 'Eliana Gómez', email: 'elegomez@live.com', level: 'Principiante', xt: '1,240 XP', streak: '3 días', active: 'Hace 2 horas' },
    { id: '105', name: 'Santiago Marín', email: 'santiago_tx@outlook.com', level: 'Intermedio', xt: '8,900 XP', streak: '24 días', active: 'Hace 10 min' },
    { id: '106', name: 'Patricia L.', email: 'patty_la@gmail.com', level: 'Principiante', xt: '3,800 XP', streak: '12 días', active: 'Hace 4 horas' }
  ]);

  // Mock reported posts queue
  const [reportedQueue, setReportedQueue] = useState([
    { id: 'r1', content: "Oferta sospechosa de préstamos rápidos en Chicago...", user: "Jorge Valdés", reason: "Spam / No educativo", date: "Ayer" },
    { id: 'r2', content: "Discusión política fuera de tema en el grupo 'Preguntas laboral'...", user: "Ana Peralta", reason: "Lenguaje inapropiado", date: "Hace 2 horas" }
  ]);
  
  // Lesson state variables
  const [lessonsList, setLessonsList] = useState([
    { id: 'l1', title: 'En el Supermercado 🛒', level: 'Principiante', cat: 'Daily conversations', completed: 89432, rating: '4.8 ★' },
    { id: 'l2', title: 'El sonido TH inglés (/ð/ y /θ/) 🔊', level: 'Principiante', cat: 'Phonetics', completed: 41220, rating: '4.9 ★' },
    { id: 'l3', title: 'Conversación escolar: Padres 🏫', level: 'Intermedio', cat: 'Cultural immersion', completed: 18240, rating: '4.7 ★' }
  ]);

  // Coupon Generator States
  const [generatedCoupon, setGeneratedCoupon] = useState('');
  const [voucherList, setVoucherList] = useState(['EASYGO50']);
  
  // Filters variables
  const [userSearchText, setUserSearchText] = useState('');
  const [selectedUserLevel, setSelectedUserLevel] = useState('All');
  
  // Toggles inside settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [auditActivated, setAuditActivated] = useState(true);

  // Stats curves
  const areaData = [
    { name: 'Lun', users: 1340 },
    { name: 'Mar', users: 2450 },
    { name: 'Mié', users: 2010 },
    { name: 'Jue', uppercase: 'Jue', users: 3456 },
    { name: 'Vie', users: 2890 },
    { name: 'Sáb', users: 4120 },
    { name: 'Dom', users: 6540 }
  ];

  const pieData = [
    { name: 'Principiante A1-A2', value: 5800, color: '#FF6B35' },
    { name: 'Intermedio B1-B2', value: 4900, color: '#8B5CF6' },
    { name: 'Avanzado C1-C2', value: 2147, color: '#3B82F6' }
  ];

  const handleCreateVoucher = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'EASYGO';
    for (let i = 0; i < 4; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    setGeneratedCoupon(code);
    setVoucherList([code, ...voucherList]);
    
    // Log audit action
    setAuditLogs([
      { id: String(Date.now()), timestamp: new Date().toISOString(), admin: 'admin@easygo.com', action: 'GENERAR CUPÓN', target: code },
      ...auditLogs
    ]);
  };

  const handleDismissReport = (id: string, action: 'dismiss' | 'delete') => {
    setReportedQueue(prev => prev.filter(report => report.id !== id));
    setAuditLogs([
      { id: String(Date.now()), timestamp: new Date().toISOString(), admin: 'admin@easygo.com', action: action === 'dismiss' ? 'IGNORAR REPORTE' : 'BORRAR MENSAJE', target: id },
      ...auditLogs
    ]);
  };

  const handleAddLessonMock = () => {
    const newLess = {
      id: `l-${Date.now()}`,
      title: 'Inglés Práctico en la Farmacia 🏥',
      level: 'Principiante',
      cat: 'Daily conversations',
      completed: 0,
      rating: 'New'
    };
    setLessonsList([newLess, ...lessonsList]);
    setAuditLogs([
      { id: String(Date.now()), timestamp: new Date().toISOString(), admin: 'admin@easygo.com', action: 'CREAR LECCIÓN', target: newLess.title },
      ...auditLogs
    ]);
  };

  const handleExportCSV = () => {
    alert("Exportando base de datos a archivo CSV (12,847 registros)...");
    setAuditLogs([
      { id: String(Date.now()), timestamp: new Date().toISOString(), admin: 'admin@easygo.com', action: 'EXPORTAR BD', target: 'CSV Usuarios' },
      ...auditLogs
    ]);
  };

  const filteredUsersList = mockUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchText.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchText.toLowerCase());
    const matchesLevel = selectedUserLevel === 'All' || u.level === selectedUserLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div id="admin-workspace-layout" className="min-h-screen bg-brand-dark flex flex-col md:flex-row text-slate-100 flex-1 w-full font-sans">
      
      {/* 5.1 Collapsible Administrative Left Sidebar - Width 64px on mobile or responsive expanded */}
      <div className="w-full md:w-64 bg-slate-950/80 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-white text-lg tracking-wider">EasyGo</span>
            <span className="font-academy text-brand-orange text-md font-bold rotate-[-6deg] ml-1">Admin</span>
          </div>
          <span className="text-[9px] uppercase font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded">Console</span>
        </div>

        {/* Sidebar Nav buttons list */}
        <nav className="flex-1 p-3 space-y-1.5 select-none text-left">
          {[
            { id: 'overview', label: 'Resumen Global', icon: Activity },
            { id: 'users', label: 'Gestión Usuarios', icon: Users },
            { id: 'lessons', label: 'Gestión Lecciones', icon: BookOpen },
            { id: 'analytics', label: 'Análisis Detallados', icon: BarChart3 },
            { id: 'community', label: 'Moderación Foros', icon: MessageSquare },
            { id: 'settings', label: 'Configuración App', icon: Settings }
          ].map((itm) => {
            const IconComp = itm.icon;
            const isActive = activeMenuTab === itm.id;
            return (
              <button
                key={itm.id}
                onClick={() => setActiveMenuTab(itm.id as any)}
                className={`w-full flex items-center gap-3 p-3 text-xs font-bold rounded-xl pointer transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-orange/20 to-brand-purple/25 border-l-4 border-brand-orange text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <IconComp className="w-4 h-4 text-brand-orange shrink-0" />
                <span>{itm.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Active Administrator credentials footer with MFA notice */}
        <div className="p-4 border-t border-white/5 bg-black/40 text-left">
          <span className="text-[9px] uppercase text-emerald-400 font-extrabold flex items-center gap-1 mb-1">
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" /> MFA ACTIVO
          </span>
          <span className="text-xs text-slate-300 font-bold block truncate">admin@easygo.com</span>
          <span className="text-[10px] text-slate-500 block truncate">Super Administrador</span>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-screen text-left scrollbar-none bg-brand-bg-dark/20 brand-bg-glow">
        
        {/* TAB 1: OVERVIEW SUMMARY */}
        {activeMenuTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header statistics cards */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Total Usuarios</span>
                <h3 className="text-xl font-bold font-mono text-white mt-1">12,847</h3>
                <span className="text-[9px] text-emerald-400 mt-1 block font-semibold">+12% este mes</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Estudiantes Prácticos Activos</span>
                <h3 className="text-xl font-bold font-mono text-white mt-1">3,456</h3>
                <span className="text-[9px] text-emerald-400 mt-1 block font-semibold">Tasa de retención: 78%</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Racha Promedio Hispanos</span>
                <h3 className="text-xl font-bold font-mono text-white mt-1">12 días</h3>
                <span className="text-[9px] text-slate-500 mt-1 block font-semibold">Meta diaria promedio: 14 min</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Lecciones Completadas</span>
                <h3 className="text-xl font-bold font-mono text-white mt-1">89,432</h3>
                <span className="text-[9px] text-amber-500 mt-1 block font-semibold">+4.7 completed/user</span>
              </div>
            </div>

            {/* Area Activity Graph curve */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white font-display">Tasa de Conexión de Estudiantes</h3>
                <p className="text-xs text-slate-400">Total de alumnos únicos interactuando semanalmente en Estados Unidos</p>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
                    <YAxis stroke="#6B7280" fontSize={10} />
                    <Tooltip contentStyle={{ background: '#120E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List top learners */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white font-display">Top Estudiantes de la Semana 🏆</h3>
              
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 text-[10px] uppercase">
                      <th className="pb-3 font-semibold">Estudiante</th>
                      <th className="pb-3 font-semibold">Nivel Seleccionado</th>
                      <th className="pb-3 font-semibold">Racha Activa</th>
                      <th className="pb-3 font-semibold">Historial XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { name: 'Ignacio Ortiz', email: 'ignacio92@gmail.com', level: 'Principiante', streak: '45 días', xp: '24,120 XP' },
                      { name: 'Gabriela Torres', email: 'gabytorres@live.com', level: 'Intermedio', streak: '38 días', xp: '18,500 XP' },
                      { name: 'Marcos Rivas', email: 'mrivas@gmail.com', level: 'Avanzado', streak: '32 días', xp: '15,400 XP' }
                    ].map((usr, i) => (
                      <tr key={i} className="text-slate-300">
                        <td className="py-3">
                          <span className="font-bold text-white block">{usr.name}</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{usr.email}</span>
                        </td>
                        <td className="py-3 font-mono">{usr.level}</td>
                        <td className="py-3 text-brand-orange font-bold font-mono">🔥 {usr.streak}</td>
                        <td className="py-3 text-brand-violet font-bold font-mono">{usr.xp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeMenuTab === 'users' && (
          <div className="glass rounded-3xl p-5 border border-white/10 space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
              <div>
                <h3 className="font-bold text-sm text-white font-display">Registro de Alumnos EasyGo</h3>
                <p className="text-xs text-slate-400 mt-0.5">Filtra y exporta la base de datos de alumnos.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-100 flex items-center gap-1.5 transition-all pointer shrink-0"
                >
                  <FileDown className="w-4 h-4 shrink-0" /> Exportar CSV
                </button>
                <button
                  onClick={() => alert("Simulando acción: Nuevo usuario generado por el Administrador")}
                  className="px-4 py-2 bg-brand-orange hover:bg-brand-coral rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all pointer shrink-0"
                >
                  <Plus className="w-4 h-4 shrink-0" /> Agregar Usuario
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={userSearchText}
                onChange={(e) => setUserSearchText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-orange"
              />

              <select
                value={selectedUserLevel}
                onChange={(e) => setSelectedUserLevel(e.target.value)}
                className="bg-zinc-900 border border-white/5 rounded-xl text-xs p-2.5 text-white pointer font-semibold shrink-0"
              >
                <option value="All">Todos nivel</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            {/* Users dynamic table */}
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-[10px] uppercase">
                    <th className="pb-3">Nombre</th>
                    <th className="pb-3">Nivel</th>
                    <th className="pb-3">XP Total</th>
                    <th className="pb-3">Racha</th>
                    <th className="pb-3">Actividad</th>
                    <th className="pb-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsersList.map((usr) => (
                    <tr key={usr.id} className="text-slate-300">
                      <td className="py-3">
                        <span className="font-bold text-white block">{usr.name}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{usr.email}</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                          {usr.level}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-xs">{usr.xt}</td>
                      <td className="py-3 font-mono text-xs text-slate-200">{usr.streak}</td>
                      <td className="py-3 text-[10px] text-slate-400">{usr.active}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => alert(`Editando usuario ${usr.name}`)}
                          className="px-2 py-1 bg-white/5 rounded hover:bg-white/10 text-[10px] text-slate-300 pointer transition-all mr-1.5"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setMockUsers(prev => prev.filter(u => u.id !== usr.id));
                            setAuditLogs([
                              { id: String(Date.now()), timestamp: new Date().toISOString(), admin: 'admin@easygo.com', action: 'ELIMINAR USUARIO', target: usr.name },
                              ...auditLogs
                            ]);
                          }}
                          className="px-2 py-1 bg-brand-error/25 text-brand-error hover:bg-brand-error/40 transition-all text-[10px] rounded pointer"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LESSON MANAGEMENT */}
        {activeMenuTab === 'lessons' && (
          <div className="glass rounded-3xl p-5 border border-white/10 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="font-bold text-sm text-white font-display">Contenido e Hitos Curriculares</h3>
                <p className="text-xs text-slate-400 mt-0.5">Controla las lecciones guardadas del plan supervivencia.</p>
              </div>

              <button
                onClick={handleAddLessonMock}
                className="px-4 py-2 bg-brand-orange hover:bg-brand-coral rounded-xl text-xs font-bold text-white flex items-center gap-1 transition-all pointer"
              >
                <Plus className="w-4 h-4" /> Agregar Lección
              </button>
            </div>

            {/* Grid display */}
            <div className="grid gap-3 sm:grid-cols-3">
              {lessonsList.map((les) => (
                <div key={les.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col justify-between text-left space-y-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded">
                      {les.cat}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-2 leading-snug">{les.title}</h4>
                    <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Nivel: {les.level}</span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-400">
                    <span>{les.completed.toLocaleString()} finalizaciones</span>
                    <span className="text-brand-orange font-bold font-mono">{les.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DETAILED ANALYTICS */}
        {activeMenuTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2">
              
              {/* Level Pie chart */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4 text-center">
                <div className="text-left">
                  <h3 className="font-bold text-sm text-white font-display">Distribución de Niveles</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Nivel de partida elegido por hispanohablantes registrados</p>
                </div>

                <div className="h-44 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-4 text-[10px]">
                  {pieData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span>{entry.name} ({Math.round(entry.value / 128.47)}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement analytics cards */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4">
                <h3 className="font-bold text-sm text-white font-display">Tasa de Deserción y Churn</h3>
                
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Iniciaron primera lección con Éxito</span>
                      <span className="text-emerald-400 font-bold">85%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Permanencia semanal (Tasa Retención)</span>
                      <span className="text-brand-violet font-bold">78%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-brand-violet h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Suscripción activa / MRR de Planes</span>
                      <span className="text-brand-orange font-bold">14.2%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-brand-orange h-full rounded-full" style={{ width: '14.2%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: LEAGUE & REPORT MODERATION */}
        {activeMenuTab === 'community' && (
          <div className="glass rounded-3xl p-5 border border-white/10 space-y-4 animate-fade-in">
            <div>
              <h3 className="font-bold text-sm text-white font-display">Cola de Contenido Reportado 🚨</h3>
              <p className="text-xs text-slate-400 mt-1">Supervisa reportes activos para mantener un ambiente educativo óptimo.</p>
            </div>

            <div className="space-y-3">
              {reportedQueue.map((report) => (
                <div key={report.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-left">
                    <span className="text-[10px] text-brand-orange font-extrabold block">Filtro: {report.reason}</span>
                    <p className="text-xs italic text-slate-300 mt-1 leading-normal">"{report.content}"</p>
                    <span className="text-[10px] text-slate-500 block mt-1.5">Remitido por: {report.user} • {report.date}</span>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleDismissReport(report.id, 'dismiss')}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] text-slate-300 font-bold pointer transition-all"
                    >
                      Ignorar Reporte
                    </button>
                    <button
                      onClick={() => handleDismissReport(report.id, 'delete')}
                      className="px-3 py-1.5 bg-brand-error/20 hover:bg-brand-error/30 text-brand-error border border-brand-error/25 text-[10px] font-bold rounded-lg pointer transition-all"
                    >
                      Borrar Mensaje
                    </button>
                  </div>
                </div>
              ))}

              {reportedQueue.length === 0 && (
                <div className="py-8 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                  <span className="text-xl">🙌</span>
                  <p className="text-xs text-slate-400 mt-2">No hay mensajes reportados en cola. Comunidad limpia.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: GLOBAL CONFIG & SYSTEM AUDITS */}
        {activeMenuTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            {/* Configuration switches */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-white font-display">Ajustes del Sistema</h3>
              
              <div className="space-y-3 text-sm">
                <label className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl pointer select-none">
                  <div>
                    <span className="font-bold text-xs text-white block">Modo Mantenimiento Global</span>
                    <span className="text-[10px] text-slate-400 block">Bloquear temporalmente el acceso general de alumnos</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="accent-brand-orange scale-110"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl pointer select-none">
                  <div>
                    <span className="font-bold text-xs text-white block">Admitir Nuevos Registros Hispanos</span>
                    <span className="text-[10px] text-slate-400 block">Permite o detiene inscripciones en EasyGo Academy</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowRegistration}
                    onChange={(e) => setAllowRegistration(e.target.checked)}
                    className="accent-brand-orange scale-110"
                  />
                </label>
              </div>
            </div>

            {/* Voucher Coupon Generator */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white font-display">Generador de cupones de descuento</h3>
                <p className="text-xs text-slate-400">Crea códigos para que tus alumnos lo apliquen en Stripe.</p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleCreateVoucher}
                  className="px-4 py-2 bg-brand-orange hover:bg-brand-coral rounded-xl text-xs font-bold text-white transition-all pointer flex items-center gap-1.5"
                >
                  <Key className="w-4 h-4" /> Generar Nuevo Cupón de 50%
                </button>

                {generatedCoupon && (
                  <div className="p-3.5 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Cupón activo:</span>
                      <span className="font-mono text-white text-sm font-bold block mt-0.5">{generatedCoupon}</span>
                    </div>
                    <span className="text-brand-success text-xs font-bold block">✓ Listo para usar</span>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap pt-2">
                  <span className="text-xs text-slate-400 shrink-0 self-center">Cupones Existentes:</span>
                  {voucherList.map((voc, i) => (
                    <span key={i} className="bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-mono font-bold rounded-lg text-white">
                      {voc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Auditing Model - satisfying guidelines */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-white font-display">Bitácora de Auditoría Gubernamental</h3>
                  <p className="text-xs text-slate-400">Modelos auditados con tiempos UTC para compliance y normativas de seguridad</p>
                </div>
                <Database className="w-5 h-5 text-zinc-650 shrink-0" />
              </div>

              <div className="max-h-[150px] overflow-y-auto scrollbar-none text-[10px] space-y-2 font-mono">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-black/40 rounded border border-white/5 text-slate-400 text-left">
                    <span className="text-brand-orange font-bold font-mono">[{log.action}]</span> {log.admin} ha modificado: <strong className="text-white">"{log.target}"</strong>
                    <span className="text-slate-500 block mt-1">UTC: {log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
