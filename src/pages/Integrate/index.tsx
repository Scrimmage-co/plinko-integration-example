import { httpsCallable } from '@firebase/functions'
import { functions } from 'lib/firebase'
import { useEffect, useState } from 'react'

import { useAuthStore } from '../../store/auth'

interface GenerateIntegrationInfoResponse {
  loginURL: string
  bannerURL: string
}

export function Integrate() {
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const user = useAuthStore(state => state.user)
  const [loginURL, setLoginURL] = useState<string>()
  const [widgetURL, setWidgetURL] = useState<string>()

  useEffect(() => {
    if (currentBalance) {
      httpsCallable<any, GenerateIntegrationInfoResponse>(
        functions,
        'generateIntegrationInfo'
      )({ averageEarning: currentBalance }).then(result => {
        setLoginURL(result.data.loginURL)
        setWidgetURL(result.data.bannerURL)
      })
    }
  }, [user, currentBalance])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="mx-auto flex w-1/2 flex-col items-center justify-center">
        {Boolean(loginURL) && (
          <figure>
            <a target="_blank" href={loginURL} rel="noreferrer">
              <img src={widgetURL} alt="Widget" />
            </a>
            <figcaption className="text-center text-text"></figcaption>
          </figure>
        )}
        <div className="mt-4">
          <a
            href={loginURL}
            className="rounded-md bg-purpleDark px-4 text-text hover:bg-purple"
          >
            Get reward
          </a>
          <span className="block text-center text-sm font-bold text-text"></span>
        </div>
      </div>
    </div>
  )
}
