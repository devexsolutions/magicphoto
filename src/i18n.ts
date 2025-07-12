export type Language = 'es' | 'en';

export const translations = {
  es: {
    nav: {
      home: 'Inicio',
      generate: 'Generar',
      gallery: 'Mis Imágenes',
      admin: 'Admin',
      credits: 'créditos',
      logout: 'Salir',
      login: 'Iniciar Sesión',
      register: 'Registrarse'
    },
    footer: { text: 'Convierte tu imagen en una tendencia.' },
    home: {
      tagline1: 'Convierte tu imagen',
      tagline2: 'en una tendencia',
      hero_desc:
        'Transforma tus fotos en imágenes virales usando IA generativa. Sin necesidad de saber ingeniería de prompts, solo sube tu imagen y elige una plantilla.',
      generate_now: 'Generar Ahora',
      start_free: 'Comenzar Gratis',
      view_templates: 'Ver Plantillas',
      why_choose: '¿Por qué elegir ViralGenAI?',
      best_exp: 'Creamos la mejor experiencia para generar contenido viral'
    },
    login: {
      title: 'Inicia sesión en tu cuenta',
      no_account: '¿No tienes una cuenta?',
      register_here: 'Regístrate aquí',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgot: '¿Olvidaste tu contraseña?',
      recover: 'Recuperar contraseña',
      submit: 'Iniciar sesión',
      submitting: 'Iniciando sesión...'
    },
    register: {
      title: 'Crea tu cuenta',
      have_account: '¿Ya tienes una cuenta?',
      login_here: 'Inicia sesión aquí',
      full_name: 'Nombre completo',
      email: 'Correo electrónico',
      password: 'Contraseña',
      placeholder_password: 'Mínimo 6 caracteres',
      submit: 'Crear cuenta',
      submitting: 'Creando cuenta...'
    },
    gallery: {
      loading: 'Cargando tu galería...',
      my_gallery: 'Mi Galería de Imágenes Virales',
      all_creations: 'Todas tus creaciones generadas con IA',
      empty_title: 'Tu galería está vacía',
      empty_desc: 'Aún no has generado ninguna imagen viral. ¡Empieza ahora!',
      generate_first: 'Generar mi primera imagen',
      download: 'Descargar',
      delete_confirm: '¿Estás seguro de que quieres eliminar esta imagen?'
    }
  },
  en: {
    nav: {
      home: 'Home',
      generate: 'Generate',
      gallery: 'My Images',
      admin: 'Admin',
      credits: 'credits',
      logout: 'Logout',
      login: 'Login',
      register: 'Sign Up'
    },
    footer: { text: 'Turn your image into a trend.' },
    home: {
      tagline1: 'Turn your image',
      tagline2: 'into a trend',
      hero_desc:
        'Transform your photos into viral images using generative AI. No prompt engineering needed, just upload your image and choose a template.',
      generate_now: 'Generate Now',
      start_free: 'Start Free',
      view_templates: 'View Templates',
      why_choose: 'Why choose ViralGenAI?',
      best_exp: 'We create the best experience for generating viral content'
    },
    login: {
      title: 'Sign in to your account',
      no_account: "Don't have an account?",
      register_here: 'Sign up here',
      email: 'Email',
      password: 'Password',
      forgot: 'Forgot your password?',
      recover: 'Recover password',
      submit: 'Log In',
      submitting: 'Logging in...'
    },
    register: {
      title: 'Create your account',
      have_account: 'Already have an account?',
      login_here: 'Sign in here',
      full_name: 'Full name',
      email: 'Email',
      password: 'Password',
      placeholder_password: 'Minimum 6 characters',
      submit: 'Create Account',
      submitting: 'Creating account...'
    },
    gallery: {
      loading: 'Loading your gallery...',
      my_gallery: 'My Viral Image Gallery',
      all_creations: 'All your creations generated with AI',
      empty_title: 'Your gallery is empty',
      empty_desc: "You haven't generated any viral images yet. Start now!",
      generate_first: 'Generate my first image',
      download: 'Download',
      delete_confirm: 'Are you sure you want to delete this image?'
    }
  }
} as const;

export type TranslationKeys = keyof typeof translations['en'];
