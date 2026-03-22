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
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Price ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Calories</label>
              <input
                type="number"
                name="calories"
                value={form.calories}
                onChange={handleChange}
                min="0"
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
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Briefly describe the item..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">Allergy Information</label>
            <textarea
              name="allergy_information"
              value={form.allergy_information}
              onChange={handleChange}
              rows={2}
              required
              placeholder="e.g. Contains gluten, dairy..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none transition"
            />
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
