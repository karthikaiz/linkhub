import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/links/:path*', '/appearance/:path*', '/analytics/:path*', '/settings/:path*'],
}
