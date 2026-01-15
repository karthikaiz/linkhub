'use client'

import { useState } from 'react'
import { Heart, Coffee, IndianRupee, Copy, Check, QrCode, Smartphone } from 'lucide-react'

interface TipJarProps {
  upiId: string
  userName: string
  title?: string
  description?: string
  buttonColor: string
  textColor: string
  profileTextColor: string
  isGlass?: boolean
}

const TIP_AMOUNTS = [49, 99, 199, 499]

export function TipJar({
  upiId,
  userName,
  title = 'Support My Work',
  description = 'Buy me a coffee!',
  buttonColor,
  textColor,
  profileTextColor,
  isGlass = false,
}: TipJarProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [copied, setCopied] = useState(false)
  const [showApps, setShowApps] = useState(false)
  const [tipSent, setTipSent] = useState(false)

  const amount = selectedAmount || (customAmount ? parseInt(customAmount) : 0)

  // Generate UPI payment URL
  const getUpiUrl = () => {
    const pa = encodeURIComponent(upiId)
    const pn = encodeURIComponent(userName.replace(/[^a-zA-Z0-9 ]/g, ''))
    const tn = encodeURIComponent(`Tip for ${userName}`)
    const am = amount.toString()
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`
  }

  // Generate UPI QR code URL
  const getQrUrl = () => {
    const upiUrl = getUpiUrl()
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`
  }

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(`${upiId}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyPaymentDetails = async () => {
    try {
      const details = `UPI ID: ${upiId}\nAmount: ₹${amount}\nNote: Tip for ${userName}`
      await navigator.clipboard.writeText(details)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Show thank you screen after tip is sent
  if (tipSent) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          backgroundColor: isGlass ? 'rgba(255,255,255,0.1)' : `${buttonColor}10`,
          backdropFilter: isGlass ? 'blur(10px)' : 'none',
          border: isGlass ? '1px solid rgba(255,255,255,0.2)' : 'none',
        }}
      >
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-bounce"
          style={{ backgroundColor: buttonColor }}
        >
          <Heart className="w-8 h-8" style={{ color: textColor }} fill="currentColor" />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: profileTextColor }}>
          Thank You! 🎉
        </h3>
        <p className="opacity-80 mb-4" style={{ color: profileTextColor }}>
          Your support means the world to {userName}!
        </p>
        <button
          onClick={() => {
            setTipSent(false)
            setSelectedAmount(null)
            setCustomAmount('')
          }}
          className="text-sm underline opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: profileTextColor }}
        >
          Send another tip
        </button>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: isGlass ? 'rgba(255,255,255,0.1)' : `${buttonColor}10`,
        backdropFilter: isGlass ? 'blur(10px)' : 'none',
        border: isGlass ? '1px solid rgba(255,255,255,0.2)' : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${buttonColor}20` }}
        >
          <Coffee className="w-5 h-5" style={{ color: buttonColor }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: profileTextColor }}>
            {title}
          </h3>
          <p className="text-sm opacity-70" style={{ color: profileTextColor }}>
            {description}
          </p>
        </div>
      </div>

      {/* Preset amounts */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {TIP_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => {
              setSelectedAmount(amt)
              setCustomAmount('')
            }}
            className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              selectedAmount === amt ? 'scale-105' : 'hover:scale-102'
            }`}
            style={{
              backgroundColor: selectedAmount === amt ? buttonColor : `${buttonColor}20`,
              color: selectedAmount === amt ? textColor : profileTextColor,
            }}
          >
            ₹{amt}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative mb-4">
        <IndianRupee
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: profileTextColor, opacity: 0.5 }}
        />
        <input
          type="number"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value)
            setSelectedAmount(null)
          }}
          placeholder="Custom amount"
          className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: isGlass ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)',
            color: isGlass ? profileTextColor : '#000',
            border: isGlass ? '1px solid rgba(255,255,255,0.2)' : 'none',
          }}
        />
      </div>

      {/* QR Code - Always visible when amount selected */}
      {amount > 0 && (
        <div className="flex flex-col items-center mb-4">
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <img src={getQrUrl()} alt="UPI QR Code" className="w-44 h-44" />
          </div>
          <p className="text-sm mt-3 font-medium" style={{ color: profileTextColor }}>
            Scan with any UPI app to pay ₹{amount}
          </p>
          <p className="text-xs mt-1 opacity-60" style={{ color: profileTextColor }}>
            GPay • PhonePe • Paytm • BHIM • Any UPI app
          </p>

          {/* Confirmation button */}
          <button
            onClick={() => setTipSent(true)}
            className="mt-4 py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            style={{
              backgroundColor: buttonColor,
              color: textColor,
            }}
          >
            <Heart className="w-5 h-5" />
            I've Sent the Tip!
          </button>
        </div>
      )}

      {/* Manual payment option */}
      {amount > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowApps(!showApps)}
            className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            style={{
              backgroundColor: `${buttonColor}20`,
              color: profileTextColor,
            }}
          >
            <Smartphone className="w-5 h-5" />
            {showApps ? 'Hide Manual Steps' : 'Pay Manually'}
          </button>

          {showApps && (
            <div
              className="p-4 rounded-xl text-sm space-y-3"
              style={{
                backgroundColor: isGlass ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <p className="font-medium" style={{ color: profileTextColor }}>
                Steps to pay manually:
              </p>
              <ol className="list-decimal list-inside space-y-2 opacity-80" style={{ color: profileTextColor }}>
                <li>Open your UPI app (GPay, PhonePe, Paytm)</li>
                <li>Select &quot;Pay by UPI ID&quot; or &quot;Send Money&quot;</li>
                <li>Enter UPI ID: <span className="font-mono font-semibold">{upiId}</span></li>
                <li>Enter amount: <span className="font-semibold">₹{amount}</span></li>
                <li>Add note: Tip for {userName}</li>
                <li>Complete the payment</li>
              </ol>
              <button
                onClick={copyPaymentDetails}
                className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{
                  backgroundColor: buttonColor,
                  color: textColor,
                }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Payment Details'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* UPI ID display */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-xs opacity-50" style={{ color: profileTextColor }}>
          UPI: {upiId}
        </span>
        <button
          onClick={copyUpiId}
          className="p-1 rounded hover:bg-black/10 transition-colors"
          title="Copy UPI ID"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3" style={{ color: profileTextColor, opacity: 0.5 }} />
          )}
        </button>
      </div>

      {/* No amount selected message */}
      {amount <= 0 && (
        <p className="text-center text-sm opacity-60 mt-2" style={{ color: profileTextColor }}>
          Select an amount above to see payment QR code
        </p>
      )}
    </div>
  )
}
