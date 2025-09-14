import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "zdravstvo",
    loadComponent: () =>
      import("./pages/zdravstvo/zdravstvo.component").then(
        (m) => m.ZdravstvoComponent
      ),
  },
  {
    path: "predskolske",
    loadComponent: () =>
      import("./pages/predskolske/predskolske.component").then(
        (m) => m.PredskolskeComponent
      ),
  },
  {
    path: "auth",
    loadComponent: () =>
      import("./pages/auth/auth.component").then((m) => m.AuthComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
