import React, { useState } from 'react'
import Image from 'next/image'
import type { MenuItem } from '@/app/(dashboard)/admin/menu/menu'

const formatLabel = (str: string) =>
  str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

const CATEGORY_COLORS: Record<string, string> = {
  beef_burgers:        'bg-red-100 text-red-700',
  chicken_burgers:     'bg-orange-100 text-orange-700',
  steak_sandwiches:    'bg-amber-100 text-amber-700',
  burgers:             'bg-yellow-100 text-yellow-700',
  combos:              'bg-lime-100 text-lime-700',
  crowds_sides:        'bg-green-100 text-green-700',
  extra_armour_sides:  'bg-teal-100 text-teal-700',
  treats:              'bg-pink-100 text-pink-700',
  milkshakes:          'bg-purple-100 text-purple-700',
  juice:               'bg-cyan-100 text-cyan-700',
  soda_and_water:      'bg-sky-100 text-sky-700',
  beverages:           'bg-blue-100 text-blue-700',
}

const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-600'

interface MenuListProps {
  menuItems: MenuItem[]
  isAdmin: boolean
  deletingId: number | null
  onEdit: (item: MenuItem) => void
  onDelete: (id: number) => void
  onToggleHide: (id: number, isHidden: boolean) => void
}


const MenuList: React.FC<MenuListProps> = ({ menuItems, isAdmin, deletingId, onEdit, onDelete, onToggleHide }) => {
  const [confirmItem, setConfirmItem] = useState<MenuItem | null>(null)

  const handleDeleteClick = (item: MenuItem) => setConfirmItem(item)

  const handleConfirm = () => {
    if (confirmItem) {
      onDelete(confirmItem.item_id)
      setConfirmItem(null)
    }
  }

  return (
    <>
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full table-fixed">
        <colgroup>
          <col className="w-20" />
          <col className="w-44" />
          <col className="w-44" />
          <col className="w-24" />
          <col className="w-28" />
          <col />
          {isAdmin && <col className="w-44" />}
        </colgroup>
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Image</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Name</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Category</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Price</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Calories</th>
            <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Allergy Info</th>
            {isAdmin && <th />}
          </tr>
        </thead>
        <tbody>
          {menuItems.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-sm text-gray-400">
                No menu items yet
              </td>
            </tr>
          ) : (
            menuItems.map((item) => (
              <tr key={item.item_id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                <td className="py-4 px-4 md:px-6">
                  {item.image_url ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24">
                        <path d="M4 16l4-4 4 4 4-6 4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 md:px-6 text-sm font-semibold">
                  {formatLabel(item.name)}
                </td>
                <td className="py-4 px-4 md:px-6">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap w-36 text-center ${getCategoryColor(item.category)}`}>
                    {formatLabel(item.category)}
                  </span>
                </td>
                <td className="py-4 px-4 md:px-6 text-sm text-gray-700 font-medium whitespace-nowrap">
                  ${item.price.toFixed(2)}
                </td>
                <td className="py-4 px-4 md:px-6 text-sm text-gray-600 whitespace-nowrap">
                  {item.calories ? `${item.calories} kcal` : '—'}
                </td>
                <td className="py-4 px-4 md:px-6 text-sm text-gray-500 max-w-xs">
                  {item.allergy_information || <span className="text-gray-300">None</span>}
                </td>
                {isAdmin && (
                  <td className="py-4 px-4 md:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-50 active:scale-95 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onToggleHide(item.item_id, !item.is_hidden)}
                        className={`text-xs border px-3 py-1.5 rounded-md active:scale-95 transition ${
                          item.is_hidden
                            ? 'border-amber-500 text-amber-600 hover:bg-amber-50'
                            : 'border-gray-400 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {item.is_hidden ? 'Show' : 'Hide'}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        disabled={deletingId === item.item_id}
                        className="text-xs border border-red-500 text-red-500 px-3 py-1.5 rounded-md hover:bg-red-50 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === item.item_id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

      {confirmItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-xl rounded-xl px-5 py-4 flex flex-col gap-3 w-full max-w-sm animate-slide-up">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{formatLabel(confirmItem.name)}</span>{' '}
            from your menu?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setConfirmItem(null)}
              className="text-xs border border-gray-300 text-gray-600 px-4 py-1.5 rounded-md hover:bg-gray-50 transition"
            >
              No
            </button>
            <button
              onClick={handleConfirm}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md transition"
            >
              Yes, delete
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.2s ease-out; }
      `}</style>
    </>
  )
}

export default MenuList
