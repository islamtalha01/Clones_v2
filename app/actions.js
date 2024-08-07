'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../utils/supabase/server'

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return false
  }

  revalidatePath('/', 'layout')
  return true
}
