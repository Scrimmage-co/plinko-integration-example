import { CurrencyDollarSimple } from 'phosphor-react'
import { formatPoints } from 'utils/currencyFormat'

interface WalletCardProps {
  showFormatted?: boolean
  balance: number
  secondBalance?: number
  currencyName: string
  secondCurrencyName?: string
}
export function WalletCard({
  balance,
  secondBalance,
  showFormatted,
  currencyName,
  secondCurrencyName
}: WalletCardProps) {
  const currency = showFormatted ? formatPoints(balance) : balance
  const currency2 =
    showFormatted && secondBalance ? formatPoints(secondBalance) : secondBalance
  return (
    <div className="flex cursor-pointer items-stretch">
      <div className="flex items-center gap-2 rounded-tl-md rounded-bl-md bg-background px-1 py-1 pr-4 font-bold uppercase text-white md:text-sm">
        <span className="rounded-full bg-purpleDark p-1">
          <CurrencyDollarSimple weight="bold" />
        </span>
        <div className="flex flex-col">
          <div title={String(balance)}>{currency}</div>
          {Boolean(secondCurrencyName) && (
            <span title={String(secondBalance)} className="text-green-400">
              {currency2}
            </span>
          )}
        </div>
      </div>
      <span
        title="Plinko Points"
        className="rounded-tr-md rounded-br-md bg-purpleDark p-2 font-bold text-white md:text-sm"
      >
        <div>{currencyName}</div>
        {Boolean(secondCurrencyName) && (
          <div className="text-green-900">{secondCurrencyName}</div>
        )}
      </span>
    </div>
  )
}
