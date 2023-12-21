import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '../../config';
import axios from 'axios';
import { useParams } from "react-router";
import Pagination from "https://cdn.skypack.dev/rc-pagination@3.1.15";

function Collection() {
    let { name, category } = useParams();

    const [dataByCategory, setDataByCategory] = useState([]);
    useEffect(() => {
        if (!category) {
            axios.get(`${API_URL}/api/categories/${name}/manual/products`)
                .then((response) => {
                    setDataByCategory(response.data);
                })
                .catch(() => {
                });
        }
        else {
            axios.get(`${API_URL}/api/subcategories/${name}/manual/products`)
                .then((response) => {
                    setDataByCategory(response.data);
                })
                .catch(() => {
                });
        }

    }, []);

    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);

    const PerPageChange = (value) => {
        setSize(value);
        const newPerPage = Math.ceil(dataByCategory.length / value);
        if (current > newPerPage) {
            setCurrent(newPerPage);
        }
    }

    const getData = (current, pageSize) => {
        return dataByCategory.slice((current - 1) * pageSize, current * pageSize);
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
        <main className="mainContent-theme ">
            <div id="collection" className="collection-page">
                <div className="main-content">
                    <div className="breadcrumb-shop">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pd5  ">
                                    <ol
                                        className="breadcrumb breadcrumb-arrows"
                                        itemScope=""
                                        itemType="http://schema.org/BreadcrumbList"
                                    >
                                        <li
                                            itemProp="itemListElement"
                                            itemScope=""
                                            itemType="http://schema.org/ListItem"
                                        >
                                            <a href="/" target="_self" itemProp="item">
                                                <span itemProp="name">Trang chủ</span>
                                            </a>
                                            <meta itemProp="position" content={1} />
                                        </li>
                                        {
                                            category &&
                                            <li
                                                itemProp="itemListElement"
                                                itemScope=""
                                                itemType="http://schema.org/ListItem"
                                            >
                                                <a href={"/collection/" + category} target="_self" itemProp="item">
                                                    <span itemProp="name">{category}</span>
                                                </a>
                                                <meta itemProp="position" content={1} />
                                            </li>
                                        }
                                        <li
                                            className="active"
                                            itemProp="itemListElement"
                                            itemScope=""
                                            itemType="http://schema.org/ListItem"
                                        >
                                            <span
                                                itemProp="item"
                                            >
                                                <span itemProp="name">{name}</span>
                                            </span>
                                            <meta itemProp="position" content={3} />
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="listing-collection-body">
                        <div className="container">
                            <div className="row">
                                {dataByCategory.length > 0 ?
                                    <div id="collection-body" className="wrap-collection-body clearfix">
                                        <div className="col-md-12 col-sm-12 col-xs-12">
                                            <div className="wrap-collection-title">
                                                <div className="heading-collection row">
                                                    <div className="col-md-8 col-sm-12 col-xs-12">
                                                        <h1 className="title">{name}</h1>
                                                        <div className="alert-no-filter" />
                                                    </div>
                                                    <div className="col-md-4 hidden-sm hidden-xs">
                                                        <div className="option browse-tags">
                                                            <label className="lb-filter hide">Sắp xếp theo:</label>
                                                            <span className="custom-dropdown custom-dropdown--grey">
                                                                <select className="sort-by custom-dropdown__select" onChange={(e) => {
                                                                    if (!category) {
                                                                        axios.get(`${API_URL}/api/categories/${name}/${e.target.value}/products`)
                                                                            .then((response) => {
                                                                                setDataByCategory(response.data);
                                                                            })
                                                                            .catch(() => {
                                                                            });
                                                                    }
                                                                    else {
                                                                        axios.get(`${API_URL}/api/subcategories/${name}/${e.target.value}/products`)
                                                                            .then((response) => {
                                                                                setDataByCategory(response.data);
                                                                            })
                                                                            .catch(() => {
                                                                            });
                                                                    }
                                                                }}>
                                                                    <option value="manual">Sản phẩm mới nhất</option>
                                                                    <option value="price-ascending">Giá: Tăng dần</option>
                                                                    <option value="price-descending">Giá: Giảm dần</option>
                                                                    <option value="title-ascending">Tên: A-Z</option>
                                                                    <option value="title-descending">Tên: Z-A</option>
                                                                </select>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="content-product-list product-list filter clearfix row">
                                                    {
                                                        getData(current, size).map((data, index) => {
                                                            return (
                                                                <div key={data._id} className="col-md-3 col-sm-6 col-xs-6 pro-loop">
                                                                    <div
                                                                        className="product-block product-resize"
                                                                        data-anmation={index}
                                                                    >
                                                                        <div className="product-img">
                                                                            <a
                                                                                href={`/detail/${data._id}`}
                                                                                className="image-resize"
                                                                            >
                                                                                <picture>
                                                                                    <img
                                                                                        className="img-loop"
                                                                                        src={API_URL + data.url_image1}
                                                                                    />
                                                                                </picture>
                                                                                <picture>
                                                                                    <img
                                                                                        className="img-loop img-hover"
                                                                                        src={API_URL + data.url_image2}
                                                                                    />
                                                                                </picture>
                                                                            </a>
                                                                            <div className="button-add">
                                                                                <button
                                                                                    title="Xem chi tiết"
                                                                                    className="action"
                                                                                >
                                                                                    <a href={"/detail/" + data._id} style={{ color: 'white' }}>
                                                                                        Xem chi tiết
                                                                                    </a>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="product-detail clearfix">
                                                                            <div className="box-pro-detail">
                                                                                <h3 className="pro-name">
                                                                                    <a
                                                                                        href={`/detail/${data._id}`}
                                                                                    >
                                                                                        {data.name}
                                                                                    </a>
                                                                                </h3>
                                                                                <div className="box-pro-prices">
                                                                                    <p className="pro-price ">
                                                                                        {formattedPrice(data.price)}
                                                                                        <span className="pro-price-del" />
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : <h2>Không có sản phẩm nào thuộc danh mục {name}</h2>
                                }
                                {dataByCategory.length > 0 &&
                                    <div className="table-filter-info">
                                        <Pagination
                                            className="pagination-data"
                                            showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`}
                                            onChange={PaginationChange}
                                            total={dataByCategory.length}
                                            current={current}
                                            pageSize={size}
                                            showSizeChanger={false}
                                            itemRender={PrevNextArrow}
                                            onShowSizeChange={PerPageChange}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

    );
}

export default Collection;