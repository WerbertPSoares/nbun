'use client'

import { useSnapshot } from 'valtio'

import { authState } from '~/store/auth.state'

const Home = () => {
  const { session: data } = useSnapshot(authState)

  return (
    <div className="flex h-screen w-screen flex-col items-start justify-start p-2">
      <div className="flex w-full items-center justify-start gap-2">
        {JSON.stringify(data)}
      </div>
    </div>
  )
}

export default Home
