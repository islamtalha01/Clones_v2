'use server'

import { createClient } from '../../utils/supabase/server'

export async function logout() {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error } = await supabase.auth.signOut()
  console.log({ error })
  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
