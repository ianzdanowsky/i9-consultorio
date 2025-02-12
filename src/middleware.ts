import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
// import { auth } from './server/auth/index'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const cookie = request.cookies.get('authjs.session-token')
    console.log(cookie)
    if (!cookie) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
}
// export default auth((req: NextRequest) => {
//     return NextResponse.redirect(new URL('/pesquisa', NextRequest.url))
//   })

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/assistant', '/pesquisa', '/'],
}