import db from '../client.js';

const TABLE = 'categories';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findAll() {
  return db(TABLE).select('*').orderBy('sort_order', 'asc');
}

export async function findRoots() {
  return db(TABLE).whereNull('parent_id').select('*').orderBy('sort_order', 'asc');
}

export async function findChildren(parentId) {
  return db(TABLE).where({ parent_id: parentId }).select('*').orderBy('sort_order', 'asc');
}

export async function findAncestors(id) {
  const ancestors = [];
  let current = await findById(id);
  while (current && current.parent_id) {
    current = await findById(current.parent_id);
    if (current) ancestors.unshift(current);
  }
  return ancestors;
}

export async function findDescendantIds(id) {
  const ids = [];
  const queue = [id];
  while (queue.length > 0) {
    const current = queue.shift();
    const children = await findChildren(current);
    for (const child of children) {
      ids.push(child.id);
      queue.push(child.id);
    }
  }
  return ids;
}

export async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

export async function updateById(id, data) {
  const [row] = await db(TABLE).where({ id }).update(data).returning('*');
  return row;
}

export async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

export async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}
