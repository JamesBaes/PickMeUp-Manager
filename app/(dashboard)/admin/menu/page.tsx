'use client'

import React, { useState, useEffect } from 'react'
import { useRestaurant } from '@/context/RestaurantContext'
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from './menu'
import type { MenuItem } from './menu'
import MenuList from '@/components/menu/menuList'
import MenuForm from '@/components/menu/menuForm'

const MenuPage = () => {
  const { isAdmin } = useRestaurant()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadItems = async () => {
    const result = await getAllMenuItems()
    if (result.success && result.data) setMenuItems(result.data)
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleAdd = async (data: Omit<MenuItem, 'item_id' | 'created_at' | 'updated_at'>) => {
    const result = await createMenuItem(data)
    if (result.success) await loadItems()
    setShowSidebar(false)
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

  const openEdit = (item: MenuItem) => {
    setEditingItem(item)
    setShowSidebar(true)
  }

  const closeForm = () => {
    setShowSidebar(false)
    setEditingItem(null)
  }

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Loading menu...</div>

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Menu</h1>
        {isAdmin && (
          <button
            onClick={() => { setEditingItem(null); setShowSidebar(true) }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Item
          </button>
        )}
      </div>

      <MenuList
        menuItems={menuItems}
        isAdmin={isAdmin}
        deletingId={deletingId}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {showSidebar && (
        <MenuForm
          mode={editingItem ? 'edit' : 'add'}
          initialData={editingItem ?? undefined}
          onClose={closeForm}
          onSubmit={editingItem ? handleEdit : handleAdd}
        />
      )}
    </div>
  )
}

export default MenuPage
