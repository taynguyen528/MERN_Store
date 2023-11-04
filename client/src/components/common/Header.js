import React, { useEffect, useState } from 'react';
import API_URL from '../../config';
import axios from 'axios';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useCart } from '../Cart/CartContext';

function Header() {
    const { productsCount, addToCart, removeToCart } = useCart();

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    const lastname = localStorage.getItem('lastname');
    const firstname = localStorage.getItem('firstname');

    const [categories, setCategories] = useState([]);
    const [items, setItem] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/api/products`)
            .then((response) => {
                const data = response.data;
                let list = [];
                data.forEach((size, index) => {
                    const item = {
                        id: size._id,
                        name: size.product_name
                    }
                    list.push(item);
                });
                setItem(list);
            })
            .catch(() => {
            });
        axios.get(`${API_URL}/api/subcategories`)
            .then(response => setCategories(response.data))
            .catch(() => {
            });
        // Tên tệp JavaScript và đường dẫn
        const scripts = [
            '/assets/js/plugins.js',
            '/assets/js/scripts.js'
        ];

        // Tải và thêm tệp JavaScript vào trang
        scripts.forEach((path) => {
            const script = document.createElement('script');
            script.src = path;
            script.type = 'text/javascript';

            document.body.appendChild(script);
        });
    }, []);

    const handleOnSearch = (string) => {
        if (string == searchText) {
            window.location.href = `/search/${string}`;
        }
        else {
            setSearchText(string);
        }
    }

    const handleOnSelect = (item) => {
        window.location.href = `/detail/${item.id}`;
    }

    const formatResult = (item) => {
        return (
            <>
                <a href={'/detail/' + item.id} style={{ display: 'block', textAlign: 'left', color: "black" }}>{item.name}</a>
            </>
        )
    }

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('email');
        localStorage.removeItem('address');
        localStorage.removeItem('phone');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');

        window.location.href = '/';
    }
    return (
        <>
            <div className="promo-bar" id="topbar">
                <div className="container">
                    <div id="slideText">
                        <p>
                            <a style={{ cursor: 'pointer', color: 'white' }}>
                                Free ship Toàn Quốc với đơn hàng &gt; 500K
                            </a>
                        </p>
                        <p>
                            <a style={{ cursor: 'pointer', color: 'white' }}>Đổi sản phẩm trong 7 ngày </a>
                        </p>
                        <p>
                            <a style={{ cursor: 'pointer', color: 'white' }}>Sản phẩm được bảo hành </a>
                        </p>
                        <p>
                            <a href="">
                                Hotline mua hàng: <b>(028) 7300 6200 </b>{" "}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <header className="main-header">
                <div className="wrapper-header  header-transparent " id="themes-header">
                    <div className="container">
                        <div className="header-middle row-flex flex-flow-header">
                            <div className="col-md-4 wrap-header-1 hidden-sm hidden-xs" />
                            <div className="col-md-4 wrap-header-2 col-sm-6 col-xs-7">
                                <div
                                    className="main-header--logo fade-box"
                                    itemScope=""
                                    itemType="http://schema.org/Organization"
                                >
                                    <a href="/">
                                        <h1 className="logo">
                                            <img
                                                itemProp="logo"
                                                src="https://file.hstatic.net/1000096703/file/logo_website__191___70_px__979fdef210f7474d8a09b42724033b5c.png"
                                                alt="KENTA.VN"
                                                className="img-responsive logoimg lazyload"
                                            />
                                        </h1>
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-4 wrap-header-3 col-sm-6 col-xs-5">
                                <div className="main-header--action row-flex">
                                    <div className="action--search" id="site-search-handle" style={{ width: "200px" }}>
                                        <ReactSearchAutocomplete
                                            items={items}
                                            onSearch={handleOnSearch}
                                            onSelect={handleOnSelect}
                                            formatResult={formatResult}
                                        />
                                    </div>
                                    <div className="action-cart" id="site-cart-handle">
                                        <a href="/cart">
                                            <span className="cart-menu" aria-hidden="true">
                                                <svg
                                                    version="1.1"
                                                    className="svg-cart"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    x="0px"
                                                    y="0px"
                                                    viewBox="0 0 24 27"
                                                    style={{ enableBackground: "new 0 0 24 27" }}
                                                    xmlSpace="preserve"
                                                >
                                                    <g>
                                                        <path d="M0,6v21h24V6H0z M22,25H2V8h20V25z" />
                                                    </g>
                                                    <g>
                                                        <path d="M12,2c3,0,3,2.3,3,4h2c0-2.8-1-6-5-6S7,3.2,7,6h2C9,4.3,9,2,12,2z" />
                                                    </g>
                                                </svg>
                                                <span className="count-holder">
                                                    <span className="count">{productsCount}</span>
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 wrap-header-4 hidden-sm hidden-xs">
                                <div className="main-header--menu">
                                    <nav className="navbar-mainmenu">
                                        <ul className="list-mainmenu">
                                            {categories.map((categoryWithSubcategories) => (
                                                <li className="has-submenu " key={categoryWithSubcategories.category._id}>
                                                    <a href={"/collection/" + categoryWithSubcategories.category.name} title={categoryWithSubcategories.category.name}>
                                                        {categoryWithSubcategories.category.name}
                                                        <i className="fa fa-chevron-down" aria-hidden="true" />
                                                    </a>
                                                    <ul className="list-submenu">
                                                        {categoryWithSubcategories.subcategories.map((subcategory) => (
                                                            <li key={subcategory._id}>
                                                                <a href={"/collection/" + categoryWithSubcategories.category.name + "/" + subcategory.name} title={subcategory.name}>
                                                                    {subcategory.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                </li>
                                            ))}
                                            {
                                                role === 'admin' &&
                                                <li className="has-submenu ">
                                                    <a style={{ cursor: "pointer" }} title="Quản lí">
                                                        Quản lí
                                                        <i className="fa fa-chevron-down" aria-hidden="true" />
                                                    </a>
                                                    <ul className="list-submenu">
                                                        <li className="">
                                                            <a href="/manage-user" title="Quản lí người dùng">
                                                                Người dùng
                                                            </a>
                                                        </li>
                                                        <li className="">
                                                            <a href="/manage-product" title="Dây Nịt">
                                                                Sản phẩm
                                                            </a>
                                                        </li>
                                                        <li className="">
                                                            <a href="/manage-order" title="Nơ - Cà Vạt">
                                                                Đơn hàng
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            }
                                            {
                                                !isLoggedIn ?
                                                    <li className="has-submenu ">
                                                        <a href='/login' title="Đăng nhập">
                                                            Đăng nhập
                                                        </a>
                                                    </li>
                                                    :
                                                    <li className="has-submenu ">
                                                        <a style={{ cursor: "pointer" }} title="Tài khoản">
                                                            {firstname + " " + lastname}
                                                            <i className="fa fa-chevron-down" aria-hidden="true" />
                                                        </a>
                                                        <ul className="list-submenu">
                                                            <li className="">
                                                                <a href="/purchase-order" title="Đơn hàng của bạn">
                                                                    Đơn hàng của bạn
                                                                </a>
                                                            </li>
                                                            <li className="">
                                                                <a onClick={handleLogout} title="Đăng xuất" style={{ cursor: "pointer" }}>
                                                                    Đăng xuất
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </li>
                                            }
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;