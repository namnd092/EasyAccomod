import React from 'react';
import PostItem from './PostItem';

function PostList(props) {
    const { postList } = props;
    if (postList.length === 0) {
        return (
            <div className="mt-6 rounded-lg bg-white px-4 py-16 text-center text-gray-500 shadow-sm">
                <i className="fas fa-search mb-3 text-4xl text-gray-300" aria-hidden="true"></i>
                <p className="mb-1 text-lg">Không tìm thấy bài đăng nào</p>
                <p className="mb-0 text-sm">Hãy thử bỏ bớt điều kiện tìm kiếm.</p>
            </div>
        );
    }
    return (
        <div className="mt-6 flex flex-col gap-4">
            {postList.map((item) => (
                <PostItem key={item.id} rentalPost={item} />
            ))}
        </div>
    );
}

export function PostListSkeleton() {
    return (
        <div className="mt-6 flex flex-col gap-4" role="progressbar" aria-label="Đang tải">
            {[0, 1, 2].map((i) => (
                <div key={i} className="flex animate-pulse flex-col gap-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row">
                    <div className="aspect-[3/2] w-full rounded-md bg-gray-200 sm:w-56"></div>
                    <div className="flex flex-1 flex-col gap-3">
                        <div className="h-5 w-3/4 rounded bg-gray-200"></div>
                        <div className="h-5 w-1/3 rounded bg-gray-200"></div>
                        <div className="h-4 w-full rounded bg-gray-200"></div>
                        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PostList;
