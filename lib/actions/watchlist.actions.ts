'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function toggleWatchlistAction({
  email,
  symbol,
  company,
}: {
  email: string;
  symbol: string;
  company?: string;
}): Promise<{ success: boolean; isAdded: boolean; error?: string }> {
  if (!email || !symbol) return { success: false, isAdded: false, error: 'User email or stock symbol missing' };

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return { success: false, isAdded: false, error: 'User not found' };

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return { success: false, isAdded: false, error: 'User ID missing' };

    const upperSymbol = symbol.toUpperCase().trim();
    const existing = await Watchlist.findOne({ userId, symbol: upperSymbol });

    if (existing) {
      await Watchlist.deleteOne({ userId, symbol: upperSymbol });
      return { success: true, isAdded: false };
    } else {
      await Watchlist.create({
        userId,
        symbol: upperSymbol,
        company: company || upperSymbol,
        addedAt: new Date(),
      });
      return { success: true, isAdded: true };
    }
  } catch (err: any) {
    console.error('toggleWatchlistAction error:', err);
    return { success: false, isAdded: false, error: err?.message || 'Failed to update watchlist' };
  }
}
