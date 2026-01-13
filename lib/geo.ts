import { headers } from 'next/headers'

export type Currency = 'INR' | 'USD'

/**
 * Detect user's currency based on their country
 * Uses Vercel's geo headers or falls back to USD
 */
export async function detectCurrency(): Promise<Currency> {
  try {
    const headersList = await headers()

    // Vercel provides geo information via headers
    // https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country
    const country = headersList.get('x-vercel-ip-country') ||
                   headersList.get('cf-ipcountry') || // Cloudflare
                   headersList.get('x-country-code') // Generic

    // If user is from India, use INR
    if (country === 'IN') {
      return 'INR'
    }

    // Default to USD for all other countries
    return 'USD'
  } catch (error) {
    console.error('Error detecting currency:', error)
    // Default to USD on error
    return 'USD'
  }
}

/**
 * Get country code from request headers
 */
export async function getCountryCode(): Promise<string | null> {
  try {
    const headersList = await headers()
    return (
      headersList.get('x-vercel-ip-country') ||
      headersList.get('cf-ipcountry') ||
      headersList.get('x-country-code') ||
      null
    )
  } catch (error) {
    console.error('Error getting country code:', error)
    return null
  }
}

/**
 * Manual currency selection (for client-side)
 */
export function getCurrencyFromCountry(countryCode: string): Currency {
  return countryCode === 'IN' ? 'INR' : 'USD'
}
