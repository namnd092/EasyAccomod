import React from 'react'
import { Link } from 'react-router-dom'
import './style.css';
import logo from '../../assets/img/logo.png';
import {useLocation, useHistory} from 'react-router-dom'
const Header = props => {
    const pathname = useLocation().pathname;
    const history = useHistory();
    const gotoHome = () => {
        history.push('/');
    }
    return (
        <header>
            <div className="header width_box">
                <div className="logo" onClick={gotoHome}>
                    <img src={logo} alt=""/>
                </div>
                <nav className="navbar navbar-expand-lg ">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="fas fa-bars" style={{color: 'white'}}></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link to="/" className={"nav-link"}>Trang chủ</Link>
                            </li>
                            <li className="nav-item active">
                                <Link to="/" className={"nav-link"}>Tìm phòng</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#">Đăng bài</Link>
                            </li>
                            <li className="nav-item" style={{display: pathname !== '/login' ? '' : 'none'}}>
                                <Link className="nav-link" to="/login" >Đăng nhập</Link>
                            </li>
                            <li className="nav-item" style={{display: pathname === '/login' ? '' : 'none'}}>
                                <Link className="nav-link" to="/register">Đăng ký</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Nguyễn Duy Nam
                                </Link>
                                <div className="dropdown-menu header__account__dropdown" aria-labelledby="navbarDropdown">
                                    <Link className="dropdown-item" to="#"><i class="fas fa-user-circle">
                                        </i> Quản lý tài khoản
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                        Another action
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <Link className="dropdown-item" to="#">
                                    <i class="fas fa-sign-out-alt"></i> Đăng xuất
                                    </Link>
                                </div>
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link disabled" to="#">Disabled</Link>
                            </li> */}
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    )
}

Header.propTypes = {

}

export default Header;
