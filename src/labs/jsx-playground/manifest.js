export default {
  id: 'jsx-playground',
  moduleId: 'jsx',
  title: { en: 'JSX Playground', es: 'Playground JSX' },
  intro: {
    en: 'A live JSX editor with instant preview: tweak the code or the injected variables and watch React respond.',
    es: 'Un editor JSX en vivo con vista previa instantánea: cambia el código o las variables inyectadas y mira cómo responde React.',
  },
  difficulty: 'beginner',
  order: 2,
  load: () => import('./Lab.jsx'),
}
