import React, { useState, useRef, useEffect } from "react";
import '../../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../config';
import axios from 'axios';
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function ManageRating() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    if (!isLoggedIn && role !== "admin") {
        window.location.href = '/';
    }

    const [isReload, setIsReload] = useState(false);

    const [datas, setDatas] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);

    const [user, setUser] = useState('All');
    const [product, setProduct] = useState('All');

    useEffect(() => {
        axios.get(`${API_URL}/api/ratings/getByUser_Product/${user}/${product}`)
            .then(response => {
                setDatas(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [isReload]);

    useEffect(() => {
        axios.get(`${API_URL}/api/products`)
            .then(response => {
                setProducts(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
        axios.get(`${API_URL}/api/users`)
            .then(response => {
                setUsers(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const handleClickDelete = async (id) => {
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa đánh giá sản phẩm?",
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
            const response = await axios.delete(`${API_URL}/api/ratings/${id}`);
            if (response.status === 200) {
                setIsReload(!isReload);
                toast('Xóa dữ liệu thành công');
            } else {
                toast('Lỗi khi xóa đánh giá sản phẩm');
            }
        } catch (error) {
            console.log(error);
            toast('Lỗi khi gọi API deleteProduct:' + error);
        }
    };
    const handleCancelDelete = () => {

    }
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(datas.length / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    }

    const getData = (current, pageSize) => {
        return datas.slice((current - 1) * pageSize, current * pageSize);
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
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    return (
        <>
            <div className="container-fluid mt-5 mb-5">
                {role === "admin" ?
                    <>
                        <div className="row justify-content-center">
                            <div className="col-md-10">
                                <div className="card">
                                    <div className="card-body p-0">

                                        <div className="table-filter-info">
                                            <h1>QUẢN LÍ ĐÁNH GIÁ</h1>
                                            <Pagination
                                                className="pagination-data"
                                                showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                                                onChange={PaginationChange}
                                                total={datas.length}
                                                current={current}
                                                pageSize={size}
                                                showSizeChanger={false}
                                                itemRender={PrevNextArrow}
                                                onShowSizeChange={PerPageChange}
                                            />
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Người dùng</label>
                                                        <select className="form-control" value={user} onChange={e => {
                                                            setUser(e.target.value);
                                                            setIsReload(!isReload);
                                                        }}>
                                                            <option value="All">Tất cả</option>
                                                            {
                                                                users.map(data => (
                                                                    <option key={data._id} value={data._id}>{data.firstname + " " + data.lastname}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Sản phẩm</label>
                                                        <select className="form-control" value={product} onChange={e => {
                                                            setProduct(e.target.value);
                                                            setIsReload(!isReload);
                                                        }}>
                                                            <option value="All">Tất cả</option>
                                                            {
                                                                products.map(data => (
                                                                    <option key={data._id} value={data._id}>{data.product_name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-text-small mb-0">
                                                <thead className="thead-primary table-sorting">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Tên người dùng</th>
                                                        <th>Nội dung</th>
                                                        <th>Ngày tạo</th>
                                                        <th>Xếp hạng</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        getData(current, size).map((data, index) => {
                                                            return (
                                                                <tr key={data._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{data.user_id.firstname + " " + data.user_id.lastname}</td>
                                                                    <td>{data.comment}</td>
                                                                    <td>{formatDate(data.created_at)}</td>
                                                                    <td>{data.rating}</td>
                                                                    <td>
                                                                        <button className="btn btn-danger ml-2" onClick={() => handleClickDelete(data._id)}>Xóa</button>
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
                                                total={datas.length}
                                                current={current}
                                                pageSize={size}
                                                showSizeChanger={false}
                                                itemRender={PrevNextArrow}
                                                onShowSizeChange={PerPageChange}
                                            />
                                        </div>
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

export default ManageRating;