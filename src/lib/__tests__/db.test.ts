import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db';

describe('Database Migration v3', () => {
  beforeEach(async () => {
    await db.categories.clear();
  });

  it('should have orderIndex in categories table', async () => {
    const id = 'test-cat';
    await db.categories.add({
      id,
      name: 'Test Category',
      color: '#ff0000',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      orderIndex: 5
    });

    const cat = await db.categories.get(id);
    expect(cat).toBeDefined();
    expect(cat?.orderIndex).toBe(5);
  });
});
