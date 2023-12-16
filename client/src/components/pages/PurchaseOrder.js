import React, { useState, useRef, useEffect } from "react";
import '../../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../config';
import axios from 'axios';
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function PurchaseOrder() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const user_id = localStorage.getItem('user_id');
    if (!isLoggedIn) {
        window.location.href = '/';
    }
    const [show, setShow] = useState(false);
    const [contentDetail, setContentDetail] = useState('');
    const [isReload, setIsReload] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/users/${user_id}/orders`)
            .then((response) => setOrders(response.data))
            .catch(() => {
            });
    }, [isReload]);

    const handleClose = () => setShow(false);

    const handleShowDetail = (id) => {
        setShow(true);
        axios.get(`${API_URL}/api/orders/${id}/items`)
            .then((response) => {
                if (response.status === 200) {
                    var orderDetail = response.data;
                    var n = 1;
                    var html = '';
                    html += '<table class="table">'
                    html += '<thead>'
                    html += '<tr>'
                    html += '<th>#</th>'
                    html += '<th>Tên sản phẩm</th>'
                    html += '<th>Hình ảnh</th>'
                    html += '<th>Màu sắc</th>'
                    html += '<th>Kích thước</th>'
                    html += '<th>Giá</th>'
                    html += '<th>Số lượng</th>'
                    html += '</tr>'
                    html += '</thead>'
                    html += '<tbody>'
                    orderDetail.forEach((item) => {
                        html += '<tr>'
                        html += '<td>' + n + '</td>'
                        html += '<td>' + item.product_id.name + '</td>'
                        html += '<td><img style="width: 100px;" src="' + (API_URL + item.product_id.url_image1) + '"/></td>'
                        html += '<td>' + item.color + '</td>'
                        html += '<td>' + item.size + '</td>'
                        html += '<td>' + formattedPrice(item.product_id.price) + '</td>'
                        html += '<td>' + item.quantity + '</td>'
                        html += '</tr>'
                        n++;
                    });
                    html += '</tbody>'
                    html += '</table>'
                    setContentDetail(html);
                } else {
                    toast('Lỗi khi lấy thông tin đơn hàng chi tiết');
                }
            })
            .catch(() => {
            });
    }

    const changeStatus = (id) => {
        confirmAlert({
            title: "Xác nhận",
            message: "Bạn muốn hủy đơn hàng?",
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        axios.put(`${API_URL}/api/orders/${id}/Hủy đơn`)
                            .then((response) => {
                                setIsReload(!isReload);
                            })
                            .catch(() => {
                            });
                    }
                },
                {
                    label: 'Hủy'
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

    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(orders.length / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    }

    const getData = (current, pageSize) => {
        return orders.slice((current - 1) * pageSize, current * pageSize);
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

    const formattedPrice = (price) => {
        const priceAsNumber = parseFloat(price);
        if (!isNaN(priceAsNumber)) {
            const formattedPrice = priceAsNumber.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            return formattedPrice;
        }
        return "";
    }

    return (
        <>
            <div className="container-fluid mt-5 mb-5">
                <>
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            <div className="card">
                                <div className="card-body p-0">

                                    <div className="table-filter-info">
                                        <h1>ĐƠN HÀNG CỦA BẠN</h1>
                                        <Pagination
                                            className="pagination-data"
                                            showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                                            onChange={PaginationChange}
                                            total={orders.length}
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
                                                    <th>Tên người mua</th>
                                                    <th>Ngày mua</th>
                                                    <th>Ghi chú</th>
                                                    <th>Trạng thái</th>
                                                    <th>Tổng tiền</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getData(current, size).map((order, index) => {
                                                    return (
                                                        <tr key={order._id}>
                                                            <td>{index + 1}</td>
                                                            <td>{order.user_id.firstname} {order.user_id.lastname}</td>
                                                            <td>{formatDate(order.order_date)}</td>
                                                            <td>{order.note}</td>
                                                            <td>{order.status}</td>
                                                            <td>{formattedPrice(order.total_price)}</td>
                                                            <td>
                                                                <button className="btn btn-success" onClick={() => handleShowDetail(order._id)}>Chi tiết</button>
                                                                {
                                                                    order.status === 'Chờ xác nhận' && <button className="btn btn-danger ml-2" onClick={() => changeStatus(order._id)}>Hủy đơn</button>
                                                                }
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
                                            total={orders.length}
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
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body><div dangerouslySetInnerHTML={{ __html: contentDetail }} /></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />
        </>
    );

}

export default PurchaseOrder;