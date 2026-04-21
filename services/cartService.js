// ========================================
// 購物車服務
// ========================================

const {
  fetchCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} = require("../api");
const { validateCartQuantity, formatCurrency } = require("../utils");

/**
 * 取得購物車
 * @returns {Promise<Object>}
 */
async function getCart() {
  // 請實作此函式
  // 提示：呼叫 fetchCart() 取得購物車資料並回傳
  const result = await fetchCart();
  return result;
}

/**
 * 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>}
 */
async function addProductToCart(productId, quantity) {
  // 請實作此函式
  // 提示：先用 utils validateCartQuantity() 驗證數量，驗證失敗時回傳 { success: false, error: ... }
  // 驗證通過後，呼叫 addToCart() 加入購物車
  // 使用 try/catch 處理錯誤，回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  const validation = validateCartQuantity(quantity);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    const res = await addToCart(productId, quantity);
    if (res && res.carts) {
      return { success: true, data: res };
    } else {
      return { success: false, error: res?.message || "加入失敗" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 更新購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>}
 */
async function updateProduct(cartId, quantity) {
  // 請實作此函式
  // 提示：先用 utils validateCartQuantity() 驗證數量，驗證失敗時回傳 { success: false, error: ... }
  // 驗證通過後，呼叫 updateCartItem() 更新數量
  // 使用 try/catch 處理錯誤，回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  const validation = validateCartQuantity(quantity);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  try {
    const res = await updateCartItem(cartId, quantity);
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
 * 移除購物車商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>}
 */
async function removeProduct(cartId) {
  // 請實作此函式
  // 提示：呼叫 deleteCartItem()，使用 try/catch 處理錯誤
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const res = await deleteCartItem(cartId);

    // 只要有拿到 res，且裡面有 message（不論是 '已刪除' 還是正常回傳）
    // 或是 res.status 成功，都算過關
    if (res && (res.status || res.message === "已刪除" || res.carts)) {
      return { success: true, data: res };
    }

    return { success: false, error: res?.message || "移除失敗" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 清空購物車
 * @returns {Promise<Object>}
 */
async function emptyCart() {
  // 請實作此函式
  // 提示：呼叫 clearCart()，使用 try/catch 處理錯誤
  // 回傳格式：{ success: true, data: ... } / { success: false, error: ... }
  try {
    const res = await clearCart();
    if (res && res.status) {
      return { success: true, data: res };
    } else {
      return { success: false, error: res?.message || "清空失敗" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 計算購物車總金額
 * @returns {Promise<Object>}
 */
async function getCartTotal() {
  // 請實作此函式
  // 提示：呼叫 fetchCart() 取得購物車資料
  // 回傳格式：{ total: 原始金額, finalTotal: 折扣後金額, itemCount: 商品筆數 }
  const cartData = await fetchCart();
  return {
    total: cartData?.total || 0,
    finalTotal: cartData?.finalTotal || 0,
    itemCount: cartData?.carts?.length || 0,
  };
}

/**
 * 顯示購物車內容
 * @param {Object} cart - 購物車資料
 */
function displayCart(cart) {
  // 請實作此函式
  // 提示：先判斷購物車是否為空（cart.carts 不存在或長度為 0），若空則輸出「購物車是空的」
  // 會使用到 utils formatCurrency() 來格式化金額
  //
  // 預期輸出格式：
  // 購物車內容：
  // ----------------------------------------
  // 1. 產品名稱
  //    數量：2
  //    單價：NT$ 800
  //    小計：NT$ 1,600
  // ----------------------------------------
  // 商品總計：NT$ 1,600
  // 折扣後金額：NT$ 1,600
  if (!cart || !cart.carts || cart.carts.length === 0) {
    console.log("購物車是空的");
    return;
  }

  console.log("購物車內容：");
  console.log("----------------------------------------");

  cart.carts.forEach((item, index) => {
    console.log(`${index + 1}. ${item.product.title}`);
    console.log(`    數量：${item.quantity}`);
    console.log(`    單價：${formatCurrency(item.product.price)}`);
    console.log(
      `    小計：${formatCurrency(item.product.price * item.quantity)}`,
    );
    console.log("----------------------------------------");
  });

  console.log(`商品總計：${formatCurrency(cart.total)}`);
  console.log(`折扣後金額：${formatCurrency(cart.finalTotal)}`);
}

module.exports = {
  getCart,
  addProductToCart,
  updateProduct,
  removeProduct,
  emptyCart,
  getCartTotal,
  displayCart,
};
