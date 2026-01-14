'use client'

import { useState } from 'react'
import { Heart, Coffee, IndianRupee, Copy, Check, QrCode } from 'lucide-react'

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
  const [showQR, setShowQR] = useState(false)

  const amount = selectedAmount || (customAmount ? parseInt(customAmount) : 0)

  // Generate UPI payment URL
  const getUpiUrl = () => {
    const params = new URLSearchParams({
      pa: upiId,
      pn: userName,
      cu: 'INR',
      am: amount.toString(),
      tn: `Tip for ${userName}`,
    })
    return `upi://pay?${params.toString()}`
  }

  // Generate UPI QR code URL (using a free QR service)
  const getQrUrl = () => {
    const upiUrl = getUpiUrl()
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`
  }

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handlePayment = () => {
    if (amount > 0) {
      window.location.href = getUpiUrl()
    }
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

      {/* Payment buttons */}
      <div className="flex gap-2">
        <button
          onClick={handlePayment}
          disabled={amount <= 0}
          className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            backgroundColor: buttonColor,
            color: textColor,
          }}
        >
          <Heart className="w-5 h-5" />
          {amount > 0 ? `Pay ₹${amount}` : 'Select Amount'}
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className="py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: `${buttonColor}20`,
            color: profileTextColor,
          }}
          title="Show QR Code"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      {/* QR Code */}
      {showQR && amount > 0 && (
        <div className="mt-4 flex flex-col items-center">
          <div className="bg-white p-3 rounded-xl">
            <img src={getQrUrl()} alt="UPI QR Code" className="w-40 h-40" />
          </div>
          <p className="text-xs mt-2 opacity-70" style={{ color: profileTextColor }}>
            Scan with any UPI app
          </p>
        </div>
      )}

      {/* UPI ID */}
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
    </div>
  )
}
