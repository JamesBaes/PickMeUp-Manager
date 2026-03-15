import React from 'react'

interface MenuItem {
  item_id: number
  name: string
  price: number
  description: string
  category: string
  calories: number
  allergy_information: string
}

interface MenuListProps {
  menuItems: MenuItem[]
}

const MenuList: React.FC<MenuListProps> = ({ menuItems }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2 text-left">ID</th>
            <th className="border border-gray-300 p-2 text-left">Name</th>
            <th className="border border-gray-300 p-2 text-left">Price</th>
            <th className="border border-gray-300 p-2 text-left">Description</th>
            <th className="border border-gray-300 p-2 text-left">Category</th>
            <th className="border border-gray-300 p-2 text-left">Calories</th>
            <th className="border border-gray-300 p-2 text-left">Allergy Info</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item.item_id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{item.item_id}</td>
              <td className="border border-gray-300 p-2">{item.name}</td>
              <td className="border border-gray-300 p-2">${item.price.toFixed(2)}</td>
              <td className="border border-gray-300 p-2">{item.description}</td>
              <td className="border border-gray-300 p-2">{item.category}</td>
              <td className="border border-gray-300 p-2">{item.calories}</td>
              <td className="border border-gray-300 p-2">{item.allergy_information}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {menuItems.length === 0 && <p className="mt-4 text-gray-500">No menu items found.</p>}
    </div>
  )
}

export default MenuList