export type StaffOrderStage = "incoming" | "accepted" | "completed";
export type StaffOrderAction = "none" | "complete-order" | "in-progress";
export type PickupStatus = "pending" | "picked-up";

export interface StaffOrderCard {
  id: string;
  orderNumber: string;
  customer: string;
  items: string[];
  note: string;
  orderType: "Pick Up";
  stage: StaffOrderStage;
  action: StaffOrderAction;
  pickupStatus: PickupStatus;
  autoRejectAt: string;
}

const STORAGE_KEY = "staff-orders-mock-v1";

const initialOrders: StaffOrderCard[] = [
  {
    id: "order-1",
    orderNumber: "#88088",
    customer: "John Doe",
    items: ["1x Gladiator", "1x Warrior", "1x Coke Zero"],
    note: "No ice for Coke Zero please!",
    orderType: "Pick Up",
    stage: "incoming",
    action: "none",
    pickupStatus: "pending",
    autoRejectAt: "4:37",
  },
  {
    id: "order-2",
    orderNumber: "#88089",
    customer: "John Doe",
    items: ["1x Gladiator", "1x Warrior", "1x Coke Zero"],
    note: "No ice for Coke Zero please!",
    orderType: "Pick Up",
    stage: "incoming",
    action: "none",
    pickupStatus: "pending",
    autoRejectAt: "4:37",
  },
  {
    id: "order-3",
    orderNumber: "#88090",
    customer: "John Doe",
    items: ["1x Gladiator", "1x Warrior", "1x Coke Zero"],
    note: "No ice for Coke Zero please!",
    orderType: "Pick Up",
    stage: "incoming",
    action: "none",
    pickupStatus: "pending",
    autoRejectAt: "4:37",
  },
  {
    id: "order-4",
    orderNumber: "#88091",
    customer: "John Doe",
    items: ["1x Gladiator", "1x Warrior", "1x Coke Zero"],
    note: "No ice for Coke Zero please!",
    orderType: "Pick Up",
    stage: "accepted",
    action: "none",
    pickupStatus: "pending",
    autoRejectAt: "4:37",
  },
  {
    id: "order-5",
    orderNumber: "#88092",
    customer: "John Doe",
    items: ["1x Gladiator", "1x Warrior", "1x Coke Zero"],
    note: "No ice for Coke Zero please!",
    orderType: "Pick Up",
    stage: "accepted",
    action: "in-progress",
    pickupStatus: "pending",
    autoRejectAt: "4:37",
  },
];

export function getInitialOrders(): StaffOrderCard[] {
  return initialOrders;
}

export function loadOrdersFromStorage(): StaffOrderCard[] {
  if (typeof window === "undefined") {
    return initialOrders;
  }

  const rawOrders = window.localStorage.getItem(STORAGE_KEY);

  if (!rawOrders) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
    return initialOrders;
  }

  try {
    const parsedOrders = JSON.parse(rawOrders) as StaffOrderCard[];
    if (!Array.isArray(parsedOrders)) {
      return initialOrders;
    }
    return parsedOrders;
  } catch {
    return initialOrders;
  }
}

export function saveOrdersToStorage(orders: StaffOrderCard[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}
