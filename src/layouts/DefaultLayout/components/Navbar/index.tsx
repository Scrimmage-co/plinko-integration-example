import { httpsCallable } from '@firebase/functions'
import plinkoLogo from '@images/scrimmageLogo.png'
import classNames from 'classnames'
import { Gift, SignOut } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from 'store/auth'
import { useGameStore } from 'store/game'

import { functions } from '../../../../lib/firebase'
import { WalletCard } from '../WalletCard'

export function Navbar() {
  const inGameBallsCount = useGameStore(state => state.gamesRunning)
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const isAuth = useAuthStore(state => state.isAuth)
  const signOut = useAuthStore(state => state.signOut)
  const [scrimBalance, setScrimBalance] = useState(0)
  const [isScrimmageLinked, setScrimmageLinkStatus] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await httpsCallable<
        never,
        { isLinked: boolean; profile: any }
      >(functions, 'getUserInfo')()
      console.log(userInfo)
      setScrimmageLinkStatus(userInfo.data.isLinked)
      if (userInfo.data.isLinked) {
        setScrimBalance(userInfo.data.profile.tokens)
      }
    }
    fetchData().then()
  }, [])

  async function handleSignOut() {
    await signOut()
  }

  return (
    <nav className="sticky top-0 z-50 bg-primary px-4 shadow-lg">
      <div
        className={classNames(
          'mx-auto flex h-16 w-full max-w-[1400px] items-center',
          {
            'justify-between': isAuth,
            'justify-center': !isAuth
          }
        )}
      >
        <Link to={inGameBallsCount ? '#!' : '/'}>
          <img
            src={plinkoLogo}
            alt=""
            className="w-16 object-contain md:w-16"
          />
        </Link>
        {isAuth && (
          <div className="flex items-stretch gap-4">
            {currentBalance < 10 && (
              <Link
                replace
                to={inGameBallsCount ? '#!' : '/gifts'}
                title="Gift"
                className="animate-bounce text-text transition-colors hover:text-purple "
              >
                <Gift size="32" weight="fill" />
              </Link>
            )}
            <WalletCard
              balance={currentBalance}
              showFormatted
              currencyName="Game Tokens"
              secondBalance={scrimBalance}
              secondCurrencyName={isScrimmageLinked ? '$SCRIM' : undefined}
            />
            <button
              title="Sair"
              onClick={handleSignOut}
              className="rounded-md bg-purpleDark px-4 text-text hover:bg-purple"
            >
              <SignOut weight="bold" />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
