import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

export enum UserRole {
  CITIZEN = 'citizen',
  ADMIN = 'admin',
  DOCTOR = 'doctor'
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private authService = inject(AuthService);

  hasRole(role: UserRole): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? roles.includes(currentUser.role as UserRole) : false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isCitizen(): boolean {
    return this.hasRole(UserRole.CITIZEN);
  }

  isDoctor(): boolean {
    return this.hasRole(UserRole.DOCTOR);
  }

  canAccessHealthAdvanced(): boolean {
    return this.hasAnyRole([UserRole.ADMIN, UserRole.DOCTOR]);
  }

  canAccessPreschoolAdvanced(): boolean {
    return this.hasAnyRole([UserRole.ADMIN]);
  }

  canAccessBasicServices(): boolean {
    return this.hasAnyRole([UserRole.CITIZEN, UserRole.ADMIN, UserRole.DOCTOR]);
  }

  canAccessAdminPanel(): boolean {
    return this.isAdmin();
  }
}
