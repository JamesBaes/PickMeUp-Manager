'use client'

import React, { useState, useEffect } from 'react'
import { useRestaurant } from '@/context/RestaurantContext'
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemVisibility } from './menu'
import type { MenuItem } from './menu'
import MenuList from '@/components/menu/menuList'
import MenuForm from '@/components/menu/menuForm'

type SortKey = 'name' | 'category' | 'price'
type SortDir = 'asc' | 'desc'

const SORT_LABELS: Record<SortKey, string> = { name: 'Name', category: 'Category', price: 'Price' }

const MenuPage = () => {
  const { isAdmin } = useRestaurant()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedItems = sortKey
    ? [...menuItems].sort((a, b) => {
        const cmp = sortKey === 'price' ? a.price - b.price : a[sortKey].localeCompare(b[sortKey])
        return sortDir === 'asc' ? cmp : -cmp
      })
    : menuItems

  const loadItems = async () => {
    const result = await getAllMenuItems()
    if (result.success && result.data) setMenuItems(result.data)
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleAdd = async (data: Omit<MenuItem, 'item_id' | 'created_at' | 'updated_at'>) => {
    setFormError(null)
    const result = await createMenuItem(data)
    if (result.success) {
      await loadItems()
      setShowSidebar(false)
    } else {
      setFormError(result.error ?? 'Failed to add item')
    }
  }

  const handleEdit = async (data: Omit<MenuItem, 'item_id' | 'created_at' | 'updated_at'>) => {
    if (!editingItem) return
    const result = await updateMenuItem({ item_id: editingItem.item_id, ...data })
    if (result.success && result.data) {
      setMenuItems((prev) => prev.map((i) => (i.item_id === editingItem.item_id ? result.data! : i)))
    }
    setEditingItem(null)
    setShowSidebar(false)
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    const result = await deleteMenuItem(id)
    if (result.success) {
      setMenuItems((prev) => prev.filter((i) => i.item_id !== id))
    }
    setDeletingId(null)
  }

  const handleToggleHide = async (id: number, isHidden: boolean) => {
    const result = await toggleMenuItemVisibility(id, isHidden)
    if (result.success) {
      setMenuItems((prev) => prev.map((i) => i.item_id === id ? { ...i, is_hidden: isHidden } : i))
    }
  }

  const openEdit = (item: MenuItem) => {
    setEditingItem(item)
    setShowSidebar(true)
  }

  const closeForm = () => {
    setShowSidebar(false)
    setEditingItem(null)
    setFormError(null)
  }

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Loading menu...</div>

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Menu</h1>
        {isAdmin && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
              <span className="text-xs text-gray-400 mr-1">Sort:</span>
              {(['name', 'category', 'price'] as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`text-xs px-2.5 py-1 rounded-md transition flex items-center gap-0.5 ${
                    sortKey === key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {SORT_LABELS[key]}
                  {sortKey === key && (
                    <span className="text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setEditingItem(null); setShowSidebar(true) }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Item
            </button>
          </div>
        )}
      </div>

      <MenuList
        menuItems={sortedItems}
        isAdmin={isAdmin}
        deletingId={deletingId}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleHide={handleToggleHide}
      />

      {showSidebar && (
        <MenuForm
          mode={editingItem ? 'edit' : 'add'}
          initialData={editingItem ?? undefined}
          onClose={closeForm}
          onSubmit={editingItem ? handleEdit : handleAdd}
          error={formError}
        />
      )}
    </div>
  )
}

export default MenuPage
