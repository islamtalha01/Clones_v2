import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ChatItem = ({ label, route }) => {
  return (
    <Link
      className='flex items-center px-6 py-2 mt-4 text-gray-300 hover:bg-[#B5B5BE] hover:bg-opacity-25 rounded-md'
      href={route ?? '/'}
    >
      <Image
        width={50}
        height={50}
        className='w-10 h-10 rounded-full'
        src='/heygen-logo.png'
        alt='Rounded avatar'
      />

      <span className='mx-3'>AI Theripest</span>
    </Link>
  )
}

export default ChatItem
