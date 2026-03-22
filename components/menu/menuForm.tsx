'use client'

import React, { useState, useEffect } from 'react'
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
}

const MenuForm: React.FC<MenuFormProps> = ({ mode, initialData, onClose, onSubmit, error }) => {
  const [form, setForm] = useState<FormData>(
    initialData
      ? {
          name: initialData.name,
          price: initialData.price,
          description: initialData.description,
          category: initialData.category,
          calories: initialData.calories,
          allergy_information: initialData.allergy_information,
        }
      : empty
  )
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm(
      initialData
        ? {
            name: initialData.name,
            price: initialData.price,
            description: initialData.description,
            category: initialData.category,
            calories: initialData.calories,
            allergy_information: initialData.allergy_information,
          }
        : empty
    )
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit({
      ...form,
      price: parseFloat(String(form.price)),
      calories: parseInt(String(form.calories)),
    })
    setSubmitting(false)
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{mode === 'edit' ? 'Edit Item' : 'Add Menu Item'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto p-6 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Calories</label>
              <input
                type="number"
                name="calories"
                value={form.calories}
                onChange={handleChange}
                min="0"
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
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
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Allergy Information</label>
            <textarea
              name="allergy_information"
              value={form.allergy_information}
              onChange={handleChange}
              rows={2}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="mt-auto flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
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
