'use client'

import { useState, useEffect } from 'react'
import { fetchLocations, addLocation, updateLocation, deleteLocation } from './locationApi'
import type { Location } from './locationApi'
import ConfirmModal from '@/components/ui/ConfirmModal'
import SlideDrawer from '@/components/ui/SlideDrawer'

const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)

  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchLocations().then(setLocations)
  }, [])

  const handleAdd = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    const created = await addLocation(newName.trim())
    if (created) {
      setLocations((prev) => [...prev, created].sort((a, b) => a.location_name.localeCompare(b.location_name)))
    }
    setNewName('')
    setAdding(false)
    setShowSidebar(false)
  }

  const startEdit = (loc: Location) => {
    setEditingId(loc.restaurant_id)
    setEditName(loc.location_name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleSaveEdit = async (restaurant_id: number) => {
    if (!editName.trim()) return
    setSaving(true)
    const ok = await updateLocation(restaurant_id, editName.trim())
    if (ok) {
      setLocations((prev) =>
        prev
          .map((l) => (l.restaurant_id === restaurant_id ? { ...l, location_name: editName.trim() } : l))
          .sort((a, b) => a.location_name.localeCompare(b.location_name))
      )
      cancelEdit()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!locationToDelete) return
    setDeleting(true)
    const ok = await deleteLocation(locationToDelete.restaurant_id)
    if (ok) {
      setLocations((prev) => prev.filter((l) => l.restaurant_id !== locationToDelete.restaurant_id))
    }
    setDeleting(false)
    setLocationToDelete(null)
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Location Management</h1>
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Location
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">Location Name</th>
              <th className="py-4 px-4 md:px-6 text-left text-sm font-semibold text-gray-500">ID</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 && (
              <tr>
                <td colSpan={3} className="py-10 text-center text-sm text-gray-400">No locations found.</td>
              </tr>
            )}
            {locations.map((loc) => (
              <tr key={loc.restaurant_id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                <td className="py-4 px-4 md:px-6">
                  {editingId === loc.restaurant_id ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(loc.restaurant_id)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-xs"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-base shrink-0">
                        {loc.location_name[0].toUpperCase()}
                      </div>
                      <span className="text-sm md:text-base font-semibold">{loc.location_name}</span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 md:px-6 text-sm text-gray-500">{loc.restaurant_id}</td>
                <td className="py-4 px-4 md:px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === loc.restaurant_id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(loc.restaurant_id)}
                          disabled={saving}
                          className="text-xs md:text-sm border border-blue-500 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50 active:scale-95 transition disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="text-xs md:text-sm border border-gray-300 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-50 active:scale-95 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(loc)}
                          className="text-xs md:text-sm border border-gray-300 text-gray-600 px-3 md:px-4 py-1.5 rounded-md hover:bg-gray-50 active:scale-95 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setLocationToDelete(loc)}
                          className="text-xs md:text-sm border border-red-500 text-red-500 px-3 md:px-4 py-1.5 rounded-md hover:bg-red-50 active:scale-95 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {locationToDelete && (
        <ConfirmModal
          title="Delete location?"
          message={<>Are you sure you want to delete <strong>{locationToDelete.location_name}</strong>? This action cannot be undone.</>}
          confirmLabel="Delete"
          confirming={deleting}
          onConfirm={handleDelete}
          onCancel={() => setLocationToDelete(null)}
        />
      )}

      {showSidebar && (
        <SlideDrawer title="Add New Location" onClose={() => setShowSidebar(false)}>
          <form onSubmit={handleAdd} className="flex flex-col flex-1 p-6 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location Name</label>
              <input
                type="text"
                placeholder="e.g. Downtown Branch"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="mt-auto flex gap-2">
              <button
                type="button"
                onClick={() => setShowSidebar(false)}
                className="flex-1 border text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adding}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add Location'}
              </button>
            </div>
          </form>
        </SlideDrawer>
      )}
    </div>
  )
}

export default LocationsPage
