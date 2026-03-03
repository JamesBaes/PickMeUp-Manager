// MOCK DATA: Temporary until inventory data is loaded from the database.
const inventoryItems = [
	{ item: "Warrior", sku: "WM-100", stock: 34, status: "In Stock" },
	{ item: "Gladiator", sku: "GL-210", stock: 18, status: "In Stock" },
	{ item: "Undefeated", sku: "UN-320", stock: 8, status: "Low" },
	{ item: "Chicken Shield", sku: "CS-455", stock: 6, status: "Low" },
];

// REAL DB FETCH (UNCOMMENT WHEN READY):
// import { createClient } from "@/utils/server";
//
// export default async function StaffInventoryPage() {
//   const supabase = await createClient();
//   const { data } = await supabase
//     .from("menu_items")
//     .select("name, sku, stock_count")
//     .order("name", { ascending: true });
//
//   const inventoryItems = (data ?? []).map((item: any) => ({
//     item: item.name,
//     sku: item.sku,
//     stock: Number(item.stock_count ?? 0),
//     status: Number(item.stock_count ?? 0) > 10 ? "In Stock" : "Low",
//   }));
//
//   return (...same JSX as below...);
// }

export default function StaffInventoryPage() {
	return (
		<section className="rounded-xl border border-dashboard-border bg-dashboard-card p-4">
			<div className="flex items-center justify-between gap-4 flex-wrap mb-3">
				<h1 className="font-heading text-5xl text-slate-700">Inventory</h1>
				<button className="h-9 px-6 rounded-xl border border-dashboard-border text-slate-500 font-body text-sm">
					Add Item
				</button>
			</div>

			<table className="w-full text-slate-600">
				<thead>
					<tr className="border-b border-dashboard-border">
						<th className="py-3 text-left font-body font-semibold">Item</th>
						<th className="py-3 text-left font-body font-semibold">SKU</th>
						<th className="py-3 text-left font-body font-semibold">Stock</th>
						<th className="py-3 text-left font-body font-semibold">Status</th>
					</tr>
				</thead>
				<tbody>
					{inventoryItems.map((item) => (
						<tr key={item.sku} className="border-b border-dashboard-border">
							<td className="py-3 font-body">{item.item}</td>
							<td className="py-3 font-body">{item.sku}</td>
							<td className="py-3 font-body">{item.stock}</td>
							<td className="py-3">
								<span
									className={`inline-flex h-9 min-w-28 rounded-xl items-center justify-center px-4 font-body ${
										item.status === "In Stock"
											? "bg-dashboard-success-soft text-dashboard-success"
											: "bg-slate-200 text-slate-600"
									}`}
								>
									{item.status}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
}
