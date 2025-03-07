'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  console.log('Starting login process...')
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log('Attempting login with email:', data.email)

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message, error)
    redirect('/error')
  }

  console.log('Sign in successful, checking session...')
  console.log('Auth data:', authData)

  if (!authData?.session) {
    console.error('No session created after successful login')
    redirect('/error')
  }

  console.log('Initial session created:', authData.session)

  // Verify the session was created
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('Session verification error:', sessionError)
    redirect('/error')
  }

  if (!session) {
    console.error('No session found after verification')
    redirect('/error')
  }

  console.log('Session verified successfully:', session)
  console.log('Access token:', session.access_token)
  console.log('User:', session.user)

  revalidatePath('/', 'layout')
  console.log('Redirecting to home page...')
  redirect('/')
}

export async function signup(formData: FormData) {
  console.log('Starting signup process...')
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  console.log('Attempting signup with email:', data.email)

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error.message, error)
    redirect('/error')
  }

  console.log('Signup successful, checking session...')
  console.log('Auth data:', authData)

  if (!authData?.session) {
    console.log('No session - email verification may be required')
    redirect('/verify-email')
  }

  // Verify the session was created
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('Session verification error:', sessionError)
    redirect('/error')
  }

  if (!session) {
    console.error('No session found after verification')
    redirect('/error')
  }

  console.log('Session verified successfully:', session)
  console.log('Access token:', session.access_token)
  console.log('User:', session.user)

  revalidatePath('/', 'layout')
  console.log('Redirecting to home page...')
  redirect('/')
}