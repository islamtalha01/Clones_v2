import { createClient } from '../utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AuthButton() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
  }

  return user ? (
    <div className='flex items-center gap-4'>
      <div className='flex items-center'>
        <img
          className='w-11 h-11 rounded-full'
          src={user.user_metadata.avatar_url}
          alt={user.user_metadata.full_name}
        />
        <div className='flex flex-col pl-4'>
          <span className=' text-lg'>{user.user_metadata.full_name}</span>
          <span className='text-md'>{user.email}</span>
        </div>
      </div>

      <form action={signOut}>
        <button className='py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover'>
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href='/login'
      className='py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover'
    >
      Login
    </Link>
  )
}
