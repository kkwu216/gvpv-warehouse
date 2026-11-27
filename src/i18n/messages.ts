export type Locale = "zh" | "vi" | "en";

export const LOCALE_COOKIE = "gvpv_lang";
export const DEFAULT_LOCALE: Locale = "zh";

const dict = {
  appName: { zh: "GVPV 模具倉儲", vi: "GVPV kho khuôn", en: "GVPV Mold Warehouse" },
  appSubtitle: {
    zh: "越南外包倉",
    vi: "Kho thuê ngoài Việt Nam",
    en: "Vietnam outsourced warehouse",
  },
  navHome: { zh: "首頁", vi: "Trang chủ", en: "Home" },
  navInbound: { zh: "入倉", vi: "Nhập kho", en: "Inbound" },
  navOutbound: { zh: "出倉", vi: "Xuất kho", en: "Outbound" },
  navHistory: { zh: "紀錄", vi: "Lịch sử", en: "History" },
  logout: { zh: "登出", vi: "Đăng xuất", en: "Log out" },
  language: { zh: "語言", vi: "Ngôn ngữ", en: "Language" },
  liveInventory: { zh: "即時庫存", vi: "Tồn kho", en: "Live inventory" },
  inStockCount: { zh: "目前在倉套數", vi: "Số khuôn trong kho", en: "Molds in warehouse" },
  stockRuleHint: {
    zh: "以模號最新一筆異動判斷在倉狀態",
    vi: "Trạng thái theo giao dịch mới nhất của mã khuôn",
    en: "Status from each mold number's latest movement",
  },
  recentActivity: { zh: "近期異動", vi: "Hoạt động gần đây", en: "Recent activity" },
  noRecords: {
    zh: "尚無紀錄，請使用下方「入倉」開始登記。",
    vi: "Chưa có dữ liệu. Dùng «Nhập kho» bên dưới để bắt đầu.",
    en: "No records yet. Use Inbound below to start.",
  },
  inboundTitle: { zh: "入倉登記", vi: "Đăng ký nhập kho", en: "Inbound registration" },
  outboundTitle: { zh: "出倉登記", vi: "Đăng ký xuất kho", en: "Outbound registration" },
  plateInbound: { zh: "海關／入倉車牌", vi: "Biển số nhập kho", en: "Inbound truck plate" },
  plateOutbound: { zh: "送貨車牌", vi: "Biển số giao hàng", en: "Delivery truck plate" },
  moldNumber: { zh: "模號", vi: "Mã khuôn", en: "Mold no." },
  moldPlaceholder: { zh: "例如 M-1024", vi: "VD: M-1024", en: "e.g. M-1024" },
  dateTime: { zh: "日期時間", vi: "Ngày giờ", en: "Date & time" },
  platePlaceholder: { zh: "車牌號碼", vi: "Biển số", en: "License plate" },
  submitSave: { zh: "確認登記", vi: "Xác nhận", en: "Submit" },
  saving: { zh: "儲存中…", vi: "Đang lưu…", en: "Saving…" },
  movementIn: { zh: "入倉", vi: "Nhập", en: "In" },
  movementOut: { zh: "出倉", vi: "Xuất", en: "Out" },
  plateLabel: { zh: "車牌", vi: "Biển số", en: "Plate" },
  historyTitle: { zh: "異動紀錄", vi: "Lịch sử giao dịch", en: "Movement history" },
  filterType: { zh: "類型", vi: "Loại", en: "Type" },
  filterAll: { zh: "全部", vi: "Tất cả", en: "All" },
  filterMold: { zh: "模號（模糊）", vi: "Mã khuôn (gần đúng)", en: "Mold no. (contains)" },
  filterMoldPlaceholder: { zh: "模號關鍵字", vi: "Từ khóa", en: "Keyword" },
  filterFrom: { zh: "起", vi: "Từ", en: "From" },
  filterTo: { zh: "迄", vi: "Đến", en: "To" },
  searchAgain: { zh: "重新查詢", vi: "Tìm lại", en: "Search" },
  loading: { zh: "載入中…", vi: "Đang tải…", en: "Loading…" },
  noMatches: { zh: "沒有符合條件的紀錄", vi: "Không có kết quả", en: "No matching records" },
  loginTitle: { zh: "系統登入", vi: "Đăng nhập", en: "Sign in" },
  loginId: { zh: "帳號", vi: "Tài khoản", en: "User ID" },
  loginPassword: { zh: "密碼", vi: "Mật khẩu", en: "Password" },
  loginSubmit: { zh: "登入", vi: "Đăng nhập", en: "Sign in" },
  loginHint: {
    zh: "倉庫人員與主管使用本公司核發的帳號密碼，不需 Cursor 帳號。",
    vi: "Nhân viên kho và quản lý dùng tài khoản công ty, không cần Cursor.",
    en: "Use company-issued credentials. No Cursor account required.",
  },
  loginFailed: { zh: "帳號或密碼錯誤", vi: "Sai tài khoản hoặc mật khẩu", en: "Invalid credentials" },
  networkError: { zh: "網路錯誤，請稍後再試", vi: "Lỗi mạng", en: "Network error" },
  roleWarehouse: { zh: "倉庫登記", vi: "Kho", en: "Warehouse" },
  roleViewer: { zh: "查閱", vi: "Xem", en: "Viewer" },
  ERR_MOLD_REQUIRED: { zh: "請輸入模號", vi: "Nhập mã khuôn", en: "Enter mold number" },
  ERR_PLATE_REQUIRED: { zh: "請輸入車牌", vi: "Nhập biển số", en: "Enter plate" },
  ERR_DATETIME_REQUIRED: { zh: "請選擇日期時間", vi: "Chọn ngày giờ", en: "Pick date and time" },
  ERR_ALREADY_IN_STOCK: {
    zh: "此模號已在倉內，請先辦理出倉",
    vi: "Khuôn đã trong kho, cần xuất trước",
    en: "Mold already in stock; outbound first",
  },
  ERR_NOT_IN_STOCK: {
    zh: "此模號不在倉內，無法出倉",
    vi: "Khuôn không trong kho",
    en: "Mold not in stock",
  },
  ERR_INVALID_REQUEST: { zh: "無效的請求", vi: "Yêu cầu không hợp lệ", en: "Invalid request" },
  ERR_INVALID_DIRECTION: { zh: "方向無效", vi: "Hướng không hợp lệ", en: "Invalid direction" },
  ERR_UNAUTHORIZED: { zh: "請先登入", vi: "Vui lòng đăng nhập", en: "Sign in required" },
  ERR_FORBIDDEN: { zh: "無權限", vi: "Không có quyền", en: "Forbidden" },
  saveFailed: { zh: "登記失敗", vi: "Lưu thất bại", en: "Save failed" },
} as const;

export type MessageKey = keyof typeof dict;

export function t(key: MessageKey, locale: Locale): string {
  return dict[key][locale] ?? dict[key].en;
}

export function isLocale(value: string): value is Locale {
  return value === "zh" || value === "vi" || value === "en";
}

export const localeLabels: Record<Locale, string> = {
  zh: "繁中",
  vi: "Tiếng Việt",
  en: "English",
};