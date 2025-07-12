import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Users, Image, Settings, 
  Search, Filter, Download, Upload, Save, X, AlertCircle,
  TrendingUp, Calendar, CreditCard, Key, Database, Activity
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../components/AuthProvider';
import toast from 'react-hot-toast';

interface ViralTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  reference_image_url: string;
  tags: string[];
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  credits: number;
  is_admin: boolean;
  total_generations: number;
  last_login: string;
  created_at: string;
}

interface AdminStats {
  totalUsers: number;
  totalTemplates: number;
  totalGenerations: number;
  activeUsers: number;
}

interface APIConfig {
  id?: string;
  openai_key: string;
  stability_key: string;
  default_credits: number;
  max_file_size: number;
  allowed_formats: string[];
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'users' | 'settings'>('dashboard');
  const [templates, setTemplates] = useState<ViralTemplate[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTemplates: 0,
    totalGenerations: 0,
    activeUsers: 0
  });
  const [apiConfig, setApiConfig] = useState<APIConfig>({
    id: 'settings',
    openai_key: '',
    stability_key: '',
    default_credits: 3,
    max_file_size: 10,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  });
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ViralTemplate | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  
  const [templateForm, setTemplateForm] = useState({
    title: '',
    description: '',
    prompt: '',
    reference_image_url: '',
    tags: '',
    is_active: true,
  });

  const [userForm, setUserForm] = useState({
    full_name: '',
    email: '',
    credits: 0,
    is_admin: false,
  });

  const { isAdmin } = useAuthContext();

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      fetchTemplates(),
      fetchUsers(),
      fetchStats(),
      fetchAPIConfig()
    ]);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Mock stats - in real implementation, these would come from database queries
      setStats({
        totalUsers: users.length || 156,
        totalTemplates: templates.length || 24,
        totalGenerations: 1247,
        activeUsers: 89
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAPIConfig = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || !supabase) {
        setApiConfig({
          id: 'settings',
          openai_key: '',
          stability_key: '',
          default_credits: 3,
          max_file_size: 10,
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
        });
        return;
      }

      const { data, error } = await supabase
        .from('api_config')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setApiConfig(data as APIConfig);
      }
    } catch (error) {
      console.error('Error fetching API config:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Mock templates data
        setTemplates([
          {
            id: '1',
            title: 'Meme Viral',
            description: 'Convierte tu foto en un meme viral trending',
            prompt: 'Transform this image into a viral meme style with bold text overlay, trending social media aesthetic, high contrast colors, and humorous elements',
            reference_image_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
            tags: ['meme', 'viral', 'divertido'],
            is_active: true,
            usage_count: 234,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            title: 'Estilo Anime',
            description: 'Transforma tu imagen al estilo anime japonés',
            prompt: 'Convert this image to anime/manga style with large expressive eyes, vibrant colors, clean line art, and Japanese animation aesthetic',
            reference_image_url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
            tags: ['anime', 'manga', 'japonés'],
            is_active: true,
            usage_count: 189,
            created_at: '2024-01-14T15:20:00Z',
            updated_at: '2024-01-14T15:20:00Z'
          },
          {
            id: '3',
            title: 'Arte Digital',
            description: 'Convierte tu foto en una obra de arte digital',
            prompt: 'Transform this image into digital art with painterly effects, artistic brushstrokes, enhanced colors, and creative digital painting style',
            reference_image_url: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
            tags: ['arte', 'digital', 'creativo'],
            is_active: false,
            usage_count: 67,
            created_at: '2024-01-13T09:45:00Z',
            updated_at: '2024-01-13T09:45:00Z'
          }
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('viral_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Error al cargar las plantillas');
    }
  };

  const fetchUsers = async () => {
    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Mock users data
        setUsers([
          {
            id: '1',
            email: 'usuario1@example.com',
            full_name: 'María García',
            credits: 5,
            is_admin: false,
            total_generations: 12,
            last_login: '2024-01-15T14:30:00Z',
            created_at: '2024-01-10T10:00:00Z'
          },
          {
            id: '2',
            email: 'usuario2@example.com',
            full_name: 'Carlos López',
            credits: 0,
            is_admin: false,
            total_generations: 8,
            last_login: '2024-01-14T16:45:00Z',
            created_at: '2024-01-08T12:30:00Z'
          },
          {
            id: '3',
            email: 'admin@example.com',
            full_name: 'Admin Usuario',
            credits: 100,
            is_admin: true,
            total_generations: 45,
            last_login: '2024-01-15T18:20:00Z',
            created_at: '2024-01-01T00:00:00Z'
          }
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
    }
  };

  const handleTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const templateData = {
        title: templateForm.title,
        description: templateForm.description,
        prompt: templateForm.prompt,
        reference_image_url: templateForm.reference_image_url,
        tags: templateForm.tags.split(',').map(tag => tag.trim()),
        is_active: templateForm.is_active,
      };

      if (editingTemplate) {
        // Mock update
        setTemplates(templates.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, ...templateData, updated_at: new Date().toISOString() }
            : t
        ));
        toast.success('Plantilla actualizada exitosamente');
      } else {
        // Mock create
        const newTemplate = {
          id: Date.now().toString(),
          ...templateData,
          usage_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setTemplates([newTemplate, ...templates]);
        toast.success('Plantilla creada exitosamente');
      }

      setShowTemplateModal(false);
      setEditingTemplate(null);
      resetTemplateForm();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error al guardar la plantilla');
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Mock update
        setUsers(users.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...userForm }
            : u
        ));
        toast.success('Usuario actualizado exitosamente');
      }

      setShowUserModal(false);
      setEditingUser(null);
      resetUserForm();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Error al guardar el usuario');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      return;
    }

    try {
      setTemplates(templates.filter(t => t.id !== templateId));
      toast.success('Plantilla eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Error al eliminar la plantilla');
    }
  };

  const handleToggleTemplateStatus = async (templateId: string, isActive: boolean) => {
    try {
      setTemplates(templates.map(t => 
        t.id === templateId ? { ...t, is_active: !isActive } : t
      ));
      toast.success(`Plantilla ${!isActive ? 'activada' : 'desactivada'} exitosamente`);
    } catch (error) {
      console.error('Error toggling template status:', error);
      toast.error('Error al cambiar el estado de la plantilla');
    }
  };

  const handleUpdateUserCredits = async (userId: string, credits: number) => {
    try {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, credits } : u
      ));
      toast.success('Créditos actualizados exitosamente');
    } catch (error) {
      console.error('Error updating user credits:', error);
      toast.error('Error al actualizar los créditos');
    }
  };

  const handleSaveAPIConfig = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY || !supabase) {
        toast.success('Configuración guardada localmente');
        return;
      }

      const { error } = await supabase.from('api_config').upsert({
        id: apiConfig.id || 'settings',
        ...apiConfig,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving API config:', error);
      toast.error('Error al guardar la configuración');
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      title: '',
      description: '',
      prompt: '',
      reference_image_url: '',
      tags: '',
      is_active: true,
    });
  };

  const resetUserForm = () => {
    setUserForm({
      full_name: '',
      email: '',
      credits: 0,
      is_admin: false,
    });
  };

  const handleEditTemplate = (template: ViralTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      title: template.title,
      description: template.description,
      prompt: template.prompt,
      reference_image_url: template.reference_image_url,
      tags: template.tags.join(', '),
      is_active: template.is_active,
    });
    setShowTemplateModal(true);
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setUserForm({
      full_name: user.full_name,
      email: user.email,
      credits: user.credits,
      is_admin: user.is_admin,
    });
    setShowUserModal(true);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && template.is_active) ||
                         (filterStatus === 'inactive' && !template.is_active);
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h1>
          <p className="text-gray-300">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Panel de Administración
          </h1>
          <p className="text-xl text-gray-300">
            Gestiona plantillas, usuarios y configuraciones del sistema
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'templates', label: 'Plantillas', icon: Image },
            { id: 'users', label: 'Usuarios', icon: Users },
            { id: 'settings', label: 'Configuración', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Dashboard General</h2>
            
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Usuarios', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
                { label: 'Plantillas Activas', value: stats.totalTemplates, icon: Image, color: 'from-purple-500 to-purple-600' },
                { label: 'Imágenes Generadas', value: stats.totalGenerations, icon: TrendingUp, color: 'from-green-500 to-green-600' },
                { label: 'Usuarios Activos', value: stats.activeUsers, icon: Activity, color: 'from-orange-500 to-orange-600' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                {[
                  { action: 'Nueva plantilla creada', item: 'Estilo Cyberpunk', time: 'Hace 2 horas', type: 'template' },
                  { action: 'Usuario registrado', item: 'ana.martinez@email.com', time: 'Hace 4 horas', type: 'user' },
                  { action: 'Imagen generada', item: 'Plantilla Anime', time: 'Hace 6 horas', type: 'generation' },
                  { action: 'Plantilla actualizada', item: 'Meme Viral', time: 'Hace 1 día', type: 'template' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'template' ? 'bg-purple-400' :
                        activity.type === 'user' ? 'bg-blue-400' : 'bg-green-400'
                      }`} />
                      <div>
                        <p className="text-white">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.item}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Gestión de Plantillas</h2>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Nueva Plantilla</span>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar plantillas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="all">Todas</option>
                  <option value="active">Activas</option>
                  <option value="inactive">Inactivas</option>
                </select>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                    {template.reference_image_url ? (
                      <img
                        src={template.reference_image_url}
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {template.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                        {template.usage_count} usos
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{template.title}</h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{template.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span>Creada: {new Date(template.created_at).toLocaleDateString()}</span>
                      <span>Actualizada: {new Date(template.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleToggleTemplateStatus(template.id, template.is_active)}
                        className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                          template.is_active 
                            ? 'bg-yellow-600 hover:bg-yellow-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {template.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No se encontraron plantillas</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
              <div className="flex gap-2">
                <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                  <Download className="h-5 w-5" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar usuarios por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Users Table */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left py-4 px-6 text-white font-semibold">Usuario</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Email</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Créditos</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Generaciones</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Último Login</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Rol</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user.full_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.full_name}</p>
                              <p className="text-gray-400 text-sm">
                                Desde {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{user.email}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={user.credits}
                              onChange={(e) => handleUpdateUserCredits(user.id, parseInt(e.target.value))}
                              className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center"
                              min="0"
                            />
                            <CreditCard className="h-4 w-4 text-gray-400" />
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{user.total_generations}</td>
                        <td className="py-4 px-6 text-gray-300">
                          {new Date(user.last_login).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.is_admin ? 'bg-purple-600 text-white' : 'bg-gray-600 text-gray-300'
                          }`}>
                            {user.is_admin ? 'Admin' : 'Usuario'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-400 hover:text-red-300 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No se encontraron usuarios</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Configuración del Sistema</h2>
            
            {/* API Configuration */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Key className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Configuración de APIs</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Clave API de OpenAI
                  </label>
                  <input
                    type="password"
                    value={apiConfig.openai_key}
                    onChange={(e) => setApiConfig({ ...apiConfig, openai_key: e.target.value })}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Clave API de Stability AI
                  </label>
                  <input
                    type="password"
                    value={apiConfig.stability_key}
                    onChange={(e) => setApiConfig({ ...apiConfig, stability_key: e.target.value })}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* System Configuration */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Configuración del Sistema</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Créditos por defecto para nuevos usuarios
                  </label>
                  <input
                    type="number"
                    value={apiConfig.default_credits}
                    onChange={(e) => setApiConfig({ ...apiConfig, default_credits: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Tamaño máximo de archivo (MB)
                  </label>
                  <input
                    type="number"
                    value={apiConfig.max_file_size}
                    onChange={(e) => setApiConfig({ ...apiConfig, max_file_size: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Formatos de imagen permitidos
                </label>
                <div className="flex flex-wrap gap-3">
                  {['jpg', 'jpeg', 'png', 'webp', 'gif'].map((format) => (
                    <label key={format} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={apiConfig.allowed_formats.includes(format)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setApiConfig({
                              ...apiConfig,
                              allowed_formats: [...apiConfig.allowed_formats, format]
                            });
                          } else {
                            setApiConfig({
                              ...apiConfig,
                              allowed_formats: apiConfig.allowed_formats.filter(f => f !== format)
                            });
                          }
                        }}
                        className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                      />
                      <span className="text-white text-sm uppercase">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveAPIConfig}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Save className="h-5 w-5" />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </div>
        )}

        {/* Template Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900 rounded-2xl border border-white/20 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingTemplate ? 'Editar Plantilla' : 'Nueva Plantilla'}
                </h3>
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                    resetTemplateForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleTemplateSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={templateForm.title}
                      onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Meme Viral"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      URL de imagen de referencia
                    </label>
                    <input
                      type="url"
                      value={templateForm.reference_image_url}
                      onChange={(e) => setTemplateForm({ ...templateForm, reference_image_url: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe qué hace esta plantilla..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Prompt para IA *
                  </label>
                  <textarea
                    value={templateForm.prompt}
                    onChange={(e) => setTemplateForm({ ...templateForm, prompt: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Prompt detallado para la IA..."
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    Este prompt se enviará a la IA junto con la imagen del usuario
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Tags (separados por comas)
                  </label>
                  <input
                    type="text"
                    value={templateForm.tags}
                    onChange={(e) => setTemplateForm({ ...templateForm, tags: e.target.value })}
                    placeholder="viral, tendencia, meme, divertido"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={templateForm.is_active}
                    onChange={(e) => setTemplateForm({ ...templateForm, is_active: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="is_active" className="text-sm text-white">
                    Plantilla activa (visible para usuarios)
                  </label>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    {editingTemplate ? 'Actualizar' : 'Crear'} Plantilla
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTemplateModal(false);
                      setEditingTemplate(null);
                      resetTemplateForm();
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* User Modal */}
        {showUserModal && editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900 rounded-2xl border border-white/20 p-6 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Editar Usuario</h3>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                    resetUserForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={userForm.full_name}
                      onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Créditos
                  </label>
                  <input
                    type="number"
                    value={userForm.credits}
                    onChange={(e) => setUserForm({ ...userForm, credits: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_admin_user"
                    checked={userForm.is_admin}
                    onChange={(e) => setUserForm({ ...userForm, is_admin: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="is_admin_user" className="text-sm text-white">
                    Permisos de administrador
                  </label>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Actualizar Usuario
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserModal(false);
                      setEditingUser(null);
                      resetUserForm();
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;