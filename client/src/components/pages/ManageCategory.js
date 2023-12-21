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

function ManageCategory() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    if (!isLoggedIn && role !== "admin") {
        window.location.href = '/';
    }
    const [isVisible, setVisible] = useState(false);
    const [isVisibleSub, setVisibleSub] = useState(false);
    const [idItem, setIdItem] = useState(0);
    const [idItemSub, setIdItemSub] = useState(0);
    const [isReload, setIsReload] = useState(false);
    const categoryNameRef = useRef(null);
    const subCategoryNameRef = useRef(null);

    const [show, setShow] = useState(false);

    const [datas, setDatas] = useState([]);
    const [dataSub, setDataSub] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/categories`)
            .then(response => {
                setDatas(response.data);
            })
            .catch(() => {
            });
    }, [isReload]);

    const handleClickEdit = async (id) => {
        await axios.get(`${API_URL}/api/categories/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setVisible(true);
                    setTimeout(() => {
                        const { name } = response.data.category;

                        categoryNameRef.current.value = name;
                    });

                    setIdItem(id);
                } else {
                    toast('Lỗi khi lấy thông tin danh mục');
                }
            })
            .catch(() => {
            });
    };

    const handleClickDelete = async (id) => {
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa thông tin danh mục?",
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
            const response = await axios.delete(`${API_URL}/api/categories/${id}`);
            if (response.status === 200) {
                toast('Xóa dữ liệu thành công');
                window.location.href = '/manage-category';
            } else {
                toast('Lỗi khi xóa danh mục');
            }
        } catch (error) {
            console.log(error);
            toast('Lỗi khi gọi API deleteProduct:' + error);
        }
    };

    const handleCancelDelete = () => {
    };

    const clickSetVisible = () => {
        setIdItem(0);
        setVisible(!isVisible);
    }

    const clickSetVisible_Sub = () => {
        setIdItemSub(0);
        setVisibleSub(!isVisibleSub);
    }

    const clickBtnAdd_Edit = () => {
        const categoryName = categoryNameRef.current.value;

        if (!categoryName) {
            toast('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const updatedInfo = {
            categoryName: categoryName
        };

        if (idItem === 0) {
            axios.post(`${API_URL}/api/categories`, updatedInfo)
                .then((response) => {
                    if (response.status === 201) {
                        clickSetVisible();
                        toast('Thêm mới dữ liệu thành công');
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi thêm mới danh mục');
                    }
                })
                .catch((e) => {
                    toast(e.response.data.message);
                });

        }
        else {
            axios.put(`${API_URL}/api/categories/${idItem}`, updatedInfo).then((response) => {
                if (response.status === 200) {
                    clickSetVisible();
                    toast(`Cập nhật dữ liệu thành công`);
                    setIsReload(!isReload);
                } else {
                    toast('Lỗi khi cập nhật thông tin danh mục');
                }
            })
                .catch((e) => {
                    toast(e.response.data.message);
                });
            setIdItem(0);
        }
    };

    const handleClickSub = async (id) => {
        await axios.get(`${API_URL}/api/subcategories/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setIdItem(id);
                    setTimeout(() => {
                        setDataSub(response.data);
                    });
                    setShow(true);
                } else {
                    toast('Lỗi khi lấy thông tin danh mục');
                }
            })
            .catch(() => {
            });
    }

    const handleClickEditSub = async (id) => {
        await axios.get(`${API_URL}/api/subcategories/Sub/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setVisibleSub(true);
                    setTimeout(() => {
                        const { name } = response.data.subcategory;

                        subCategoryNameRef.current.value = name;
                    });

                    setIdItemSub(id);
                } else {
                    toast('Lỗi khi lấy thông tin danh mục con');
                }
            })
            .catch(() => {
            });
    };

    const clickBtnAdd_Edit_Sub = () => {
        const subCategoryName = subCategoryNameRef.current.value;

        if (!subCategoryName) {
            toast('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const updatedInfo = {
            subCategoryName: subCategoryName,
            category_id: idItem
        };

        if (idItemSub === 0) {
            axios.post(`${API_URL}/api/subcategories`, updatedInfo)
                .then((response) => {
                    if (response.status === 201) {
                        setVisibleSub(false);
                        toast('Thêm mới dữ liệu thành công');
                        handleClickSub(idItem);
                    } else {
                        toast('Lỗi khi thêm mới danh mục con');
                    }
                })
                .catch((e) => {
                    toast(e.response.data.message);
                });

        }
        else {

            axios.put(`${API_URL}/api/subcategories/${idItemSub}`, updatedInfo).then((response) => {
                if (response.status === 200) {
                    setVisibleSub(false);
                    toast(`Cập nhật dữ liệu thành công`);
                    handleClickSub(idItem);
                } else {
                    toast('Lỗi khi cập nhật thông tin danh mục con');
                }
            })
                .catch((e) => {
                    toast(e.response.data.message);
                });
            setIdItemSub(0);
        }
    };

    const handleClickDeleteSub = async (id) => {
        setShow(false);
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa thông tin danh mục con?",
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => handleConfirmDeleteSub(id)
                },
                {
                    label: 'Hủy',
                    onClick: () => handleCancelDeleteSub()
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

    const handleConfirmDeleteSub = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/api/subcategories/${id}`);
            if (response.status === 200) {
                setVisibleSub(false);
                toast('Xóa dữ liệu thành công');
                handleClickSub(idItem);
            } else {
                toast('Lỗi khi xóa danh mục con');
            }
        } catch (error) {
            console.log(error);
            toast('Lỗi khi gọi API deleteProduct:' + error);
        }
    };

    const handleCancelDeleteSub = () => {
    };

    const handleClose = () => {
        setShow(false);
        setVisibleSub(false);
    };

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
                                            {isVisible ? (
                                                <>
                                                    <div className="mt-3 row">
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label>Tên danh mục <b style={{ color: "red" }}>*</b></label>
                                                                <input type="text" className="form-control" ref={categoryNameRef} />
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
                                                total={datas.length}
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
                                                        <th>Tên danh mục</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        getData(current, size).map((data, index) => {
                                                            return (
                                                                <tr key={data._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{data.name}</td>
                                                                    <td>
                                                                        <button className="btn btn-warning" onClick={() => handleClickEdit(data._id)}>Sửa</button>
                                                                        <button className="btn btn-danger ml-2" onClick={() => handleClickDelete(data._id)}>Xóa</button>
                                                                        <button className="btn btn-success ml-2" onClick={() => handleClickSub(data._id)}>Sub</button>
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

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header>
                                <Modal.Title>DANH MỤC CON</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {isVisibleSub ? (
                                    <>
                                        <div className="mt-3 row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Tên danh mục con <b style={{ color: "red" }}>*</b></label>
                                                    <input type="text" className="form-control" ref={subCategoryNameRef} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) :
                                    <button type="button" className="btn btn-outline-primary mb-2" onClick={clickSetVisible_Sub}>Thêm mới</button>
                                }
                                {isVisibleSub &&
                                    <div className="form-group mb-2">
                                        <button type="button" className="btn btn-outline-success mr-3" onClick={clickBtnAdd_Edit_Sub}>Thực thi</button>
                                        <button type="button" className="btn btn-outline-warning" onClick={clickSetVisible_Sub}>Hủy</button>
                                    </div>
                                }
                                <div className="table-responsive">
                                    <table className="table table-text-small mb-0">
                                        <thead className="thead-primary table-sorting">
                                            <tr>
                                                <th>#</th>
                                                <th>Tên danh mục con</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dataSub.map((data, index) => {
                                                    return (
                                                        <tr key={data._id}>
                                                            <td>{index + 1}</td>
                                                            <td>{data.name}</td>
                                                            <td>
                                                                <button className="btn btn-warning" onClick={() => handleClickEditSub(data._id)}>Sửa</button>
                                                                <button className="btn btn-danger ml-2" onClick={() => handleClickDeleteSub(data._id)}>Xóa</button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>
                    : <h2>Không có quyền truy cập</h2>
                }
            </div>

            <ToastContainer />
        </>
    );

}

export default ManageCategory;