import React, { useState, useRef, useEffect } from "react";
import '../../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../../config';
import axios from 'axios';
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { v4 as uuidv4 } from 'uuid';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ManageProduct() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    if (!isLoggedIn && role !== "admin") {
        window.location.href = '/';
    }
    const [isVisible, setVisible] = useState(false);
    const [idItem, setIdItem] = useState(0);
    const [isReload, setIsReload] = useState(false);
    const productNameRef = useRef(null);
    const priceRef = useRef(null);
    const descriptionRef = useRef(null);
    const imagesRef = useRef(null);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');

    const [categories, setCategories] = useState([]);
    const [categoryItems, setCategoryItems] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [products, setProducts] = useState([]);
    const [divColors_Sizes, setDivColors_Sizes] = useState([]);
    const [selectSizes, setSelectSizes] = useState([]);
    const [selectColors, setSelectColors] = useState([]);
    const [selectQuantitys, setSelectQuantitys] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [images, setImages] = useState([]);

    const [show, setShow] = useState(false);
    const [contentDetail, setContentDetail] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/api/categories`)
            .then(response => {
                setCategory(response.data[0]._id);
                setCategories(response.data);
            })
            .catch(() => {
            });
        axios.get(`${API_URL}/api/subcategories/0`)
            .then(response => {
                setSubCategory(response.data[0]._id);
                setCategoryItems(response.data);
            })
            .catch(() => {
            });
        axios.get(`${API_URL}/api/colors`)
            .then(response => setColors(response.data))
            .catch(() => {
            });
        axios.get(`${API_URL}/api/sizes`)
            .then(response => setSizes(response.data))
            .catch(() => {
            });
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/api/products`)
            .then((response) => setProducts(response.data))
            .catch(() => {
            });
    }, [isReload]);

    const handleClose = () => setShow(false);

    const handleShowInventoryDetails = (id) => {
        setShow(true);
        axios.get(`${API_URL}/api/productsizecolors/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    var orderDetail = response.data;
                    console.log(orderDetail);
                    var n = 1;
                    var html = '';
                    html += '<table class="table">'
                    html += '<thead>'
                    html += '<tr>'
                    html += '<th>#</th>'
                    html += '<th>Màu sắc</th>'
                    html += '<th>Kích thước</th>'
                    html += '<th>Số lượng</th>'
                    html += '</tr>'
                    html += '</thead>'
                    html += '<tbody>'
                    orderDetail.forEach((item) => {
                        html += '<tr>'
                        html += '<td>' + n + '</td>'
                        html += '<td>' + item.color_id.color_name + '</td>'
                        html += '<td>' + item.size_id.size_name + '</td>'
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

    const handleClickEdit = async (id) => {
        await axios.get(`${API_URL}/api/products/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setVisible(true);
                    setTimeout(() => {
                        const { _id, product_name, price, description, category_id, subcategory_id } = response.data;

                        axios.get(`${API_URL}/api/subcategories/${category_id}`)
                            .then(response => setCategoryItems(response.data))
                            .catch(() => {
                            });
                        productNameRef.current.value = product_name;
                        priceRef.current.value = price;
                        descriptionRef.current.value = description;
                        setCategory(category_id);
                        setSubCategory(subcategory_id);

                        const newDivColors_Sizes = [];
                        const selectColors = [];
                        const selectQuantitys = [];
                        const selectSizes = [];

                        axios.get(`${API_URL}/api/productsizecolors/${_id}`)
                            .then((response) => {
                                if (response.status === 200) {
                                    const productsizecolors = response.data;

                                    productsizecolors.forEach((size, index) => {
                                        const newSize = {
                                            color: size.color_id.color_name,
                                            size: size.size_id.size_name,
                                            quantity: size.quantity
                                        };
                                        selectColors.push(size.color_id._id);
                                        selectSizes.push(size.size_id._id);
                                        selectQuantitys.push(size.quantity);
                                        newDivColors_Sizes.push(newSize);
                                    });
                                    setDivColors_Sizes(newDivColors_Sizes);
                                    setSelectColors(selectColors);
                                    setSelectSizes(selectSizes);
                                    setSelectQuantitys(selectQuantitys);
                                } else {
                                    toast('Lỗi khi lấy thông tin');
                                }
                            })
                            .catch(() => {
                            });
                    });

                    setIdItem(id);
                } else {
                    toast('Lỗi khi lấy thông tin sản phẩm');
                }
            })
            .catch(() => {
            });
        await axios.get(`${API_URL}/api/products/${id}/images`)
            .then(response => { setImages(response.data); })
            .catch(() => {
            });
    };

    const handleClickDelete = async (id) => {
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa thông tin sản phẩm?",
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
            const response = await axios.delete(`${API_URL}/api/products/${id}`);
            if (response.status === 200) {
                toast('Xóa dữ liệu thành công');
                setVisible(false);
                setIsReload(!isReload);
            } else {
                toast('Lỗi khi xóa sản phẩm');
            }
        } catch (error) {
            toast('Lỗi khi gọi API deleteProduct:', error);
        }
    };

    const handleCancelDelete = () => {
    };

    const clickSetVisible = () => {
        setDivColors_Sizes([{ color: '', size: '', quantity: 1 }]);
        setSelectColors([]);
        setSelectSizes([]);
        setSelectQuantitys([]);
        setIdItem(0);
        setVisible(!isVisible);
        setImages([]);
    }

    const clickBtnAdd_Edit = () => {
        const productName = productNameRef.current.value;
        const price = priceRef.current.value;
        const description = descriptionRef.current.value;
        const images = imagesRef.current.value;

        if (!productName || !price || !description) {
            toast('Vui lòng điền đầy đủ thông tin');
            return;
        }
        if (price < 0) {
            toast('Vui lòng nhập giá tiền hợp lệ');
            return;
        }
        var color_size = [];
        divColors_Sizes.map((size, index) => (
            color_size.push({ color: document.getElementById("color" + index).value, size: document.getElementById("size" + index).value, quantity: document.getElementById("quantity" + index).value })
        ));

        if (idItem === 0) {

            if (selectedImages.length < 2) {
                toast('Vui lòng chọn ít nhất 2 hình ảnh');
                return;
            }

            const formData = new FormData();

            formData.append('name', productName);
            formData.append('price', price);
            formData.append('description', description);

            for (const image of selectedImages) {
                formData.append('images', image);
            }

            formData.append('subcategory_id', subCategory);

            formData.append('color_size', JSON.stringify(color_size));

            axios.post(`${API_URL}/api/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        clickSetVisible();
                        toast('Thêm mới dữ liệu thành công');
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi thêm mới sản phẩm');
                    }
                })
                .catch(() => {
                });

        }
        else {
            const formData = new FormData();

            formData.append('name', productName);
            formData.append('price', price);
            formData.append('description', description);

            for (const image of selectedImages) {
                formData.append('images', image);
            }

            formData.append('subcategory_id', subCategory);

            formData.append('color_size', JSON.stringify(color_size));

            axios.put(`${API_URL}/api/products/${idItem}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        clickSetVisible();
                        toast(`Cập nhật dữ liệu thành công`);
                        setIsReload(!isReload);
                    } else {
                        toast('Lỗi khi cập nhật thông tin sản phẩm');
                    }
                })
                .catch(() => {
                });
            setIdItem(0);
        }
    };

    const clickBtnAdd_Div_Color_Size = () => {
        const newSize = { color: '', size: '', quantity: 1 };
        setDivColors_Sizes([...divColors_Sizes, newSize]);
    }

    const clickBtnRemove_Div_Color_Size = (index) => {
        const newSizes = [...divColors_Sizes];
        newSizes.splice(index, 1);
        setDivColors_Sizes(newSizes);
    };

    const handleFileChange = (e) => {
        setSelectedImages(e.target.files);
    };

    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(products.length / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    }

    const getData = (current, pageSize) => {
        return products.slice((current - 1) * pageSize, current * pageSize);
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

    const deleteImage = (id) => {
        if (images.length == 2) {
            toast('Mỗi sản phẩm phải có ít nhất 2 hình ảnh');
            return;
        }
        confirmAlert({
            title: "Xác nhận xóa",
            message: "Bạn muốn xóa hình ảnh sản phẩm?",
            buttons: [
                {
                    label: 'Xác nhận',
                    onClick: () => {
                        axios.delete(`${API_URL}/api/images/${id}`)
                            .then((response) => {
                                if (response.status === 200) {
                                    toast('Xóa hình ảnh thành công');
                                    setImages(response.data.images);
                                } else {
                                    toast('Lỗi khi xóa hình ảnh');
                                }
                            })
                            .catch((e) => {
                                toast(e.response.data.message);
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
                                                                <label>Tên sản phẩm <b style={{ color: "red" }}>*</b></label>
                                                                <input type="text" className="form-control" ref={productNameRef} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Danh mục <b style={{ color: "red" }}>*</b></label>
                                                                <select className="form-control" value={category} onChange={(e) => {
                                                                    setCategory(e.target.value);
                                                                    axios.get(`${API_URL}/api/subcategories/${e.target.value}`)
                                                                        .then(response => {
                                                                            setCategoryItems(response.data);
                                                                            setSubCategory(response.data[0]._id);
                                                                        })
                                                                        .catch(() => {
                                                                        });
                                                                }}>
                                                                    {categories.map(category => (
                                                                        <option key={category._id} value={category._id}>{category.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Mô tả <b style={{ color: "red" }}>*</b></label>
                                                                <textarea type="text" className="form-control" ref={descriptionRef} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label>Giá <b style={{ color: "red" }}>*</b></label>
                                                                <input type="number" min='1' className="form-control" ref={priceRef} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Danh mục con <b style={{ color: "red" }}>*</b></label>
                                                                <select className="form-control" value={subCategory} onChange={e => {
                                                                    setSubCategory(e.target.value);
                                                                }}>
                                                                    {categoryItems.map(categoryItem => (
                                                                        <option key={categoryItem._id} value={categoryItem._id}>{categoryItem.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Hình ảnh
                                                                    {
                                                                        idItem == 0 && <b style={{ color: "red" }}>*</b>
                                                                    }
                                                                </label>
                                                                <input type="file" multiple className="form-control" ref={imagesRef} onChange={handleFileChange} />
                                                            </div>
                                                            <div className="form-group row">
                                                                {idItem !== 0 && images.map(image => (
                                                                    <div key={image._id}>
                                                                        <img style={{ width: '100px' }}
                                                                            src={API_URL + image.image_url}
                                                                        />
                                                                        <a className="btn btn-danger ml-2" style={{ cursor: 'pointer' }} onClick={() => deleteImage(image._id)}>Xóa</a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <label>Màu sắc - Kích thước <b style={{ color: "red" }}>*</b></label>
                                                            {divColors_Sizes.map((size, index) => (
                                                                <div className="form-group" key={uuidv4()}>
                                                                    <div className="row">
                                                                        <div className="col-md-3">
                                                                            <select id={`color${index}`} className="form-control" value={selectColors[index] || (colors.length > 0 ? colors[0]._id : '')} onChange={(e) => {
                                                                                const newColor = [...selectColors];
                                                                                newColor[index] = e.target.value;
                                                                                setSelectColors(newColor);
                                                                            }}>
                                                                                {colors.map(color => (
                                                                                    <option key={color._id} value={color._id}>{color.color_name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-md-3">
                                                                            <select id={`size${index}`} className="form-control" value={selectSizes[index] || (sizes.length > 0 ? sizes[0]._id : '')} onChange={(e) => {
                                                                                const newSizes = [...selectSizes];
                                                                                newSizes[index] = e.target.value;
                                                                                setSelectSizes(newSizes);
                                                                            }}>
                                                                                {sizes.map(size => (
                                                                                    <option key={size._id} value={size._id}>{size.size_name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <input id={`quantity${index}`} className="form-control"
                                                                                type="number"
                                                                                value={selectQuantitys[index] || size.quantity}
                                                                                onChange={(e) => {
                                                                                    const newQuantity = [...selectQuantitys];
                                                                                    newQuantity[index] = e.target.value;
                                                                                    setSelectQuantitys(newQuantity);
                                                                                }}
                                                                                min='1'
                                                                                placeholder="Số lượng"
                                                                            />
                                                                        </div>
                                                                        <div className="col-md-2">
                                                                            {
                                                                                index !== 0 && <button className="btn btn-danger mr-2" onClick={() => clickBtnRemove_Div_Color_Size(index)}>-</button>
                                                                            }
                                                                            <button className="btn btn-primary" onClick={clickBtnAdd_Div_Color_Size}>+</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
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
                                                total={products.length}
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
                                                        <th>Category</th>
                                                        <th>SubCategory</th>
                                                        <th>Price</th>
                                                        <th>Description</th>
                                                        <th>Image</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        getData(current, size).map((data, index) => {
                                                            return (
                                                                <tr key={data._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{data.product_name}</td>
                                                                    <td>{data.category_name}</td>
                                                                    <td>{data.subcategory_name}</td>
                                                                    <td>{formattedPrice(data.price)}</td>
                                                                    <td>{data.description}</td>
                                                                    <td>
                                                                        <img src={API_URL + data.url_image1} style={{ width: "100px" }} />
                                                                    </td>
                                                                    <td>
                                                                        <button className="btn btn-warning" onClick={() => handleClickEdit(data._id)}>Sửa</button>
                                                                        <button className="btn btn-danger ml-2" onClick={() => handleClickDelete(data._id)}>Xóa</button>
                                                                        <button className="btn btn-success ml-2" onClick={() => handleShowInventoryDetails(data._id)}>Tồn kho</button>
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
                                                total={products.length}
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
                                <Modal.Title>Chi tiết tồn kho</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><div dangerouslySetInnerHTML={{ __html: contentDetail }} /></Modal.Body>
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

export default ManageProduct;