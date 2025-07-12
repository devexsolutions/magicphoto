import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Sparkles, Download, ArrowLeft, Loader2 } from 'lucide-react';
import ReactCompareImage from 'react-compare-image';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../components/AuthProvider';
import { useLanguage } from '../components/LanguageProvider';
import toast from 'react-hot-toast';

interface ViralTemplate {
  id: string;
  title: string;
  description: string;
  reference_image_url: string;
  prompt: string;
  tags: string[];
}

const Generate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const { profile } = useAuthContext();
  const { t } = useLanguage();
  
  const [selectedTemplate, setSelectedTemplate] = useState<ViralTemplate | null>(null);
  const [templates, setTemplates] = useState<ViralTemplate[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'template' | 'upload' | 'generate' | 'result'>('template');

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (templateId && templates.length > 0) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setStep('upload');
      }
    }
  }, [templateId, templates]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('viral_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error(t('generate', 'error_loading_templates'));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleGenerate = async () => {
    if (!selectedTemplate || !uploadedImage || !profile) return;

    if (profile.credits < 1) {
      toast.error(t('generate', 'insufficient_credits'));
      return;
    }

    setIsGenerating(true);
    setStep('generate');

    try {
      // Simulate API call to generate image
      // In a real implementation, this would call your backend API
      // which would then call OpenAI/Stability AI APIs
      
      // For demo purposes, we'll use a placeholder after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated image URL
      const mockGeneratedImage = `https://picsum.photos/512/512?random=${Date.now()}`;
      
      setGeneratedImage(mockGeneratedImage);
      setStep('result');
      
      // Save to database
      await supabase.from('generated_images').insert({
        user_id: profile.id,
        template_id: selectedTemplate.id,
        original_image_url: uploadedImage,
        generated_image_url: mockGeneratedImage,
        status: 'completed',
      });

      // Deduct credit
      await supabase
        .from('user_profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', profile.id);

      toast.success(t('generate', 'success'));
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(t('generate', 'error_generating'));
      setStep('upload');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `viral-image-${Date.now()}.png`;
      link.click();
    }
  };

  const resetGeneration = () => {
    setUploadedImage(null);
    setGeneratedImage(null);
    setStep('template');
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('generate', 'title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('generate', 'subtitle')}
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { key: 'template', label: t('generate', 'step_template'), icon: Sparkles },
              { key: 'upload', label: t('generate', 'step_upload'), icon: Upload },
              { key: 'generate', label: t('generate', 'step_generate'), icon: Loader2 },
              { key: 'result', label: t('generate', 'step_result'), icon: Download },
            ].map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.key;
              const isCompleted = ['template', 'upload', 'generate'].indexOf(step) > ['template', 'upload', 'generate'].indexOf(stepItem.key);
              
              return (
                <div key={stepItem.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isActive ? 'bg-purple-600 border-purple-600 text-white' :
                    isCompleted ? 'bg-green-600 border-green-600 text-white' :
                    'border-gray-400 text-gray-400'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`ml-2 text-sm ${
                    isActive ? 'text-purple-400' :
                    isCompleted ? 'text-green-400' :
                    'text-gray-400'
                  }`}>
                    {stepItem.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Template Selection */}
        {step === 'template' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">{t('generate', 'select_template')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                    selectedTemplate?.id === template.id
                      ? 'border-purple-500'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template);
                    setStep('upload');
                  }}
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
                        <Sparkles className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{template.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Image Upload */}
        {step === 'upload' && selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{t('generate', 'upload_image')}</h2>
              <button
                onClick={() => setStep('template')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t('generate', 'change_template')}</span>
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">{t('generate', 'selected_template')}: {selectedTemplate.title}</h3>
              <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl overflow-hidden mb-4">
                {selectedTemplate.reference_image_url ? (
                  <img
                    src={selectedTemplate.reference_image_url}
                    alt={selectedTemplate.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
            </div>

            <div
              {...getRootProps()}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-12 border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isDragActive
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-white mb-2">
                  {isDragActive ? t('generate', 'drag_here') : t('generate', 'drag_prompt')}
                </p>
                <p className="text-gray-400">
                  {t('generate', 'formats')}
                </p>
              </div>
            </div>

            {uploadedImage && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">{t('generate', 'image_uploaded')}</h3>
                <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden mb-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!profile || profile.credits < 1}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {profile && profile.credits < 1 ? t('generate', 'no_credits') : t('generate', 'generate_button')}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Generation Progress */}
        {step === 'generate' && isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-white mb-4">{t('generate', 'generating')}</h2>
              <p className="text-gray-300">
                {t('generate', 'generating_desc')}
              </p>
            </div>
          </motion.div>
        )}

        {/* Result */}
        {step === 'result' && uploadedImage && generatedImage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">{t('generate', 'result_title')}</h2>
              <p className="text-gray-300">
                {t('generate', 'result_desc')}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <ReactCompareImage
                  leftImage={uploadedImage}
                  rightImage={generatedImage}
                  sliderLineColor="#8B5CF6"
                  sliderLineWidth={3}
                  handle={
                    <div className="w-8 h-8 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  }
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>{t('generate', 'download')}</span>
                </button>
                <button
                  onClick={resetGeneration}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  {t('generate', 'generate_another')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Generate;