import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from 'next-auth/react'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession()
    // For now, we'll use a simple bearer token approach
    // In production, you'd want to implement proper JWT handling
    if (session?.user?.id) {
      // This would need to be replaced with actual JWT token from the backend
      headers.set('authorization', `Bearer ${session.user.id}`)
    }
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Paper', 'Collection', 'Workspace', 'User', 'Annotation'],
  endpoints: () => ({}),
})