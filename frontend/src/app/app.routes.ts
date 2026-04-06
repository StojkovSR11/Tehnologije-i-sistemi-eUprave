import { Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { RoleGuard } from "./guards/role.guard";



export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/auth/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/auth/register/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "unauthorized",
    loadComponent: () =>
      import("./pages/unauthorized/unauthorized.component").then((m) => m.UnauthorizedComponent),
  },
  // Protected routes - require authentication
  {
    path: "zdravstvo",
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['citizen', 'doctor', 'admin'] },
    loadComponent: () =>
      import("./pages/zdravstvo/zdravstvo.component").then(
        (m) => m.ZdravstvoComponent
      ),
  },
  {
    path: "zdravstvo/admin",
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['doctor', 'admin'] },
    loadComponent: () =>
      import("./pages/zdravstvo/zdravstvo-admin.component").then(
        (m) => m.ZdravstvoAdminComponent
      ),
  },
  {
    path: "predskolske",
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['citizen', 'admin'] },
    loadComponent: () =>
      import("./pages/predskolske/predskolske.component").then(
        (m) => m.PredskolskeComponent
      ),
  },

//za grupe?
{
  path: "predskolske/grupe",
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['citizen', 'admin'] },
  loadComponent: () =>
    import('./pages/predskolske/grupa/grupa.component').then(
      (m) => m.GrupeComponent
    ),
},


  {
    path: "predskolske/admin",
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import("./pages/predskolske/predskolske-admin.component").then(
        (m) => m.PredskolskeAdminComponent
      ),
  },
  // Admin only routes
  {
    path: "admin",
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import("./pages/admin/admin.component").then((m) => m.AdminComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
