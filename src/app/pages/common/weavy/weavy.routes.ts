import { Route } from '@angular/router';

export default [
    {
        path: 'chat', // WARNING, put before :id path
        loadComponent: () =>
            import('./chat.component').then((m) => m.ChatComponent),
    },
    {
        path: 'files',
        loadComponent: () =>
            import('./files.component').then((m) => m.FilesComponent),
    },
    {
        path: 'posts',
        loadComponent: () =>
            import('./posts.component').then((m) => m.PostsComponent),
    },
    {
        path: 'tasks',
        loadComponent: () =>
            import('./tasks.component').then((m) => m.TasksComponent),
    },
    {
        path: 'comments',
        loadComponent: () =>
            import('./comments.component').then((m) => m.CommentsComponent),
    },
    {
        path: 'search',
        loadComponent: () =>
            import('./search.component').then((m) => m.SearchComponent),
    },
] satisfies Route[];
