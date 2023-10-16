import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseURL() {
  // if (typeof window !== 'undefined') {
  //   return '';
  // }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export const notAllowedUsername = [
  'signin',
  'signup',
  'settings',
  'api',
  'verify',
  'forgot-password',
  'reset-password',
  'privacy',
  'terms',
  'about',
  'contact',
  'logout',
  'login',
  'register',
  'me',
  'profile',
  'dashboard',
  'admin',
  'moderator',
  'mod',
  'moderators',
  'mods',
  'admins',
  'administrator',
  'administrators',
  'root',
  'roots',
  'superuser',
  'superusers',
  'super',
  'supers',
  'owner',
  'owners',
  'creator',
  'creators',
  'founder',
  'founders',
  'developer',
  'developers',
];
