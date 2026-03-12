import pako from 'pako'
import type { MealPlan } from '../types'

// Max data chars a QR code can hold at error correction level M (~moderate scan reliability)
const QR_CHAR_LIMIT = 2000

export function encodePlan(plan: MealPlan): string {
  const json = JSON.stringify(plan)
  const compressed = pako.deflate(json)
  // Convert Uint8Array → binary string → base64url (URL-safe, no padding)
  let binary = ''
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function decodePlan(encoded: string): MealPlan {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const json = pako.inflate(bytes, { to: 'string' })
  return JSON.parse(json) as MealPlan
}

export function buildShareUrl(plan: MealPlan): string {
  const encoded = encodePlan(plan)
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}#plan=${encoded}`
}

export function checkShareUrlFitsQR(plan: MealPlan): boolean {
  return buildShareUrl(plan).length <= QR_CHAR_LIMIT
}

/** Read plan from URL hash if present. Returns null if no plan in hash. */
export function readPlanFromHash(): MealPlan | null {
  const hash = window.location.hash
  const match = hash.match(/^#plan=(.+)$/)
  if (!match) return null
  try {
    return decodePlan(match[1])
  } catch {
    return null
  }
}

export function clearPlanHash(): void {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}
