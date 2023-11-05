import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

function Home() {
    const [listProduct, setListProduct] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/api/newest-products`)
            .then(response => setListProduct(response.data))
            .catch(() => {
            });
    }, []);

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
            <main className="mainContent-theme  mainContent-index">
                {/* 1. Slide */}
                <section className="section-slider">
                    <div className="sliderBanner" id="home-slider">
                        <div className="slider-owl owl-carousel owl-theme">
                            {/* Banener 1 */}
                            <div className="slider-item">
                                <div className="slide--image">
                                    <a style={{ cursor: "pointer" }} title="">
                                        <picture>
                                            <source media="(max-width: 600px)" srcSet="" />
                                            <source
                                                media="(min-width: 601px)"
                                                srcSet="assets/images/banner/image1.webp"
                                            />
                                            <img
                                                src="assets/images/banner/image1.webp"
                                                alt=""
                                            />
                                        </picture>
                                    </a>
                                </div>
                                <div className="slide--content">
                                    <div className="group-button"></div>
                                </div>
                            </div>
                            <div className="slider-item fade-box">
                                <div className="slide--image">
                                    <a style={{ cursor: "pointer" }} title="">
                                        <picture>
                                            <source media="(max-width: 600px)" data-srcset="" />
                                            <source
                                                media="(min-width: 601px)"
                                                data-srcset="assets/images/banner/image2.jpg"
                                            />
                                            <img
                                                data-src="assets/images/banner/image2.jpg"
                                                className="lazyload"
                                                alt=""
                                            />
                                        </picture>
                                    </a>
                                </div>
                                <div className="slide--content">
                                    <div className="group-button"></div>
                                </div>
                            </div>
                            <div className="slider-item fade-box">
                                <div className="slide--image">
                                    <a style={{ cursor: "pointer" }} title="">
                                        <picture>
                                            <source media="(max-width: 600px)" data-srcset="" />
                                            <source
                                                media="(min-width: 601px)"
                                                data-srcset="assets/images/banner/image3.webp"
                                            />
                                            <img
                                                data-src="assets/images/banner/image3.webp"
                                                className="lazyload"
                                                alt=""
                                            />
                                        </picture>
                                    </a>
                                </div>
                                <div className="slide--content">
                                    <div className="group-button"></div>
                                </div>
                            </div>
                            <div className="slider-item fade-box">
                                <div className="slide--image">
                                    <a style={{ cursor: "pointer" }} title="">
                                        <picture>
                                            <source media="(max-width: 600px)" data-srcset="" />
                                            <source
                                                media="(min-width: 601px)"
                                                data-srcset="assets/images/banner/image4.webp"
                                            />
                                            <img
                                                data-src="assets/images/banner/image4.webp"
                                                className="lazyload"
                                                alt=""
                                            />
                                        </picture>
                                    </a>
                                </div>
                                <div className="slide--content">
                                    <div className="group-button"></div>
                                </div>
                            </div>
                        </div>
                        <div className="slider-circle-scroll">
                            <a className="scroll-downs" href="">
                                <svg role="presentation" viewBox="0 0 21 11">
                                    <polyline
                                        fill="none"
                                        stroke="currentColor"
                                        points="0.5 0.5 10.5 10.5 20.5 0.5"
                                        strokeWidth="1.25"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>
                <div className="hrv-pmo-coupon" data-hrvpmo-layout="grids" />
                <div className="hrv-pmo-discount" data-hrvpmo-layout="grids" />
                {/* 2. Nhom tabs collection */}
                <section className="section wrapper-hometabs-collection">
                    <div className="container">
                        <div className="wrapper-heading-home">
                            <h1>SẢN PHẨM MỚI</h1>
                        </div>
                        <div className="tab-content tabs-products">
                            <div className="tab-item active" id="tab1" data-get="true">
                                <div className="listProduct-carousel--overflow">
                                    <div className="product-lists row">
                                        {listProduct.map((product, index) => (
                                            <div key={product._id} className="pro-loop animated fadeIn col-md-3">
                                                <div className="product-block" data-anmation={index + 1}>
                                                    <div className="product-img fade-box">
                                                        <a
                                                            href={'/detail/' + product._id}
                                                            title={product.name}
                                                            className="image-resize"
                                                        >
                                                            <picture>
                                                                <img
                                                                    src={API_URL + product.url_image1}
                                                                    className="lazyload"
                                                                    alt={product.name}
                                                                />
                                                            </picture>
                                                            <picture>
                                                                <img
                                                                    src={API_URL + product.url_image2}
                                                                    className="lazyload"
                                                                    alt={product.name}
                                                                />
                                                            </picture>
                                                        </a>
                                                        <div className="button-add">
                                                            <button
                                                                title="Xem chi tiết"
                                                                className="action"
                                                            >
                                                                <a href={"/detail/" + product._id} style={{color: 'white'}}>
                                                                    Xem chi tiết
                                                                </a>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="product-detail clearfix">
                                                        <div className="box-pro-detail">
                                                            <h3 className="pro-name">
                                                                <a
                                                                    href={`/detail/${product._id}`}
                                                                    title={product.name}
                                                                >
                                                                    {product.name}
                                                                </a>
                                                            </h3>
                                                            <div className="box-pro-prices">
                                                                <p className="pro-price ">{formattedPrice(product.price)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* 3. Nhóm san phẩm 1 */}
                {/* 4. Nhóm banner */}
                <section className="section no-border wrapper-home-banner">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xs-12 col-sm-4 home-banner-pd">
                                <figure className="block-banner-category">
                                    <a
                                        className="link-banner"
                                        href="https://kenta.vn/collections/ao-khoac"
                                    >
                                        <div className="fg-image fade-box">
                                            <picture>
                                                <source
                                                    data-srcset="https://file.hstatic.net/1000096703/file/13_f161048fd69e41c096161641f468d663.jpg"
                                                    media="(max-width: 500px)"
                                                />
                                                <source data-srcset="https://file.hstatic.net/1000096703/file/13_f161048fd69e41c096161641f468d663.jpg" />
                                                <img
                                                    data-src="https://file.hstatic.net/1000096703/file/13_f161048fd69e41c096161641f468d663.jpg"
                                                    className="lazyload"
                                                    alt=""
                                                />
                                            </picture>
                                        </div>
                                        <figcaption className="caption_banner site-animation">
                                            <p />
                                            <h2 />
                                        </figcaption>
                                    </a>
                                </figure>
                            </div>
                            <div className="col-xs-12 col-sm-4 home-banner-pd">
                                <figure className="block-banner-category">
                                    <a
                                        className="link-banner "
                                        href="https://kenta.vn/collections/so-mi"
                                    >
                                        <div className="fg-image fade-box">
                                            <picture>
                                                <source
                                                    data-srcset="https://file.hstatic.net/1000096703/file/9_c25efb770ca748868ff408bea4c4c4c5.jpg"
                                                    media="(max-width: 500px)"
                                                />
                                                <source data-srcset="https://file.hstatic.net/1000096703/file/9_c25efb770ca748868ff408bea4c4c4c5.jpg" />
                                                <img
                                                    data-src="https://file.hstatic.net/1000096703/file/9_c25efb770ca748868ff408bea4c4c4c5.jpg"
                                                    className="lazyload"
                                                    alt=""
                                                />
                                            </picture>
                                        </div>
                                        <figcaption className="caption_banner site-animation">
                                            <p />
                                            <h2 />
                                        </figcaption>
                                    </a>
                                </figure>
                            </div>
                            <div className="col-xs-12 col-sm-4 home-banner-pd">
                                <figure className="block-banner-category">
                                    <a
                                        className="link-banner "
                                        href="https://kenta.vn/collections/quan-tay-nam"
                                    >
                                        <div className="fg-image fade-box">
                                            <picture>
                                                <source
                                                    data-srcset="https://file.hstatic.net/1000096703/file/11_7441d71a347d4bf29645e98a4d1826c8.jpg"
                                                    media="(max-width: 500px)"
                                                />
                                                <source data-srcset="https://file.hstatic.net/1000096703/file/11_7441d71a347d4bf29645e98a4d1826c8.jpg" />
                                                <img
                                                    data-src="https://file.hstatic.net/1000096703/file/11_7441d71a347d4bf29645e98a4d1826c8.jpg"
                                                    className="lazyload"
                                                    alt=""
                                                />
                                            </picture>
                                        </div>
                                        <figcaption className="caption_banner site-animation">
                                            <p />
                                            <h2 />
                                        </figcaption>
                                    </a>
                                </figure>
                            </div>
                        </div>
                    </div>
                </section>
                {/* 5. Nhóm san phẩm 1 */}
                {/* 6. Nhóm san phẩm 3 */}
                {/* Blog */}
            </main>
        </>
    );
}

export default Home;