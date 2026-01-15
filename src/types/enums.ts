/**
 * Enums compartidos del backend KØDE
 * Estos valores corresponden exactamente a los enums del backend .NET
 */

// ============ SIZE (Tallas) ============
export enum Size {
  XS = 0,
  S = 1,
  M = 2,
  L = 3,
  XL = 4,
  XXL = 5
}

export const SizeLabels: Record<Size, string> = {
  [Size.XS]: 'XS',
  [Size.S]: 'S',
  [Size.M]: 'M',
  [Size.L]: 'L',
  [Size.XL]: 'XL',
  [Size.XXL]: 'XXL'
};

export const SizeOptions = Object.entries(SizeLabels).map(([value, label]) => ({
  value: Number(value) as Size,
  label
}));

// ============ ORDER STATUS ============
export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Refunded = 6
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pendiente',
  [OrderStatus.Confirmed]: 'Confirmado',
  [OrderStatus.Processing]: 'En Preparación',
  [OrderStatus.Shipped]: 'Enviado',
  [OrderStatus.Delivered]: 'Entregado',
  [OrderStatus.Cancelled]: 'Cancelado',
  [OrderStatus.Refunded]: 'Reembolsado'
};

export const OrderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: '#f59e0b',      // Amber
  [OrderStatus.Confirmed]: '#3b82f6',    // Blue
  [OrderStatus.Processing]: '#8b5cf6',   // Purple
  [OrderStatus.Shipped]: '#06b6d4',      // Cyan
  [OrderStatus.Delivered]: '#22c55e',    // Green
  [OrderStatus.Cancelled]: '#ef4444',    // Red
  [OrderStatus.Refunded]: '#6b7280'      // Gray
};

// ============ ROLE ============
export enum Role {
  Customer = 0,
  Admin = 1,
  SuperAdmin = 2
}

export const RoleLabels: Record<Role, string> = {
  [Role.Customer]: 'Cliente',
  [Role.Admin]: 'Administrador',
  [Role.SuperAdmin]: 'Super Administrador'
};
