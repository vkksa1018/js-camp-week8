// ========================================
// 工具函式
// ========================================

const dayjs = require("dayjs");

/**
 * 計算產品折扣率
 * @param {Object} product - 產品物件
 * @returns {string} - 例如 '8折'
 */
function getDiscountRate(product) {
  // 請實作此函式
  if (!product.origin_price || !product.price) return "無折扣";

  const rate = (product.price / product.origin_price) * 10;

  return `${Math.round(rate)}折`;
}

/**
 * 取得所有產品分類（不重複）
 * @param {Array} products - 產品陣列
 * @returns {Array} - 分類陣列
 */
function getAllCategories(products) {
  // 請實作此函式
  if (!Array.isArray(products)) return [];
  const categories = products.map((item) => item.category);
  return [...new Set(categories)];
}

/**
 * 格式化日期
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 格式 'YYYY/MM/DD HH:mm'，例如 '2024/01/01 08:00'
 */
function formatDate(timestamp) {
  // 請實作此函式
  // 提示：dayjs.unix...
  if (!timestamp) return "";
  return dayjs.unix(timestamp).format("YYYY/MM/DD HH:mm");
}

/**
 * 計算距今天數
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 例如 '3 天前'
 */
function getDaysAgo(timestamp) {
  // 請實作此函式
  // 提示：
  // 1. 用 dayjs() 取得今天
  // 2. 用 dayjs.unix(timestamp) 取得日期
  // 3. 用 .diff() 計算天數差異
  if (!timestamp) return "";

  const now = dayjs();
  const targetDate = dayjs.unix(timestamp);
  if (now.isSame(targetDate, "day")) {
    return "今天";
  }

  const diff = now.diff(targetDate, "day");
  return `${diff} 天前`;
}

/**
 * 驗證訂單使用者資料
 * @param {Object} data - 使用者資料
 * @returns {Object} - { isValid: boolean, errors: string[] }
 *
 * 驗證規則：
 * - name: 不可為空
 * - tel: 必須是 09 開頭的 10 位數字
 * - email: 必須包含 @ 符號
 * - address: 不可為空
 * - payment: 必須是 'ATM', 'Credit Card', 'Apple Pay' 其中之一
 */
function validateOrderUser(data) {
  // 請實作此函式
  const errors = [];
  const { name, tel, email, address, payment } = data || {};

  // 姓名檢查
  if (!name || name.trim() === "") {
    errors.push("姓名不可為空");
  }

  // 驗證手機
  const telRule = /^09\d{8}$/;
  if (!telRule.test(tel)) {
    errors.push("手機格式不正確");
  }

  // Email驗證
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Email 格式不正確");
  }

  // 地址檢查
  if (!address || address.trim() === "") {
    errors.push("地址不可為空");
  }

  // 付款方式檢查
  const validPayments = ["ATM", "Credit Card", "Apple Pay"];
  if (!validPayments.includes(payment)) {
    errors.push("付款方式不正確");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

/**
 * 驗證購物車數量
 * @param {number} quantity - 數量
 * @returns {Object} - { isValid: boolean, error?: string }
 *
 * 驗證規則：
 * - 必須是正整數
 * - 不可小於 1
 * - 不可大於 99
 */
function validateCartQuantity(quantity) {
  // 請實作此函式
  if (typeof quantity !== "number") {
    return { isValid: false, error: "數量必須是數字格式" };
  }

  if (!Number.isInteger(quantity)) {
    return { isValid: false, error: "數量必須是整數" };
  }

  if (quantity < 1 || quantity > 99) {
    return { isValid: false, error: "數量必須介於 1 到 99" };
  }

  return { isValid: true, error: "" };
}

/**
 * 格式化金額
 * @param {number} amount - 金額
 * @returns {string} - 格式化後的金額
 *
 * 格式化規則：
 * - 加上 "NT$ " 前綴
 * - 數字需要千分位逗號分隔（例如：1000 → 1,000）
 * - 使用台灣格式（zh-TW）
 *
 * 範例：
 * formatCurrency(1000) → "NT$ 1,000"
 * formatCurrency(1234567) → "NT$ 1,234,567"
 *
 */
function formatCurrency(amount) {
  // 請實作此函式
  if (amount === undefined || amount === null) return "NT$ 0";

  const formatter = new Intl.NumberFormat("zh-TW", {
    style: "decimal",
    minimumFractionDigits: 0,
  });

  return `NT$ ${formatter.format(amount)}`;
}

module.exports = {
  getDiscountRate,
  getAllCategories,
  formatDate,
  getDaysAgo,
  validateOrderUser,
  validateCartQuantity,
  formatCurrency,
};
