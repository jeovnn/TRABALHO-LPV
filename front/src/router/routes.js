const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/livros' },
      { path: 'livros', component: () => import('@/pages/LivrosPage.vue') },
      { path: 'autores', component: () => import('@/pages/AutoresPage.vue') },
      { path: 'usuarios', component: () => import('@/pages/UsuariosPage.vue') },
      { path: 'emprestimos', component: () => import('@/pages/EmprestimosPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes
