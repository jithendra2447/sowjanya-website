const API_BASE_URL = ''; // Proxied via Vite

export async function fetchProductsFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('[MongoDB API] Failed to fetch products:', err);
    return null;
  }
}

export async function upsertProductsToAPI(products: any[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('[MongoDB API] Failed to upsert products:', err);
    throw err;
  }
}

export async function deleteProductsFromAPI(ids: string[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[MongoDB API] Failed to delete products:', err);
    throw err;
  }
}

export async function fetchOrdersFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('[MongoDB API] Failed to fetch orders:', err);
    return null;
  }
}

export async function createOrderInAPI(order: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('[MongoDB API] Failed to create order:', err);
    throw err;
  }
}

export async function updateOrderInAPI(id: string, updates: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('[MongoDB API] Failed to update order:', err);
    throw err;
  }
}

export async function deleteOrderFromAPI(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[MongoDB API] Failed to delete order:', err);
    throw err;
  }
}

export async function fetchCmsSettingsFromAPI() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cms`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || {};
  } catch (err) {
    console.warn('[MongoDB API] Failed to fetch CMS settings:', err);
    return null;
  }
}

export async function upsertCmsSettingToAPI(key: string, value: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('[MongoDB API] Failed to upsert CMS setting:', err);
    throw err;
  }
}
