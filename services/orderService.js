// ========================================
// 訂單服務
// ========================================

const {
  createOrder,
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../api");
const {
  validateOrderUser,
  formatDate,
  getDaysAgo,
  formatCurrency,
} = require("../utils");

/**
 * 建立新訂單
 * @param {Object} userInfo - 使用者資料
 * @returns {Promise<Object>}
 */
async function placeOrder(userInfo) {
  // 請實作此函式
  // 提示：先用 utils validateOrderUser() 驗證使用者資料，驗證失敗時回傳 { success: false, errors: [...] }
  // 驗證通過後，呼叫 createOrder() 建立訂單
  // 使用 try/catch 處理錯誤，回傳格式：{ success: true, data: ... } / { success: false, errors: [...] }
  const validation = validateOrderUser(userInfo);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  try {
    const res = await createOrder(userInfo);
    if (res && res.status) {
      return { success: true, data: res };
    } else {
      return { success: false, errors: [res?.message || "建立訂單失敗"] };
    }
  } catch (error) {
    return { success: false, errors: [error.message] };
  }
}

/**
 * 取得所有訂單
 * @returns {Promise<Array>}
 */
async function getOrders() {
  // 請實作此函式
  // 提示：呼叫 fetchOrders() 取得訂單陣列並回傳
  const orders = await fetchOrders();
  return Array.isArray(orders) ? orders : [];
}

/**
 * 取得未付款訂單
 * @returns {Promise<Array>}
 */
async function getUnpaidOrders() {
  // 請實作此函式
  // 提示：呼叫 fetchOrders() 後，篩選出 paid 為 false 的訂單
  const orders = await getOrders();
  return orders.filter((order) => !order.paid);
}

/**
 * 取得已付款訂單
 * @returns {Promise<Array>}
 */
async function getPaidOrders() {
  // 請實作此函式
  // 提示：呼叫 fetchOrders() 後，篩選出 paid 為 true 的訂單
  const orders = await getOrders();
  return orders.filter((order) => order.paid);
}

/**
 * 更新訂單付款狀態
 * @param {string} orderId - 訂單 ID
 * @param {boolean} isPaid - 是否已付款
 * @returns {Promise<Object>}
 */
async function updatePaymentStatus(orderId, isPaid) {
  // 請實作此函式
  // 提示：呼叫 updateOrderStatus()，使用 try/catch 處理錯誤
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const res = await updateOrderStatus(orderId, isPaid);
    if (res && res.status) {
      return { success: true, data: res };
    } else {
      return { success: false, error: res?.message || "更新失敗" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 刪除訂單
 * @param {string} orderId - 訂單 ID
 * @returns {Promise<Object>}
 */
async function removeOrder(orderId) {
  // 請實作此函式
  // 提示：呼叫 deleteOrder()，使用 try/catch 處理錯誤
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const res = await deleteOrder(orderId);

    if (res && res.status === true) {
      return { success: true, data: res };
    }

    return { success: false, error: res?.message || "刪除失敗" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 格式化訂單資訊
 * @param {Object} order - 訂單物件
 * @returns {Object} - 格式化後的訂單
 *
 * 回傳物件包含以下欄位：
 * - id: 訂單 ID
 * - user: 使用者資料
 * - products: 商品陣列
 * - total: 總金額（原始數字）
 * - totalFormatted: 格式化金額，使用 utils formatCurrency()
 * - paid: 付款狀態（布林值）
 * - paidText: 付款狀態文字，true → '已付款'，false → '未付款'
 * - createdAt: 格式化後的建立時間，使用 utils formatDate()
 * - daysAgo: 距離今天為幾天前，使用 utils getDaysAgo()
 */
function formatOrder(order) {
  // 請實作此函式
  if (!order) return {};

  return {
    id: order.id,
    user: order.user,
    products: order.products,
    total: order.total,
    totalFormatted: formatCurrency(order.total),
    paid: order.paid,
    paidText: order.paid ? "已付款" : "未付款",
    createdAt: formatDate(order.createdAt),
    daysAgo: getDaysAgo(order.createdAt),
  };
}

/**
 * 顯示訂單列表
 * @param {Array} orders - 訂單陣列
 */
function displayOrders(orders) {
  // 請實作此函式
  // 提示：先判斷訂單陣列是否為空，若空則輸出「沒有訂單」
  // 使用 formatOrder() 格式化每筆訂單後再輸出
  //
  // 預期輸出格式：
  // 訂單列表：
  // ========================================
  // 訂單 1
  // ----------------------------------------
  // 訂單編號：xxx
  // 顧客姓名：王小明
  // 聯絡電話：0912345678
  // 寄送地址：台北市...
  // 付款方式：Credit Card
  // 訂單金額：NT$ 1,000
  // 付款狀態：已付款
  // 建立時間：2024-01-01 (3 天前)
  // ----------------------------------------
  // 商品明細：
  //   - 產品名稱 x 2（產品數量）
  // ========================================
  if (!Array.isArray(orders) || orders.length === 0) {
    console.log("沒有訂單");
    return;
  }

  console.log("訂單列表：");
  console.log("========================================");

  orders.forEach((item, index) => {
    const f = formatOrder(item);

    console.log(`訂單 ${index + 1}`);
    console.log("----------------------------------------");
    console.log(`訂單編號：${f.id}`);
    console.log(`顧客姓名：${f.user?.name}`);
    console.log(`聯絡電話：${f.user?.tel}`);
    console.log(`寄送地址：${f.user?.address}`);
    console.log(`付款方式：${f.user?.payment}`);
    console.log(`訂單金額：${f.totalFormatted}`);
    console.log(`付款狀態：${f.paidText}`);
    console.log(`建立時間：${f.createdAt} (${f.daysAgo})`);
    console.log("----------------------------------------");
    console.log("商品明細：");

    f.products.forEach((p) => {
      console.log(`   - ${p.title} x ${p.quantity}`);
    });

    console.log("========================================");
  });
}

module.exports = {
  placeOrder,
  getOrders,
  getUnpaidOrders,
  getPaidOrders,
  updatePaymentStatus,
  removeOrder,
  formatOrder,
  displayOrders,
};
