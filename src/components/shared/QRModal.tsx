import { useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, AlertTriangle, Smartphone } from 'lucide-react'

interface QRModalProps {
  url: string
  planName: string
  fits: boolean
  onClose: () => void
}

export function QRModal({ url, planName, fits, onClose }: QRModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-800">Share Meal Plan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors rounded-md hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Scan this QR code on another device to load{' '}
          <span className="font-medium text-gray-700">{planName}</span>.
        </p>

        {fits ? (
          <>
            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <QRCodeSVG
                  value={url}
                  size={220}
                  level="M"
                  marginSize={1}
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Opens KitchenSync and imports the plan automatically.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={22} className="text-amber-500" />
            </div>
            <p className="text-sm text-gray-700 text-center">
              This meal plan is too large to fit in a QR code. Use{' '}
              <strong>Export Recipe</strong> to save the file and transfer it manually.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
