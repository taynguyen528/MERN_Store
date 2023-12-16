import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const handleRegister = async () => {
        try {
            if (!firstname || !lastname || !address || !phone || !email || !username || !password) {
                toast('Vui lòng điền đầy đủ thông tin');
                return;
            }

            const phonePattern = /^[0-9]{10}$/;
            if (!phone.match(phonePattern)) {
                toast('Số điện thoại không hợp lệ');
                return;
            }
            if (password.length < 8) {
                toast('Vui lòng nhập mật khẩu ít nhất 8 kí tự');
                return;
            }
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!email.match(emailPattern)) {
                toast('Email không hợp lệ');
                return;
            }
            const userData = {
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                email: email,
                address: address,
                username: username,
                password: password,
                idRole: '',
            };

            axios.post(`${API_URL}/api/users`, userData).then((response) => {
                if (response.status === 201) {
                    window.location.href = '/login';
                } else {
                    toast(response.data.error);
                }
            });
        } catch (error) {
            toast('Lỗi đăng ký:', error);
        }
    }

    return (
        <>
            <main className="mainContent-theme ">
                <div className="layout-account">
                    <div className="container">
                        <div className="row" style={{ marginTop: "50px" }}>
                            <div className="col-md-6 col-xs-12 wrapbox-heading-account">
                                <div className="header-page clearfix">
                                    <h1>Tạo tài khoản</h1>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12 wrapbox-content-account ">
                                <div className="userbox">
                                    <form
                                        acceptCharset="UTF-8"
                                        action="/account"
                                        id="create_customer"
                                        method="post"
                                    >
                                        <div className="clearfix large_form">
                                            <input
                                                required
                                                type="text"
                                                placeholder="Họ"
                                                value={firstname} onChange={e => setFirstName(e.target.value)}
                                                className="text"
                                            />
                                        </div>
                                        <div className="clearfix large_form">
                                            <input
                                                required
                                                type="text"
                                                value={lastname} onChange={e => setLastName(e.target.value)}
                                                placeholder="Tên"
                                                className="text"
                                            />
                                        </div>
                                        <div className="clearfix large_form">
                                            <input
                                                required
                                                type="text"
                                                placeholder="Username"
                                                value={username} onChange={e => setUsername(e.target.value)}
                                                className="text"
                                            />
                                        </div>
                                        <div className="clearfix large_form">
                                            <input
                                                required
                                                type="text"
                                                placeholder="Số điện thoại"
                                                value={phone} onChange={e => setPhone(e.target.value)}
                                                className="text"
                                            />
                                        </div>
                                        <div className="clearfix large_form">
                                            <input
                                                required
                                                type="text"
                                                placeholder="Địa chỉ"
                                                value={address} onChange={e => setAddress(e.target.value)}
                                                className="text"
                                            />
                                        </div>
                                        <div id="email" className="clearfix large_form">
                                            <input
                                                required
                                                type="email"
                                                placeholder="Email"
                                                id="email"
                                                className="text"
                                                autoComplete="current-email"
                                                value={email} onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div id="password" className="clearfix large_form">
                                            <input
                                                required
                                                type="password"
                                                placeholder="Mật khẩu"
                                                className="password text"
                                                autoComplete="current-password"
                                                value={password} onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="clearfix action_account_custommer">
                                            <div className="action_bottom btn btn-outline-primary">
                                                <input className="btn" onClick={handleRegister} defaultValue="Đăng ký" />
                                            </div>
                                        </div>
                                        <div className="clearfix req_pass">
                                            <a className="come-back" href="/">
                                                <i className="fa fa-long-arrow-left" /> Quay lại trang chủ
                                            </a>
                                        </div>
                                    </form>
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

export default Register;