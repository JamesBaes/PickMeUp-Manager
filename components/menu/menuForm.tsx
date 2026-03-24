'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { MenuItem } from '@/app/(dashboard)/admin/menu/menu'

type FormData = Omit<MenuItem, 'item_id' | 'created_at' | 'updated_at'>

interface MenuFormProps {
  mode: 'add' | 'edit'
  initialData?: MenuItem
  onClose: () => void
  onSubmit: (data: FormData) => Promise<void>
  error?: string | null
}

const CATEGORIES = [
  'beef_burgers',
  'chicken_burgers',
  'steak_sandwiches',
  'burgers',
  'combos',
  'crowds_sides',
  'extra_armour_sides',
  'treats',
  'milkshakes',
  'juice',
  'soda_and_water',
  'beverages',
]

const empty: FormData = {
  name: '',
  price: 0,
  description: '',
  category: '',
  calories: 0,
  allergy_information: '',
  image_url: '',
}

const toFormData = (item: MenuItem): FormData => ({
  name: item.name,
  price: item.price,
  description: item.description ?? '',
  category: item.category,
  calories: item.calories,
  allergy_information: item.allergy_information ?? '',
  image_url: item.image_url ?? '',
})

const MenuForm: React.FC<MenuFormProps> = ({ mode, initialData, onClose, onSubmit, error }) => {
  const [form, setForm] = useState<FormData>(initialData ? toFormData(initialData) : empty)
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url ?? '')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setForm(initialData ? toFormData(initialData) : empty)
    setImageFile(null)
    setImagePreview(initialData?.image_url ?? '')
    setUploadError(null)
  }, [initialData])

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/avif', 'image/webp']
  const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Invalid file type. Accepted: JPEG, PNG, AVIF, WEBP.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setUploadError('Image must be 5 MB or smaller.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setUploadError(null)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setForm((prev) => ({ ...prev, image_url: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1')
    setForm((prev) => ({ ...prev, price: filtered as unknown as number }))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setUploadError(null)

    let image_url = form.image_url ?? ''

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `menu-items/${crypto.randomUUID()}_${Date.now()}.${ext}`
      console.log('[Upload] Starting upload:', { path, size: imageFile.size, type: imageFile.type })
      const uploadStart = Date.now()

      const fd = new FormData()
      fd.append('file', imageFile)
      fd.append('path', path)

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()

      console.log(`[Upload] Finished in ${Date.now() - uploadStart}ms`, json)

      if (!res.ok) {
        console.error('[Upload] Full error:', json)
        setUploadError('Image upload failed: ' + json.error)
        setSubmitting(false)
        return
      }

      image_url = json.publicUrl
    }
    await onSubmit({
      ...form,
      price: parseFloat(String(form.price)),
      calories: parseInt(String(form.calories)),
      image_url,
      description: form.description?.trim() || null,
      allergy_information: form.allergy_information?.trim() || null,
    })
    setSubmitting(false)
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Green accent bar matching sidebar */}
        <div className="h-1 w-full bg-green-500" />

        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{mode === 'edit' ? 'Edit Item' : 'Add Menu Item'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{mode === 'edit' ? 'Update the details below' : 'Fill in the details to add a new item'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto px-8 py-6 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Classic Beef Burger"
              maxLength={30}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Price ($)</label>
              <input
                type="text"
                name="price"
                value={form.price}
                onChange={handlePriceChange}
                maxLength={6}
                inputMode="decimal"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Calories</label>
              <input
                type="text"
                name="calories"
                value={form.calories}
                onChange={handleChange}
                maxLength={15}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white transition"
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description ?? ''}
              onChange={handleChange}
              rows={3}
              maxLength={400}
              placeholder="Briefly describe the item..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none transition"
            />
            <p className={`text-xs text-right mt-1 ${(form.description ?? '').length >= 400 ? 'text-red-500' : 'text-gray-400'}`}>
              {(form.description ?? '').length}/400
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Allergy Information</label>
            <textarea
              name="allergy_information"
              value={form.allergy_information ?? ''}
              onChange={handleChange}
              rows={2}
              maxLength={400}
              placeholder="e.g. Contains gluten, dairy..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none transition"
            />
            <p className={`text-xs text-right mt-1 ${(form.allergy_information ?? '').length >= 400 ? 'text-red-500' : 'text-gray-400'}`}>
              {(form.allergy_information ?? '').length}/400
            </p>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Item Image</label>
            {imagePreview ? (
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 mb-2">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white border border-gray-200 text-gray-500 hover:text-red-500 rounded-full p-1 shadow transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1 w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition"
              >
                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24">
                  <path d="M4 16l4-4 4 4 4-6 4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="text-xs text-gray-400">Click to upload image</span>
                <span className="text-xs text-gray-300">JPEG, PNG, AVIF, WEBP — max 5 MB</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.avif,.webp"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
          )}

          <div className="mt-auto flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-sm font-semibold text-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </>
  )
}

export default MenuForm
