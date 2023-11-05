import React, { useState, useRef, useEffect } from "react";
import '../../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../config';
import axios from 'axios';
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function ManageUser() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role1 = localStorage.getItem('role');
    if (!isLoggedIn && role1 !== "admin") {
        window.location.href = '/';
    }
    const [role, setRole] = useState('');
    const [isVisible, setVisible] = useState(false);
    const [idItem, setIdItem] = useState(0);
    const [isReload, setIsReload] = useState(false);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const addressRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/roles`)
            .then(response => {
                setRole(response.data[0]._id);
                setRoles(response.data);
            })
            .catch(() => {
            });
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/api/users`)
            .then((response) => setUsers(response.data))
            .catch(() => {
            });
    }, [isReload]);

    const handleClickEdit = (id) => {
        axios.get(`${API_URL}/api/users/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setVisible(true);
                    setTimeout(() => {
                        const { firstname, lastname, address, phone, email, username } = response.data.user;
                        firstNameRef.current.value = firstname;
                        lastNameRef.current.value = lastname;
                        addressRef.current.value = address;
                        phoneRef.current.value = phone;
                        emailRef.current.value = email;
                        setRole(response.data.idRole);
                        usernameRef.current.value = username;
                        //passwordRef.current.value = password;
                    });

                    setIdItem(id);
                } else {
                    toast('Lỗi khi lấy thông tin người dùng');
                }
            })
            .catch(() => {
            });
    };

    const handleClickDelete = async (id) => {
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa thông tin người dùng?",
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => handleConfirmDelete(id)
                },
                {
                    label: 'Hủy',
                    onClick: () => handleCancelDelete()
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            keyCodeForClose: [8, 32],
            willUnmount: () => { },
            afterClose: () => { },
            onClickOutside: () => { },
            onKeypress: () => { },
            onKeypressEscape: () => { },
            overlayClassName: "overlay-custom-class-name"
        });
    };

    const handleConfirmDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/users/${id}`);
            if (response.status === 200) {
                toast('Xóa dữ liệu thành công');
                setVisible(false);
                setIsReload(!isReload);
            } else {
                toast('Lỗi khi xóa người dùng');
            }
        } catch (error) {
            toast('Lỗi khi gọi API deleteUser:', error);
        }
    };

    const handleCancelDelete = () => {
    };

    const clickSetVisible = () => {
        setIdItem(0);
        setVisible(!isVisible);
    }

    const clickBtnAdd_Edit = () => {
        const firstName = firstNameRef.current.value;
        const lastName = lastNameRef.current.value;
        const address = addressRef.current.value;
        const phone = phoneRef.current.value;
        const email = emailRef.current.value;
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        if (!firstName || !lastName || !address || !phone || !email || !role || !username || !password) {
            toast('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!phone.match(phonePattern)) {
            toast('Số điện thoại không hợp lệ');
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email.match(emailPattern)) {
            toast('Email không hợp lệ');
            return;
        }
        if (idItem === 0) {
            const userData = {
                firstname: firstName,
                lastname: lastName,
                phone: phone,
                email: email,
                address: address,
                username: username,
                password: password,
                idRole: role,
            };

            axios.post(`${API_URL}/api/users`, userData).then((response) => {
                if (response.status === 201) {
                    clickSetVisible();
                    toast('Thêm mới dữ liệu thành công');
                    setIsReload(!isReload);
                } else {
                    toast('Lỗi khi thêm mới người dùng');
                }
            });

        }
        else {
            const updatedInfo = {
                firstname: firstName,
                lastname: lastName,
                phone: phone,
                email: email,
                address: address,
                username: username,
                password: password,
                idRole: role,
            };
            axios.put(`${API_URL}/api/users/${idItem}`, updatedInfo).then((response) => {
                if (response.status === 200) {
                    clickSetVisible();
                    toast(`Cập nhật dữ liệu thành công`);
                    setIsReload(!isReload);
                } else {
                    toast('Lỗi khi cập nhật thông tin người dùng');
                }
            });
            setIdItem(0);
        }
    };

    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(users.length / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    }

    const getData = (current, pageSize) => {
        return users.slice((current - 1) * pageSize, current * pageSize);
    };

    const PaginationChange = (page, pageSize) => {
        setCurrent(page);
        setSize(pageSize)
    }

    const PrevNextArrow = (current, type, originalElement) => {
        if (type === 'prev') {
            return <button><i className="fa fa-angle-double-left"></i></button>;
        }
        if (type === 'next') {
            return <button><i className="fa fa-angle-double-right"></i></button>;
        }
        return originalElement;
    }

    return (
        <>
            <div className="container-fluid mt-5 mb-5">
                {role1 === "admin" ?
                    <>
                        <div className="row justify-content-center">
                            <div className="col-md-10">
                                <div className="card">
                                    <div className="card-body p-0">

                                        <div className="table-filter-info">
                                            <h1>QUẢN LÍ NGƯỜI DÙNG</h1>
                                            {isVisible ? (
                                                <>
                                                    <div className="mt-3 row">
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label>Họ <b style={{ color: "red" }}>*</b></label>
                                                                <input type="text" className="form-control" id="test" ref={firstNameRef} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Số điện thoại <b style={{ color: "red" }}>*</b></label>
                                                                <input type="tel" className="form-control" ref={phoneRef} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Quyền <b style={{ color: "red" }}>*</b></label>
                                                                <select className="form-control" value={role} onChange={(e) => {
                                                                    setRole(e.target.value);
                                                                }}>
                                                                    {roles.map(role => (
                                                                        <option key={role._id} value={role._id}>{role.roleName}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Tên đăng nhập <b style={{ color: "red" }}>*</b></label>
                                                                <input type="text" className="form-control" ref={usernameRef} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label>Tên <b style={{ color: "red" }}>*</b></label>
                                                                <input type="text" className="form-control" ref={lastNameRef} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Địa chỉ <b style={{ color: "red" }}>*</b></label>
                                                                <input type="text" className="form-control" ref={addressRef} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Email <b style={{ color: "red" }}>*</b></label>
                                                                <input type="email" className="form-control" ref={emailRef} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Mật khẩu <b style={{ color: "red" }}>*</b></label>
                                                                <input type="password" className="form-control" ref={passwordRef} autoComplete="password" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) :
                                                <button type="button" className="btn btn-outline-primary" onClick={clickSetVisible}>Thêm mới</button>
                                            }
                                            {isVisible && <div className="form-group">
                                                <button type="button" className="btn btn-outline-success mr-3" onClick={clickBtnAdd_Edit}>Thực thi</button>
                                                <button type="button" className="btn btn-outline-warning" onClick={clickSetVisible}>Hủy</button>
                                            </div>}
                                            <Pagination
                                                className="pagination-data"
                                                showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                                                onChange={PaginationChange}
                                                total={users.length}
                                                current={current}
                                                pageSize={size}
                                                showSizeChanger={false}
                                                itemRender={PrevNextArrow}
                                                onShowSizeChange={PerPageChange}
                                            />
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-text-small mb-0">
                                                <thead className="thead-primary table-sorting">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Name</th>
                                                        <th>Phone</th>
                                                        <th>Email</th>
                                                        <th>Address</th>
                                                        <th>Role</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getData(current, size).map((user, index) => {
                                                        return (
                                                            <tr key={user._id}>
                                                                <td>{index + 1}</td>
                                                                <td>{user.firstname} {user.lastname}</td>
                                                                <td>{user.phone}</td>
                                                                <td>{user.email}</td>
                                                                <td>{user.address}</td>
                                                                <td>{user.idRole.roleName}</td>
                                                                <td>
                                                                    <button className="btn btn-warning" onClick={() => handleClickEdit(user._id)}>Sửa</button>
                                                                    <button className="btn btn-danger ml-2" onClick={() => handleClickDelete(user._id)}>Xóa</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="table-filter-info">

                                            <Pagination
                                                className="pagination-data"
                                                showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                                                onChange={PaginationChange}
                                                total={users.length}
                                                current={current}
                                                pageSize={size}
                                                showSizeChanger={false}
                                                itemRender={PrevNextArrow}
                                                onShowSizeChange={PerPageChange}
                                            />                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    : <h2>Không có quyền truy cập</h2>
                }
            </div>

            <ToastContainer />
        </>
    );

}

export default ManageUser;