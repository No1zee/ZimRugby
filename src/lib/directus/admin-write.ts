const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!;

export async function directusUpdate(collection: string, id: string, data: Record<string, unknown>) {
  const res = await fetch(`${DIRECTUS_URL}/items/${collection}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Directus update failed: ${res.status}`);
  return res.json();
}

export async function directusCreate(collection: string, data: Record<string, unknown>) {
  const res = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Directus create failed: ${res.status}`);
  return res.json();
}

export async function directusDelete(collection: string, id: string) {
  const res = await fetch(`${DIRECTUS_URL}/items/${collection}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Directus delete failed: ${res.status}`);
  return res.json();
}
