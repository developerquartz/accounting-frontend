import { NextResponse, NextRequest } from 'next/server';
import { kmAggarwalId } from './app/constant';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login';
  const token = request.cookies.get('token')?.value || '';
  const role = request.cookies.get('role')?.value || '';
  const clientId = request.cookies.get('clientId')?.value || '';
  const orgId = request.cookies.get('OrgId')?.value || '';

  const rolePermissions: { [key: string]: string[] } = {
    '1': [
      '/',
      '/bills',
      '/login',
      '/register',
      '/user',
      '/client',
      '/upload',

      '/client/add-update',

      '/user/add-update',

      '/vault',

      '/vault/upload',
      '/login',
      '/doctypes',
    ], //for manager
    '2': ['/', '/bills', '/upload', '/bills', '/vault', '/login'], //for accountant
    '4': ['/', '/upload', '/login'], // for scanner
    '3': ['/', '/vault', '/vault', '/login'], //for client
    '10': ['/', '/firm', '/firm/add-update', '/login'],
  };

  if (token) {
    if (isPublicPath) {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    if ((path === '/bills' || path === '/upload') && orgId !== kmAggarwalId) {
      return new Response("You don't have access to this page", {
        status: 401,
      });
    }
    if (!rolePermissions[role]?.includes(path)) {
      return new Response('You dont have access to this page', { status: 401 });
    }
  } else {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
  }
}

export const config = {
  matcher: [
    '/login',
    '/',
    // "/bills/:path*",
    // "/user/:path*",
    // "/client/:path*",
    // "/vault/:path*",
    '/bills',
    '/client',
    '/vault',
    '/user',
    '/upload',
    '/doctypes',
    '/firm',
    // "/admin",
    // "/admin/add-update",
  ],
};
