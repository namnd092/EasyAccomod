import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './style.css';
import logo from '../../assets/img/logo.png';
import { useLocation, useHistory } from 'react-router-dom';
import { removeUser } from '../../redux/slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import authApi from '../../api/authApi';
import { isDisplayByRole } from '../../helper/auth';
import Role from '../../models/data/role';

const Header = (props) => {
    const { role } = props;
    const pathname = useLocation().pathname;
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const auth = !!localStorage.getItem('token');
    const authRole = useSelector((state) => state.user.role);

    const gotoHome = () => {
        history.push('/');
    };
    const handleLogout = async () => {
        try {
            const response = await authApi.logout();
            console.log(response);
            await localStorage.removeItem('token');
            await localStorage.removeItem('role');
            dispatch(removeUser());
            history.push('/login');
        } catch (error) {
            console.log(error);
        }
    };
    console.log(isDisplayByRole([Role.ADMIN, Role.OWNER], role));
    return (
        <header>
            <div className="header width_box">
                <div className="logo" onClick={gotoHome}>
                    <img src={logo} alt="" />
                </div>
                <nav className="navbar navbar-expand-md ">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i class="fas fa-bars" style={{ color: 'white' }}></i>
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav mr-auto">
                            {/* <li className="nav-item active">
                                <Link to="/" className={"nav-link"}>Trang chủ</Link>
                            </li> */}

                            <li className="nav-item active">
                                <NavLink to="/" className={'nav-link'}>
                                    Tìm phòng
                                </NavLink>
                            </li>
                            <li
                                className="nav-item"
                                style={{
                                    display: isDisplayByRole(
                                        [Role.ADMIN, Role.OWNER],
                                        authRole
                                    ),
                                }}
                            >
                                <NavLink className="nav-link" to="/newpost">
                                    Đăng bài
                                </NavLink>
                            </li>
                            <li
                                className="nav-item"
                                style={{
                                    display: isDisplayByRole(
                                        [Role.ADMIN],
                                        authRole
                                    ),
                                }}
                            >
                                <NavLink className="nav-link" to="/approved">
                                    Phê duyệt
                                </NavLink>
                            </li>
                            <li
                                className="nav-item"
                                style={{
                                    display:
                                        pathname !== '/login' && !auth
                                            ? ''
                                            : 'none',
                                }}
                            >
                                <NavLink className="nav-link" to="/login">
                                    Đăng nhập
                                </NavLink>
                            </li>
                            <li
                                className="nav-item"
                                style={{
                                    display:
                                        pathname === '/login' && !auth
                                            ? ''
                                            : 'none',
                                }}
                            >
                                <NavLink className="nav-link" to="/register">
                                    Đăng ký
                                </NavLink>
                            </li>
                            <li
                                className="nav-item dropdown"
                                style={{ display: auth ? '' : 'none' }}
                            >
                                <NavLink
                                    className="nav-link dropdown-toggle"
                                    to="#"
                                    id="navbarDropdown"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    {user.name || 'Tài khoản'}
                                </NavLink>
                                <div
                                    className="dropdown-menu header__account__dropdown"
                                    aria-labelledby="navbarDropdown"
                                >
                                    <Link
                                        className="dropdown-item"
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
                                        <i class="fas fa-user-circle"></i> Quản
                                        lý tài khoản
                                    </Link>
                                    <Link
                                        className="dropdown-item"
                                        to="/favorite"
                                        style={{
                                            display: isDisplayByRole(
                                                [Role.RENTER],
                                                authRole
                                            ),
                                        }}
                                    >
                                        <i class="fas fa-heart"></i> Phòng trọ
                                        yêu thích
                                    </Link>
                                    <Link
                                        className="dropdown-item"
                                        to="/my-post"
                                        style={{
                                            display: isDisplayByRole(
                                                [Role.OWNER],
                                                authRole
                                            ),
                                        }}
                                    >
                                        <i class="far fa-clipboard"></i> Phòng
                                        trọ của tôi
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <Link
                                        className="dropdown-item"
                                        to="#"
                                        onClick={handleLogout}
                                    >
                                        <i class="fas fa-sign-out-alt"></i> Đăng
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

Header.propTypes = {};

export default Header;
