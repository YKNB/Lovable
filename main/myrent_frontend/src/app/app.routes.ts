import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { HomePage } from './pages/home.page';
import { LoginPage } from './pages/login.page';
import { RegisterPage } from './pages/register.page';
import { PropertyDetailPage } from './pages/property-detail.page';
import { CreatePropertyPage } from './pages/create-property.page';
import { OwnerPropertiesPage } from './pages/owner-properties.page';
import { MyBookingsPage } from './pages/my-bookings.page';
import { OwnerBookingsPage } from './pages/owner-bookings.page';
import { ProfilePage } from './pages/profile.page';
import { NotFoundPage } from './pages/not-found.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'properties/:id', component: PropertyDetailPage },
  {
    path: 'owner/properties/new',
    component: CreatePropertyPage,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['OWNER', 'ADMIN'] }
  },
  {
    path: 'owner/properties/manage',
    component: OwnerPropertiesPage,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['OWNER', 'ADMIN'] }
  },
  {
    path: 'bookings/me',
    component: MyBookingsPage,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['TENANT'] }
  },
  {
    path: 'bookings/owned',
    component: OwnerBookingsPage,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['OWNER'] }
  },
  { path: 'profile', component: ProfilePage, canActivate: [authGuard] },
  { path: '**', component: NotFoundPage }
];
