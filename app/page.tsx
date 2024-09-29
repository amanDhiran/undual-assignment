import Main  from "@/components/Main";
import { Suspense } from 'react'

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <Suspense>
      <Main/>
      </Suspense>
    </main>
  )
}