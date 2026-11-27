export type InventoryErrorCode =
  | "ERR_MOLD_REQUIRED"
  | "ERR_PLATE_REQUIRED"
  | "ERR_DATETIME_REQUIRED"
  | "ERR_ALREADY_IN_STOCK"
  | "ERR_NOT_IN_STOCK";

export type ApiErrorCode =
  | InventoryErrorCode
  | "ERR_INVALID_REQUEST"
  | "ERR_INVALID_DIRECTION"
  | "ERR_UNAUTHORIZED"
  | "ERR_FORBIDDEN";