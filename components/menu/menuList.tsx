import React from 'react'
import type { MenuItem } from '@/app/(dashboard)/admin/menu/menu'

const formatLabel = (str: string) =>
  str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

interface MenuListProps {
  menuItems: MenuItem[]
  isAdmin: boolean
  deletingId: number | null
  onEdit: (item: MenuItem) => void
  onDelete: (id: number) => void
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const MenuList: React.FC<MenuListProps> = ({ menuItems, isAdmin, deletingId, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100">
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
              <td colSpan={isAdmin ? 6 : 5} className="py-12 text-center text-sm text-gray-400">
                No menu items yet
              </td>
            </tr>
          ) : (
            menuItems.map((item) => (
              <tr key={item.item_id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                <td className="py-4 px-4 md:px-6">
                  <div>
                    <p className="text-sm font-semibold">{formatLabel(item.name)}</p>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5 max-w-xs">{item.description}</p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 md:px-6">
                  <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full whitespace-nowrap">
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
                        onClick={() => onDelete(item.item_id)}
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
  )
}

export default MenuList
