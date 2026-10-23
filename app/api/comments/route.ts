import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser } from '@/lib/auth';

export interface CommentItem {
  id: string;
  articleSlug: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleSlug = searchParams.get('slug');

    if (!articleSlug) {
      return NextResponse.json({ error: 'Article slug is required' }, { status: 400 });
    }

    const db = await getDb();
    const comments = await db
      .collection<CommentItem>('comments')
      .find({ articleSlug })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      comments: comments.map(c => ({
        id: c.id,
        articleSlug: c.articleSlug,
        name: c.name,
        email: c.email,
        content: c.content,
        createdAt: c.createdAt,
      }))
    });
  } catch (err) {
    console.error('Comments GET API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Only logged in users can post comments. Please log in or sign up first.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { articleSlug, content } = body;

    if (!articleSlug || !content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    const newComment: CommentItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      articleSlug,
      name: user.username,
      email: user.email,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    const db = await getDb();
    await db.collection<CommentItem>('comments').insertOne(newComment as any);

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Comments POST API Error:', error);
    return NextResponse.json({ error: 'Server error saving comment' }, { status: 500 });
  }
}
