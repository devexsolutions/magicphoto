import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Trash2,
  Calendar,
  Sparkles,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../components/AuthProvider';
import toast from 'react-hot-toast';
import { useLanguage } from '../components/LanguageProvider';

interface GeneratedImage {
  id: string;
  original_image_url: string;
  generated_image_url: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  viral_templates: {
    title: string;
    description: string;
  };
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user]);

  const fetchImages = async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select(
          `id, original_image_url, generated_image_url, status, created_at,
          viral_templates!inner (
            title,
            description
          )`
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Error al cargar las imágenes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, templateTitle: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${templateTitle}-${Date.now()}.png`;
    link.click();
  };

  const handleDelete = async (imageId: string) => {
    if (!window.confirm(t('gallery', 'delete_confirm'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      
      setImages(images.filter(img => img.id !== imageId));
      toast.success('Imagen eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error al eliminar la imagen');
    }
  };

  const handleShare = (platform: 'facebook' | 'instagram' | 'x', imageUrl: string) => {
    const url = encodeURIComponent(imageUrl);
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'instagram':
        shareUrl = `https://www.instagram.com/sharing?url=${url}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
        break;
    }
    window.open(shareUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">{t('gallery', 'loading')}</p>
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
            {t('gallery', 'my_gallery')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('gallery', 'all_creations')}
          </p>
        </motion.div>

        {images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 max-w-md mx-auto">
              <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('gallery', 'empty_title')}
              </h2>
              <p className="text-gray-300 mb-6">
                {t('gallery', 'empty_desc')}
              </p>
              <a
                href="/generate"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {t('gallery', 'generate_first')}
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className="aspect-video overflow-hidden bg-gray-800 flex items-center justify-center">
                  {image.status === 'completed' && image.generated_image_url ? (
                    <img
                      src={image.generated_image_url}
                      alt={image.viral_templates?.title || 'Imagen generada'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                      <p className="text-gray-400 text-sm">Generando...</p>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white truncate">
                      {image.viral_templates?.title || 'Plantilla eliminada'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {new Date(image.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">
                    {image.viral_templates?.description || 'Descripción no disponible'}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDownload(image.generated_image_url, image.viral_templates?.title || 'imagen')}
                      disabled={image.status !== 'completed'}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>{t('gallery', 'download')}</span>
                    </button>
                    <button
                      onClick={() => handleShare('facebook', image.generated_image_url)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                      title={t('gallery', 'share_facebook')}
                    >
                      <Facebook className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare('instagram', image.generated_image_url)}
                      className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                      title={t('gallery', 'share_instagram')}
                    >
                      <Instagram className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare('x', image.generated_image_url)}
                      className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                      title={t('gallery', 'share_x')}
                    >
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;