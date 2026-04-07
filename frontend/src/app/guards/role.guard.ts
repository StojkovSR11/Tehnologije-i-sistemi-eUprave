import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  /*canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(currentUser.role)) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }*/

    canActivate(route: ActivatedRouteSnapshot): boolean {
  const currentUser = this.authService.getCurrentUser();

  // 👉 DODAJ OVO
  console.log("USER:", currentUser);
  console.log("ROLE:", currentUser?.role);

  if (!currentUser) {
    this.router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as Array<string>;

  // 👉 I OVO
  console.log("REQUIRED ROLES:", requiredRoles);

  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(currentUser.role)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }

  return true;
}

  
}
