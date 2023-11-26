import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
        window.location.href = '/';
    }
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            if (username === '' || password === '') {
                toast('Vui lòng nhập đầy đủ thông tin');
                return;
            }
            if (password.length < 8) {
                toast('Vui lòng nhập mật khẩu với ít nhất 8 kí tự');
                return;
            }
            const response = await axios.post(`${API_URL}/api/users/login`, { username, password });
            
            if (response.status === 200) {
                localStorage.setItem('user_id', response.data.user._id);
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('firstname', response.data.user.firstname);
                localStorage.setItem('lastname', response.data.user.lastname);
                localStorage.setItem('email', response.data.user.email);
                localStorage.setItem('address', response.data.user.address);
                localStorage.setItem('phone', response.data.user.phone);
                localStorage.setItem('role', response.data.roleName);
                localStorage.setItem('isLoggedIn', true);
                toast('Đăng nhập thành công');
                window.location.href = '/';
            }
            else {
                toast('Đăng nhập không thành công');
            }
        } catch (error) {
            toast(error.response.data.message);
        }
    }
    return (
        <>
            <main className="mainContent-theme ">
                <div className="layout-account">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 col-xs-12 wrapbox-heading-account">
                                <div className="header-page clearfix">
                                    <h1>Đăng nhập</h1>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12 wrapbox-content-account">
                                <div id="customer-login">
                                    <div id="login" className="userbox">
                                        <form
                                            acceptCharset="UTF-8"
                                            action="/account/login"
                                            id="customer_login"
                                            method="post"
                                        >
                                            <div className="clearfix large_form">
                                                <label htmlFor="customer_email" className="icon-field">
                                                    <i className="icon-login icon-envelope " />
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="customer[email]"
                                                    id="customer_email"
                                                    placeholder="Email"
                                                    className="text"
                                                    value={username} onChange={e => setUsername(e.target.value)}
                                                />
                                            </div>
                                            <div className="clearfix large_form">
                                                <label htmlFor="customer_password" className="icon-field">
                                                    <i className="icon-login icon-shield" />
                                                </label>
                                                <input
                                                    required
                                                    type="password"
                                                    name="customer[password]"
                                                    id="customer_password"
                                                    placeholder="Mật khẩu"
                                                    className="text"
                                                    size={16}
                                                    value={password} onChange={e => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="clearfix action_account_custommer">
                                                <div className="action_bottom btn btn-outline-primary">
                                                    <input
                                                        className="btn btn-signin"
                                                        onClick={handleLogin}
                                                        defaultValue="Đăng nhập"
                                                    />
                                                </div>
                                                <div className="req_pass">
                                                    <a
                                                        href="/"
                                                    >
                                                        Quên mật khẩu?
                                                    </a>
                                                    <br />
                                                    hoặc{" "}
                                                    <a title="Đăng ký" href="/register">
                                                        Đăng ký
                                                    </a>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <ToastContainer />
        </>
    )
}

export default Login;