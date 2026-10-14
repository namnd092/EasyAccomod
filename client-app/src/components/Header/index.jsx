import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/session';
import { useDispatch, useSelector } from 'react-redux';
import { isDisplayByRole } from '../../helper/auth';
import { notifyError } from '../../helper/notify';
import Role from '../../models/data/role';

const navItem = 'ml-2.5 border-b-2 border-transparent text-[1.2rem] hover:border-white';
const navLink = 'block px-2 py-2 text-neutral-400 hover:text-white';
const dropdownItem =
    'my-[5px] block px-5 py-[5px] text-[1.1rem] text-neutral-400 hover:font-bold hover:text-white';

const Header = () => {
    const pathname = useLocation().pathname;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const auth = !!useSelector((state) => state.auth.token);
    const authRole = useSelector((state) => state.user.role);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [accountOpen, setAccountOpen] = React.useState(false);
    const accountRef = React.useRef(null);

    React.useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setAccountOpen(false);
            }
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    const gotoHome = () => {
        navigate('/');
    };
    const handleLogout = async () => {
        try {
            await dispatch(logout());
        } catch (error) {
            // The local session has ended either way; only a real server failure is worth telling the user.
            if (error.response?.status !== 401) notifyError(error, 'Không thể đăng xuất trên máy chủ');
        } finally {
            navigate('/login');
        }
    };
    return (
        <header className="bg-[var(--bg-color)] py-[5px]">
            <div className="mx-auto flex w-[95%] max-w-[1100px] justify-between">
                <div className="cursor-pointer" onClick={gotoHome}>
                    <img className="w-[70px]" src={logo} alt="" />
                </div>
                <nav className="flex items-center justify-between bg-[var(--bg-color)] py-2">
                    <button
                        className="rounded border border-white/40 px-3 py-1 md:hidden"
                        type="button"
                        aria-controls="navbarSupportedContent"
                        aria-expanded={menuOpen}
                        aria-label="Mở menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <i className="fas fa-bars" style={{ color: 'white' }}></i>
                    </button>
                    <div
                        className={`${menuOpen ? 'absolute right-[2.5%] top-[70px] z-20 flex bg-[var(--bg-color)] p-3' : 'hidden'} md:static md:flex md:p-0`}
                        id="navbarSupportedContent"
                    >
                        <ul className="flex list-none flex-col items-start gap-1 md:flex-row md:items-center">
                            <li className={navItem}>
                                <NavLink to="/" className={navLink}>
                                    Tìm phòng
                                </NavLink>
                            </li>
                            <li
                                className={navItem}
                                style={{
                                    display: isDisplayByRole(
                                        [Role.ADMIN, Role.OWNER],
                                        authRole
                                    ),
                                }}
                            >
                                <NavLink className={navLink} to="/newpost">
                                    Đăng bài
                                </NavLink>
                            </li>
                            <li
                                className={navItem}
                                style={{
                                    display: isDisplayByRole(
                                        [Role.ADMIN],
                                        authRole
                                    ),
                                }}
                            >
                                <NavLink className={navLink} to="/approved">
                                    Phê duyệt
                                </NavLink>
                            </li>
                            <li
                                className={navItem}
                                style={{
                                    display:
                                        pathname !== '/login' && !auth
                                            ? ''
                                            : 'none',
                                }}
                            >
                                <NavLink className={navLink} to="/login">
                                    Đăng nhập
                                </NavLink>
                            </li>

                            <li
                                className={navItem}
                                style={{
                                    display:
                                        pathname === '/login' && !auth
                                            ? ''
                                            : 'none',
                                }}
                            >
                                <NavLink className={navLink} to="/register">
                                    Đăng ký
                                </NavLink>
                            </li>
                            <li
                                className="relative ml-2.5 cursor-pointer"
                                style={{
                                    display: isDisplayByRole(
                                        [Role.ADMIN, Role.OWNER],
                                        authRole
                                    ),
                                }}
                            >
                                <span className="relative inline-flex">
                                    <i className="fas fa-bell text-xl text-white"></i>
                                    <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-xs font-medium text-white">
                                        10
                                    </span>
                                </span>
                            </li>
                            <li
                                className={`${navItem} relative`}
                                ref={accountRef}
                                style={{ display: auth ? '' : 'none' }}
                            >
                                <button
                                    type="button"
                                    className={`${navLink} cursor-pointer`}
                                    aria-haspopup="true"
                                    aria-expanded={accountOpen}
                                    onClick={() => setAccountOpen(!accountOpen)}
                                >
                                    {user.name || 'Tài khoản'}{' '}
                                    <i className="fas fa-caret-down text-sm"></i>
                                </button>
                                <div
                                    className={`${accountOpen ? 'block' : 'hidden'} absolute left-[-100px] top-full z-20 mt-1 min-w-[12rem] rounded bg-[var(--bg-color)] py-2 shadow-lg ring-1 ring-white/20`}
                                    onClick={() => setAccountOpen(false)}
                                >
                                    <Link
                                        className={dropdownItem}
                                        to="/profile"
                                        style={{
                                            display: isDisplayByRole(
                                                [
                                                    Role.OWNER,
                                                    Role.OWNER_PENDING,
                                                ],
                                                authRole
                                            ),
                                        }}
                                    >
                                        <i className="fas fa-user-circle mr-1"></i> Quản
                                        lý tài khoản
                                    </Link>
                                    <Link
                                        className={dropdownItem}
                                        to="/favorite"
                                        style={{
                                            display: isDisplayByRole(
                                                [Role.RENTER],
                                                authRole
                                            ),
                                        }}
                                    >
                                        <i className="fas fa-heart mr-1"></i> Phòng trọ
                                        yêu thích
                                    </Link>
                                    <Link
                                        className={dropdownItem}
                                        to="/my-post"
                                        style={{
                                            display: isDisplayByRole(
                                                [Role.OWNER],
                                                authRole
                                            ),
                                        }}
                                    >
                                        <i className="far fa-clipboard mr-1"></i> Phòng
                                        trọ của tôi
                                    </Link>
                                    <div className="my-2 h-px bg-white/20"></div>
                                    <Link
                                        className={dropdownItem}
                                        to="#"
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt mr-1"></i> Đăng
                                        xuất
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
