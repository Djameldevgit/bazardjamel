import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const StoreHeader = ({ store, isOwner, onShare, onContact }) => {
    const [isFollowing, setIsFollowing] = useState(false)

    return (
        <div className="relative">
            {/* Banner */}
            <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {store.bannerUrl && (
                    <Image
                        src={store.bannerUrl}
                        alt={`${store.name} banner`}
                        layout="fill"
                        objectFit="cover"
                        className="opacity-90"
                    />
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Store Info */}
            <div className="container mx-auto px-4 -mt-16 relative">
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                                {store.logoUrl ? (
                                    <Image
                                        src={store.logoUrl}
                                        alt={store.name}
                                        width={128}
                                        height={128}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                                        {store.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-grow md:ml-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {store.name}
                                    </h1>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {store.plan} Plan
                                        </span>
                                        {store.verified && (
                                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                                                ✓ Verified
                                            </span>
                                        )}
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                                            store.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {store.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-2">{store.description}</p>
                                </div>

                                {/* Stats */}
                                <div className="flex space-x-6 mt-4 md:mt-0">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {store.stats?.totalProducts || 0}
                                        </div>
                                        <div className="text-sm text-gray-500">Products</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {store.stats?.totalFavorites || 0}
                                        </div>
                                        <div className="text-sm text-gray-500">Followers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {store.stats?.totalViews || 0}
                                        </div>
                                        <div className="text-sm text-gray-500">Views</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 mt-6">
                                {isOwner ? (
                                    <>
                                        <Link href={`/store/${store._id}/edit`}>
                                            <a className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition">
                                                Edit Store
                                            </a>
                                        </Link>
                                        <Link href={`/store/${store._id}/dashboard`}>
                                            <a className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition">
                                                Dashboard
                                            </a>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsFollowing(!isFollowing)}
                                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                                isFollowing
                                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                            }`}
                                        >
                                            {isFollowing ? 'Unfollow' : 'Follow Store'}
                                        </button>
                                        <button
                                            onClick={() => onContact('whatsapp')}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition"
                                        >
                                            Contact via WhatsApp
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={onShare}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                                >
                                    Share Store
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreHeader