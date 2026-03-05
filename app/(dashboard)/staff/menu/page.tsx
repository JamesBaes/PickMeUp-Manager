"use client";

import { useState } from "react";

interface InventoryItem {
  id: string;
  item: string;
  stock: number;
}

// MOCK DATA: Temporary until inventory is fetched from database.
const initialInventoryItems: InventoryItem[] = [
  { id: "item-1", item: "Warrior", stock: 34 },
  { id: "item-2", item: "Gladiator", stock: 18 },
  { id: "item-3", item: "Undefeated", stock: 8 },
  { id: "item-4", item: "Chicken Shield", stock: 6 },
];

// REAL DB FETCH (UNCOMMENT WHEN READY):
// import { createClient } from "@/utils/server";
//
// export default async function StaffInventoryPage() {
//   const supabase = await createClient();
//   const { data } = await supabase
//     .from("menu_items")
//     .select("id, name, stock_count")
//     .order("name", { ascending: true });
//
//   const inventoryItems = (data ?? []).map((row: any) => ({
//     id: String(row.id),
//     item: row.name,
//     stock: Number(row.stock_count ?? 0),
//   }));
//
//   // Status rule:
//   // stock < 10  => Low
//   // stock >= 10 => In Stock
//
//   return (...same JSX and render flow as below...);
// }

function getStockStatus(stock: number): "Low" | "In Stock" {
  return stock < 10 ? "Low" : "In Stock";
}

export default function StaffInventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, number>>({});

  const handleStockDeltaChange = (itemId: string, delta: number) => {
    setPendingChanges((previousChanges) => {
      const nextDelta = (previousChanges[itemId] ?? 0) + delta;
      return {
        ...previousChanges,
        [itemId]: nextDelta,
      };
    });
  };

  const handleSaveChanges = () => {
    setInventoryItems((previousItems) =>
      previousItems.map((item) => {
        const delta = pendingChanges[item.id] ?? 0;
        if (delta === 0) {
          return item;
        }

        return {
          ...item,
          stock: Math.max(0, item.stock + delta),
        };
      })
    );

    setPendingChanges({});
    setIsEditingStock(false);
  };

  const handleToggleEdit = () => {
    if (isEditingStock) {
      handleSaveChanges();
      return;
    }

    setIsEditingStock(true);
  };

  return (
    <section className="rounded-xl border border-dashboard-border bg-dashboard-card p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap mb-4">
        <h1 className="font-heading text-3xl sm:text-5xl text-slate-700 leading-tight">Inventory</h1>
        <button
          onClick={handleToggleEdit}
          className="h-9 px-5 sm:px-6 rounded-xl border border-dashboard-border text-slate-500 font-body text-sm"
        >
          {isEditingStock ? "Save" : "Add Item"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-135 table-fixed text-slate-600 text-sm sm:text-base">
          <colgroup>
            <col className="w-[44%]" />
            <col className="w-[16%]" />
            <col className="w-[22%]" />
            {isEditingStock && <col className="w-[18%]" />}
          </colgroup>
          <thead>
            <tr className="border-b border-dashboard-border">
              <th className="py-3 pr-2 text-left font-body font-semibold">Item</th>
              <th className="py-3 pr-2 text-left font-body font-semibold">Stock</th>
              <th className="py-3 pr-2 text-left font-body font-semibold">Status</th>
              {isEditingStock && <th className="py-3 text-left font-body font-semibold">Update</th>}
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item) => {
              const status = getStockStatus(item.stock);
              const pendingDelta = pendingChanges[item.id] ?? 0;

              return (
                <tr key={item.id} className="border-b border-dashboard-border">
                  <td className="py-3 pr-2 font-body align-middle wrap-break-word">{item.item}</td>
                  <td className="py-3 pr-2 font-body align-middle">{item.stock}</td>
                  <td className="py-3 pr-2 align-middle">
                    <span
                      className={`inline-flex h-8 sm:h-9 min-w-24 sm:min-w-28 rounded-xl items-center justify-center px-3 sm:px-4 font-body whitespace-nowrap ${
                        status === "In Stock"
                          ? "bg-dashboard-success-soft text-dashboard-success"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  {isEditingStock && (
                    <td className="py-3 align-middle">
                      <div className="flex items-center justify-start gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleStockDeltaChange(item.id, -1)}
                          className="h-8 w-8 rounded-lg border border-dashboard-border text-slate-600 active:bg-accent/15 active:text-accent"
                          aria-label={`Decrease ${item.item} stock`}
                        >
                          -
                        </button>

                        <span className="min-w-12 sm:min-w-14 text-center font-body text-slate-600 text-xs sm:text-sm">
                          {pendingDelta > 0 ? `+${pendingDelta}` : pendingDelta}
                        </span>

                        <button
                          onClick={() => handleStockDeltaChange(item.id, 1)}
                          className="h-8 w-8 rounded-lg border border-dashboard-border text-slate-600 active:bg-dashboard-success-soft active:text-dashboard-success"
                          aria-label={`Increase ${item.item} stock`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
