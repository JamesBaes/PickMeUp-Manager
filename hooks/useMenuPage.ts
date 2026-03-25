import { useState, useEffect } from 'react'
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemVisibility,
} from '@/app/(dashboard)/admin/menu/menu'
import type { MenuItem } from '@/app/(dashboard)/admin/menu/menu'

type SortKey = 'name' | 'category' | 'price' | 'hidden'
type SortDir = 'asc' | 'desc'
export type PerPage = 20 | 30 | 50

export const PER_PAGE_OPTIONS: PerPage[] = [20, 30, 50]
export const SORT_LABELS: Record<SortKey, string> = {
  name: 'Name',
  category: 'Category',
  price: 'Price',
  hidden: 'Hidden',
}

export function useMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<PerPage>(20)
  const [searchQuery, setSearchQuery] = useState('')

  const loadItems = async () => {
    const result = await getAllMenuItems()
    if (result.success && result.data) setMenuItems(result.data)
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setCurrentPage(1)
  }

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const q = normalize(searchQuery)

  const filteredItems = q
    ? menuItems.filter(
        (item) =>
          normalize(item.name).includes(q) ||
          normalize(item.description ?? '').includes(q) ||
          normalize(item.allergy_information ?? '').includes(q)
      )
    : menuItems

  const sortedItems = sortKey
    ? [...filteredItems].sort((a, b) => {
        let cmp: number
        if (sortKey === 'price') cmp = a.price - b.price
        else if (sortKey === 'hidden') cmp = (a.is_hidden ? 1 : 0) - (b.is_hidden ? 1 : 0)
        else cmp = a[sortKey].localeCompare(b[sortKey])
        return sortDir === 'asc' ? cmp : -cmp
      })
    : filteredItems

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedItems = sortedItems.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage)

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))

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
      setMenuItems((prev) => prev.map((i) => (i.item_id === id ? { ...i, is_hidden: isHidden } : i)))
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

  return {
    paginatedItems,
    loading,
    totalPages,
    safePage,
    sortKey,
    sortDir,
    itemsPerPage,
    searchQuery,
    showSidebar,
    editingItem,
    deletingId,
    formError,
    handleSort,
    handleAdd,
    handleEdit,
    handleDelete,
    handleToggleHide,
    openEdit,
    closeForm,
    goToPage,
    setSearchQuery: (q: string) => { setSearchQuery(q); setCurrentPage(1) },
    setItemsPerPage: (n: PerPage) => { setItemsPerPage(n); setCurrentPage(1) },
    setShowSidebar,
  }
}
