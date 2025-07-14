export type Language = 'es' | 'en';

export const translations = {
  es: {
    common: {
      loading: 'Cargando...'
    },
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
      submitting: 'Iniciando sesión...',
      success: '¡Bienvenido de vuelta!',
      error: 'Error al iniciar sesión'
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
      submitting: 'Creando cuenta...',
      success: '¡Cuenta creada exitosamente! Ya puedes generar imágenes.',
      error: 'Error al crear la cuenta',
      terms_prefix: 'Al registrarte, aceptas nuestros',
      terms: 'términos de servicio',
      privacy: 'política de privacidad',
      free_credits: '🎉 ¡Obtén 3 créditos gratis para empezar a generar imágenes virales!'
    },
    gallery: {
      loading: 'Cargando tu galería...',
      my_gallery: 'Mi Galería de Imágenes Virales',
      all_creations: 'Todas tus creaciones generadas con IA',
      empty_title: 'Tu galería está vacía',
      empty_desc: 'Aún no has generado ninguna imagen viral. ¡Empieza ahora!',
      generate_first: 'Generar mi primera imagen',
      download: 'Descargar',
      share_facebook: 'Compartir en Facebook',
      share_instagram: 'Compartir en Instagram',
      share_x: 'Compartir en X',
      delete_confirm: '¿Estás seguro de que quieres eliminar esta imagen?'
    },
    generate: {
      title: 'Generar Imagen Viral',
      subtitle: 'Sigue estos pasos para crear tu imagen viral',
      step_template: '1. Plantilla',
      step_upload: '2. Subir Imagen',
      step_generate: '3. Generar',
      step_result: '4. Resultado',
      select_template: 'Selecciona una plantilla',
      upload_image: 'Sube tu imagen',
      change_template: 'Cambiar plantilla',
      selected_template: 'Plantilla seleccionada',
      drag_here: 'Suelta la imagen aquí',
      drag_prompt: 'Arrastra una imagen o haz clic para seleccionar',
      formats: 'Formatos soportados: JPG, PNG, WEBP',
      image_uploaded: 'Imagen subida',
      no_credits: 'Sin créditos suficientes',
      generate_button: 'Generar Imagen Viral (1 crédito)',
      generating: 'Generando tu imagen viral...',
      generating_desc: 'Estamos aplicando la magia de la IA. Esto tomará unos segundos.',
      result_title: '¡Tu imagen viral está lista!',
      result_desc: 'Desliza para ver la comparación antes/después',
      download: 'Descargar Imagen',
      generate_another: 'Generar Otra',
      error_loading_templates: 'Error al cargar las plantillas',
      insufficient_credits: 'No tienes suficientes créditos para generar una imagen',
      success: '¡Imagen generada exitosamente!',
      error_generating: 'Error al generar la imagen'
    }
  },
  en: {
    common: {
      loading: 'Loading...'
    },
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
      submitting: 'Logging in...',
      success: 'Welcome back!',
      error: 'Login failed'
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
      submitting: 'Creating account...',
      success: 'Account created successfully! You can now generate images.',
      error: 'Failed to create account',
      terms_prefix: 'By signing up, you agree to our',
      terms: 'terms of service',
      privacy: 'privacy policy',
      free_credits: '🎉 Get 3 free credits to start generating viral images!'
    },
    gallery: {
      loading: 'Loading your gallery...',
      my_gallery: 'My Viral Image Gallery',
      all_creations: 'All your creations generated with AI',
      empty_title: 'Your gallery is empty',
      empty_desc: "You haven't generated any viral images yet. Start now!",
      generate_first: 'Generate my first image',
      download: 'Download',
      share_facebook: 'Share on Facebook',
      share_instagram: 'Share on Instagram',
      share_x: 'Share on X',
      delete_confirm: 'Are you sure you want to delete this image?'
    },
    generate: {
      title: 'Generate Viral Image',
      subtitle: 'Follow these steps to create your viral image',
      step_template: '1. Template',
      step_upload: '2. Upload Image',
      step_generate: '3. Generate',
      step_result: '4. Result',
      select_template: 'Select a template',
      upload_image: 'Upload your image',
      change_template: 'Change template',
      selected_template: 'Selected template',
      drag_here: 'Drop the image here',
      drag_prompt: 'Drag an image or click to select',
      formats: 'Supported formats: JPG, PNG, WEBP',
      image_uploaded: 'Image uploaded',
      no_credits: 'Insufficient credits',
      generate_button: 'Generate Viral Image (1 credit)',
      generating: 'Generating your viral image...',
      generating_desc: 'Applying AI magic. This will take a few seconds.',
      result_title: 'Your viral image is ready!',
      result_desc: 'Drag to compare before/after',
      download: 'Download Image',
      generate_another: 'Generate Another',
      error_loading_templates: 'Error loading templates',
      insufficient_credits: 'You do not have enough credits to generate an image',
      success: 'Image generated successfully!',
      error_generating: 'Error generating image'
    }
  }
} as const;

export type TranslationKeys = keyof typeof translations['en'];
