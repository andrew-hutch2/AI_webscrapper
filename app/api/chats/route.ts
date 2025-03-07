import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Fetching chats for user:', user.id)

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({ chats: data })
  } catch (error) {
    console.error('Error in GET /api/chats:', error)
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Received POST request body:', body)
    
    const { title, data, chartType, url, websiteData } = body

    if (!title || !data) {
      console.error('Missing required fields:', { title, data })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Inserting new chat into Supabase')
    const { data: newChat, error } = await supabase
      .from('chats')
      .insert([
        {
          user_id: user.id,
          title,
          data,
          chart_type: chartType,
          url,
          website_data: websiteData
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Successfully created new chat:', newChat)
    return NextResponse.json({ chat: newChat })
  } catch (error) {
    console.error('Error in POST /api/chats:', error)
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')

    if (!chatId) {
      console.error('No chatId provided in DELETE request')
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 })
    }

    console.log('Deleting chat:', chatId)
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId)
      .eq('user_id', user.id) // Ensure user can only delete their own chats

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Successfully deleted chat:', chatId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/chats:', error)
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 })
  }
} 