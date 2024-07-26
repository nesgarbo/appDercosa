import { Route } from '@angular/router';

export default [
    {
        path: 'unauthorized',
        loadComponent: () =>
            import('./unauthorized.component').then((m) => m.UnauthorizedComponent),
    },
    {
        path: 'not-found',
        loadComponent: () =>
            import('./not-found.component').then((m) => m.NotFoundComponent),
    },
    // {
    //     path: 'files',
    //     loadComponent: () =>
    //         import('./files.component').then((m) => m.FilesComponent),
    // },
    // {
    //     path: 'posts',
    //     loadComponent: () =>
    //         import('./posts.component').then((m) => m.PostsComponent),
    // },
    // {
    //     path: 'tasks',
    //     loadComponent: () =>
    //         import('./tasks.component').then((m) => m.TasksComponent),
    // },
    // {
    //     path: 'comments',
    //     loadComponent: () =>
    //         import('./comments.component').then((m) => m.CommentsComponent),
    // },
    // {
    //     path: 'search',
    //     loadComponent: () =>
    //         import('./search.component').then((m) => m.SearchComponent),
    // },
] satisfies Route[];
