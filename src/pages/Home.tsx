import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../components/AuthProvider';

interface ViralTemplate {
  id: string;
  title: string;
  description: string;
  reference_image_url: string;
  tags: string[];
  is_active: boolean;
}

const Home: React.FC = () => {
  const [templates, setTemplates] = useState<ViralTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase not configured, using mock data');
        setTemplates([
          {
            id: '1',
            title: 'Meme Viral',
            description: 'Convierte tu foto en un meme viral trending',
            reference_image_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
            tags: ['meme', 'viral', 'divertido'],
            is_active: true
          },
          {
            id: '2',
            title: 'Estilo Anime',
            description: 'Transforma tu imagen al estilo anime japonés',
            reference_image_url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
            tags: ['anime', 'manga', 'japonés'],
            is_active: true
          },
          {
            id: '3',
            title: 'Arte Digital',
            description: 'Convierte tu foto en una obra de arte digital',
            reference_image_url: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
            tags: ['arte', 'digital', 'creativo'],
            is_active: true
          }
        ]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('viral_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Convierte tu imagen
              </span>
              <br />
              <span className="text-white">en una tendencia</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transforma tus fotos en imágenes virales usando IA generativa. 
              Sin necesidad de saber ingeniería de prompts, solo sube tu imagen y elige una plantilla.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/generate"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Generar Ahora
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Comenzar Gratis
                </Link>
              )}
              <Link
                to="#templates"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                Ver Plantillas
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Por qué elegir ViralGenAI?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Creamos la mejor experiencia para generar contenido viral
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Zap,
                title: 'Súper Rápido',
                description: 'Genera imágenes virales en segundos, no horas',
                color: 'from-yellow-400 to-orange-400',
              },
              {
                icon: TrendingUp,
                title: 'Tendencias Actuales',
                description: 'Plantillas actualizadas con las últimas tendencias virales',
                color: 'from-green-400 to-blue-400',
              },
              {
                icon: Users,
                title: 'Fácil de Usar',
                description: 'Sin conocimiento técnico necesario, solo sube y genera',
                color: 'from-purple-400 to-pink-400',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Plantillas Virales
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Elige entre nuestras plantillas más populares y trending
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto"></div>
              <p className="mt-4">Cargando plantillas...</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={itemVariants}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 group"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                    {template.reference_image_url ? (
                      <img
                        src={template.reference_image_url}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
                    <p className="text-gray-300 mb-4">{template.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={isAuthenticated ? `/generate?template=${template.id}` : '/register'}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                    >
                      {isAuthenticated ? 'Usar Plantilla' : 'Registrarse para usar'}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {templates.length === 0 && !loading && (
            <div className="text-center text-gray-400 py-12">
              <p>No hay plantillas disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;