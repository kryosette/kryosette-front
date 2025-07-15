'use client'

import { useHashtags } from "@/hooks/use_hashtags";
import { HashtagLink } from "./hashtag_link";

export const PopularHashtags = () => {
    const { popularHashtags, loading, error } = useHashtags();

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-3">Популярные хештеги</h3>

            {loading && <div>Загрузка...</div>}
            {error && <div className="text-red-500">{error}</div>}

            <div className="flex flex-wrap gap-2">
                {popularHashtags.map((tag, index) => (
                    <HashtagLink
                        key={index}
                        tag={tag}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                    />
                ))}
            </div>
        </div>
    );
};