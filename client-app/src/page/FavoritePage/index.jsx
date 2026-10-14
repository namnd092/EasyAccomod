import React from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import rentalPost from '../../api/rentalPost';
import Card from '../../share/components/card';
import PostItem from '../HomePage/components/PostList/PostItem';
import { Button, Pagination, tableClass } from '../../ui';
import { notifyError } from '../../helper/notify';

const PAGE_SIZE = 15;

// Loads one page of the renter's liked posts. `reload` fetches the current page again.
function useFavoritePosts() {
    const [page, setPage] = React.useState(1);
    const [posts, setPosts] = React.useState([]);
    const [maxPage, setMaxPage] = React.useState(1);
    const [reloads, setReloads] = React.useState(0);
    React.useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const response = await rentalPost.getAllFavoriteRentalPost(page, PAGE_SIZE);
                if (ignore) return;
                setPosts([...response.simplePostDtos]);
                setMaxPage(response.maxPage);
            } catch (error) {
                if (ignore) return;
                // The last post of the last page was removed, so that page no longer exists.
                if (error.response?.status === 404 && page > 1) {
                    setPage(page - 1);
                    return;
                }
                setPosts([]);
                notifyError(error);
            }
        }
        load();
        return () => {
            ignore = true;
        };
    }, [page, reloads]);
    return { posts, page, setPage, maxPage, reload: () => setReloads((n) => n + 1) };
}

export default function FavoritePage() {
    const navigate = useNavigate();
    const { posts: postList, page, setPage, maxPage, reload } = useFavoritePosts();
    const gotoPost = (postId) => {
        navigate(`/post/${postId}`);
    };
    const handleDislike = async (postId) => {
        try {
            await rentalPost.postRenterLikeRentalPost(postId);
            // Fetch the page again so the posts that moved up from the next page fill the gap.
            reload();
        } catch (error) {
            notifyError(error);
        }
    };
    return (
        <div className="favorite">
            <Card title="Bài đăng yêu thích">
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th scope="col" style={{ minWidth: '10%' }}>
                                STT
                            </th>
                            <th scope="col">Bài đăng</th>
                            <th scope="col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postList.length === 0 ? (
                            <tr>
                                <td colSpan={3}>Không tìm thấy bài viết nào</td>
                            </tr>
                        ) : (
                            postList.map((item, index) => (
                                <tr key={item.id}>
                                    <th onClick={() => gotoPost(item.id)}>
                                        {(page - 1) * PAGE_SIZE + index + 1}
                                    </th>
                                    <td onClick={() => gotoPost(item.id)}>
                                        <PostItem rentalPost={item} />
                                    </td>
                                    <td>
                                        <Button onClick={() => handleDislike(item.id)}>
                                            <i className="fas fa-thumbs-down mr-2.5"></i>
                                            Bỏ thích
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination className="mt-3 justify-center" page={page} count={maxPage} onChange={setPage} />
            </Card>
        </div>
    );
}
