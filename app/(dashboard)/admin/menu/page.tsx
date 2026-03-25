'use client'

import { useRestaurant } from '@/context/RestaurantContext'
import { useMenuPage, PER_PAGE_OPTIONS, SORT_LABELS, type PerPage } from '@/hooks/useMenuPage'
import MenuList from '@/components/menu/menuList'
import MenuForm from '@/components/menu/menuForm'

type SortKey = 'name' | 'category' | 'price' | 'hidden'

const MenuPage = () => {
  const { isAdmin } = useRestaurant()
  const {
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
    setSearchQuery,
    setItemsPerPage,
    setShowSidebar,
  } = useMenuPage()

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Loading menu...</div>

  const navBtn = (label: string, page: number, disabled: boolean) => (
    <button
      onClick={() => goToPage(page)}
      disabled={disabled}
      className="text-xs px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
      aria-label={label}
    >
      {label}
    </button>
  )

  return (
    <div className="relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 py-4 px-6">
        {/* Left: Title + pagination nav */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-lg font-semibold">Menu</h1>
          <div className="flex items-center gap-1">
            {navBtn('«', 1, safePage === 1)}
            {navBtn('‹', safePage - 1, safePage === 1)}
            <span className="text-xs text-gray-500 px-1 tabular-nums w-10 text-center">
              {safePage} / {totalPages}
            </span>
            {navBtn('›', safePage + 1, safePage === totalPages)}
            {navBtn('»', totalPages, safePage === totalPages)}
          </div>
          {/* Per-page selector */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 bg-white">
            <span className="text-xs text-gray-400">Show:</span>
            {PER_PAGE_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setItemsPerPage(n as PerPage)}
                className={`text-xs px-2 py-0.5 rounded-md transition ${
                  itemsPerPage === n ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search bar */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M16.5 16.5l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                maxLength={50}
                placeholder="Search..."
                className="w-48 pl-9 pr-7 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Clear search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1.5 bg-white">
              <span className="text-xs text-gray-400 mr-1">Sort:</span>
              {(['name', 'category', 'price', 'hidden'] as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`text-xs px-2.5 py-1 rounded-md transition flex items-center gap-0.5 ${
                    sortKey === key ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
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
              onClick={() => { setShowSidebar(true) }}
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
        menuItems={paginatedItems}
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
