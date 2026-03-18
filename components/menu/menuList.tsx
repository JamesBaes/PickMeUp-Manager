import React from 'react'

const formatName = (name: string) =>
  name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

interface MenuItem {
  item_id: number
  restaurant_id: number
  name: string
  price: number
  popular: boolean
  description: string
  category: string
  bogo: boolean
  image_url: string
  calories: number
  allergy_information: string
}

interface MenuListProps {
  menuItems: MenuItem[]
}

const MenuList: React.FC<MenuListProps> = ({ menuItems }) => {
  if (menuItems.length === 0) {
    return <p className="mt-4 text-gray-500">No menu items found.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-100 text-left text-sm text-gray-500">
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Calories</th>
            <th className="px-4 py-3 font-medium">Allergy Info</th>
            <th className="px-4 py-3 font-medium">Popular</th>
            <th className="px-4 py-3 font-medium">BOGO</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item, index) => (
            <tr
              key={`${item.item_id}-${item.restaurant_id}-${index}`}
              className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-semibold text-gray-900 text-sm">{formatName(item.name)}</td>
              <td className="px-4 py-3 text-sm text-gray-700">${item.price.toFixed(2)}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatName(item.category)}</td>
              <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">{item.description}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{item.calories ?? '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{item.allergy_information || '—'}</td>
              <td className="px-4 py-3">
                {item.popular ? (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">Yes</span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">No</span>
                )}
              </td>
              <td className="px-4 py-3">
                {item.bogo ? (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Yes</span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MenuList
