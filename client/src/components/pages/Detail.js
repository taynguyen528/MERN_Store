import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router";
import { API_URL } from "../../config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../Cart/CartContext";

function Detail() {
    const { productsCount, updateToCart } = useCart();

    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [productSizeColor, setProductSizeColor] = useState([]);
    const contentRef = useRef(null);
    const sizeRef = new useRef(null);

    let { id } = useParams();
    useEffect(() => {
        axios
            .get(`${API_URL}/api/products/${id}`)
            .then((response) => {
                setProduct(response.data);
                axios
                    .get(
                        `${API_URL}/api/subcategories/${response.data.subcategory_id}/products/${id}`
                    )
                    .then((response) => {
                        setListProduct(response.data);
                    })
                    .catch(() => {});
            })
            .catch(() => {});
        axios
            .get(`${API_URL}/api/products/${id}/images`)
            .then((response) => {
                setImages(response.data);
            })
            .catch(() => {});
        axios
            .get(`${API_URL}/api/productsizecolors/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    setProductSizeColor(response.data);
                }
            })
            .catch(() => {});
    }, []);

    const formattedPrice = (price) => {
        const priceAsNumber = parseFloat(price);
        if (!isNaN(priceAsNumber)) {
            const formattedPrice = priceAsNumber.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            });
            return formattedPrice;
        }
        return "";
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const addToCart = () => {
        let maxId = 0;
        cart.forEach((item) => {
            if (item.id > maxId) {
                maxId = item.id;
            }
        });
        const sizeText = sizeRef.current.value;
        const colorMatch = sizeText.match(/Màu: (\S+)/);
        const sizeMatch = sizeText.match(/Kích thước: (\S+)/);

        const color = colorMatch[1];
        var size = sizeMatch[1];

        if (size === "NO") {
            size = "NO SIZE";
        }
        const foundProduct = productSizeColor.find(
            (item) =>
                item.size_id.size_name === size &&
                item.color_id.color_name === color
        );
        const newData = {
            id: maxId + 1,
            image: product.url_image1,
            product_id: product._id,
            name: product.product_name,
            price: product.price,
            qty: quantity,
            size: sizeRef.current.value,
            remainingQuantity: foundProduct.quantity,
        };

        const existingItem = cart.find(
            (item) => item.name === newData.name && item.size === newData.size
        );
        if (existingItem) {
            var n = parseInt(existingItem.qty) + parseInt(newData.qty);
            if (n <= existingItem.remainingQuantity) {
                existingItem.qty = n;
            } else {
                toast("Số lượng sản phẩm trong kho không đủ");
                return;
            }
        } else {
            if (foundProduct.quantity >= quantity) {
                cart.push(newData);
            } else {
                toast("Số lượng sản phẩm trong kho không đủ");
                return;
            }
        }
        localStorage.setItem("cart", JSON.stringify(cart));

        const storedCount = localStorage.getItem("count");
        const parsedCount = parseInt(storedCount, 10);

        if (!isNaN(parsedCount)) {
            localStorage.setItem("count", parsedCount + quantity);
        } else {
            localStorage.setItem("count", quantity);
        }
        updateToCart();
        toast("Thêm sản phẩm vào giỏ hàng thành công");
    };

    const [quantity, setQuantity] = useState(1);

    const handleIncreaseQuantity = () => {
        const sizeText = sizeRef.current.value;
        const colorMatch = sizeText.match(/Màu: (\S+)/);
        const sizeMatch = sizeText.match(/Kích thước: (\S+)/);

        const color = colorMatch[1];
        var size = sizeMatch[1];
        if (size === "NO") {
            size = "NO SIZE";
        }
        const foundProduct = productSizeColor.find(
            (item) =>
                item.size_id.size_name === size &&
                item.color_id.color_name === color
        );

        if (quantity + 1 <= foundProduct.quantity) {
            setQuantity(quantity + 1);
        } else {
            toast("Số lượng sản phẩm trong kho không đủ");
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <main className="mainContent-theme ">
            <div id="product" className="productDetail-page">
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
                                        <a
                                            href="/"
                                            target="_self"
                                            itemProp="item"
                                        >
                                            <span itemProp="name">
                                                Trang chủ
                                            </span>
                                        </a>
                                        <meta itemProp="position" content={1} />
                                    </li>
                                    <li
                                        itemProp="itemListElement"
                                        itemScope=""
                                        itemType="http://schema.org/ListItem"
                                    >
                                        <a
                                            href={
                                                "/collection/" +
                                                product.category_name
                                            }
                                            target="_self"
                                            itemProp="item"
                                        >
                                            <span itemProp="name">
                                                {product.category_name}
                                            </span>
                                        </a>
                                        <meta itemProp="position" content={2} />
                                    </li>
                                    <li
                                        itemProp="itemListElement"
                                        itemScope=""
                                        itemType="http://schema.org/ListItem"
                                    >
                                        <a
                                            href={
                                                "/collection/" +
                                                product.category_name +
                                                "/" +
                                                product.subcategory_name
                                            }
                                            target="_self"
                                            itemProp="item"
                                        >
                                            <span itemProp="name">
                                                {product.subcategory_name}
                                            </span>
                                        </a>
                                        <meta itemProp="position" content={3} />
                                    </li>
                                    <li
                                        className="active"
                                        itemProp="itemListElement"
                                        itemScope=""
                                        itemType="http://schema.org/ListItem"
                                    >
                                        <span itemProp="item">
                                            <span itemProp="name">
                                                {product.product_name}
                                            </span>
                                        </span>
                                        <meta itemProp="position" content={4} />
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row product-detail-wrapper">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="row product-detail-main pr_style_01">
                                <div className="col-md-7 col-sm-12 col-xs-12">
                                    <div className="product-gallery">
                                        <div className="product-image-detail box__product-gallery scroll">
                                            <ul
                                                id="sliderproduct"
                                                className="site-box-content 2 slide_product hidden-xs"
                                            >
                                                {images.map((image) => (
                                                    <li
                                                        className="product-gallery-item gallery-item"
                                                        key={image._id}
                                                    >
                                                        <img
                                                            className="product-image-feature"
                                                            src={
                                                                API_URL +
                                                                image.image_url
                                                            }
                                                        />
                                                    </li>
                                                ))}
                                                <li
                                                    className="product-gallery-item gallery-item"
                                                    ref={contentRef}
                                                >
                                                    <img
                                                        className="product-image-feature"
                                                        src="//product.hstatic.net/1000096703/product/atn_moi_dd01e45d11af4c4e98193f59173a4a14_master.jpg"
                                                        alt={
                                                            product.product_name
                                                        }
                                                    />
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-md-5 col-sm-12 col-xs-12 product-content-desc"
                                    id="detail-product"
                                >
                                    <div className="product-title">
                                        <h1>{product.product_name}</h1>
                                        <span id="pro_sku">
                                            <strong>SKU:</strong> ATN0146MMDE
                                        </span>
                                    </div>
                                    <div
                                        className="product-price"
                                        id="price-preview"
                                    >
                                        <span className="pro-price">
                                            {formattedPrice(product.price)}
                                        </span>
                                    </div>
                                    <form
                                        id="add-item-form"
                                        action="/cart/add"
                                        method="post"
                                        className="variants clearfix"
                                    >
                                        <div className="clearfix">
                                            <select
                                                className="form-control"
                                                ref={sizeRef}
                                            >
                                                {productSizeColor.map(
                                                    (size) => (
                                                        <option key={size._id}>
                                                            Màu:{" "}
                                                            {
                                                                size.color_id
                                                                    .color_name
                                                            }{" "}
                                                            / Kích thước:{" "}
                                                            {
                                                                size.size_id
                                                                    .size_name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                        <div className="select-swatch clearfix">
                                            <div
                                                id="variant-swatch-0"
                                                className="swatch clearfix swarch-size"
                                                data-option="option1"
                                                data-option-index={0}
                                            >
                                                <a
                                                    className="pull-right"
                                                    style={{
                                                        margin: "10px 25px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => {
                                                        contentRef.current.scrollIntoView(
                                                            {
                                                                behavior:
                                                                    "smooth",
                                                            }
                                                        );
                                                    }}
                                                >
                                                    CÁCH CHỌN SIZE
                                                </a>
                                            </div>
                                        </div>
                                        <div className="selector-actions">
                                            <div className="quantity-area clearfix">
                                                <input
                                                    type="button"
                                                    defaultValue="-"
                                                    className="qty-btn"
                                                    onClick={
                                                        handleDecreaseQuantity
                                                    }
                                                />
                                                <input
                                                    value={quantity}
                                                    type="text"
                                                    id="quantity"
                                                    name="quantity"
                                                    min={1}
                                                    className="quantity-selector"
                                                />
                                                <input
                                                    type="button"
                                                    defaultValue="+"
                                                    className="qty-btn"
                                                    onClick={
                                                        handleIncreaseQuantity
                                                    }
                                                />
                                            </div>
                                            <div className="wrap-addcart clearfix">
                                                <div className="row-flex">
                                                    <button
                                                        type="button"
                                                        id="add-to-cart"
                                                        className=" add-to-cartProduct button btn-addtocart addtocart-modal "
                                                        name="add"
                                                        onClick={addToCart}
                                                    >
                                                        <span>
                                                            {" "}
                                                            Thêm vào giỏ{" "}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="product-action-bottom visible-xs">
                                            <button
                                                type="button"
                                                id="add-to-cartbottom"
                                                className=" add-to-cartProduct add-cart-bottom button dark addtocart-modal"
                                                name="add"
                                            >
                                                <span> Thêm vào giỏ </span>
                                            </button>
                                        </div>
                                    </form>
                                    <div
                                        className="hrv-pmo-coupon"
                                        data-hrvpmo-layout="minimum"
                                    />
                                    <div
                                        className="hrv-pmo-discount"
                                        data-hrvpmo-layout="minimum"
                                    />
                                    <div className="product-description">
                                        <div className="title-bl">
                                            <h2>Mô tả</h2>
                                        </div>
                                        <div className="description-content">
                                            <div className="description-productdetail">
                                                <p>{product.description}</p>
                                                <p>
                                                    <strong>
                                                        Hướng dẫn bảo quản:
                                                    </strong>
                                                </p>
                                                <p>
                                                    - Không dùng hóa chất tẩy.
                                                </p>
                                                <p>
                                                    - Ủi ở nhiệt độ thích hợp,
                                                    hạn chế dùng máy sấy.
                                                </p>
                                                <p>
                                                    - Giặt ở chế độ bình thường,
                                                    với đồ có màu tương tự.
                                                    <br />
                                                </p>
                                                <div
                                                    className="youtube-embed-wrapper"
                                                    style={{
                                                        position: "relative",
                                                        paddingBottom: "56.25%",
                                                        height: 0,
                                                    }}
                                                >
                                                    <iframe
                                                        className="iframe-youtube-embed"
                                                        width={640}
                                                        height={360}
                                                        src="https://www.youtube.com/embed/3cyhVEOIo44"
                                                        style={{
                                                            aspectRatio:
                                                                "16 / 9",
                                                            width: "100%",
                                                            height: "100%",
                                                            position:
                                                                "absolute",
                                                        }}
                                                    />
                                                </div>
                                                <p></p>
                                            </div>
                                            <a id="detail_more">
                                                <span className="btn-effect">
                                                    Xem thêm
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="list-productRelated clearfix">
                                <div className="heading-title text-center">
                                    <h2>Sản phẩm liên quan</h2>
                                </div>
                                <div className="content-product-list row">
                                    {listProduct.map((product) => (
                                        <div
                                            className="col-md-3 col-sm-6 col-xs-6 pro-loop"
                                            key={product._id}
                                        >
                                            <div className="product-block product-resize">
                                                <div className="product-img">
                                                    <a
                                                        href={`/detail/${product._id}`}
                                                        title={product.name}
                                                        className="image-resize"
                                                    >
                                                        <picture>
                                                            <img
                                                                className="img-loop"
                                                                src={
                                                                    API_URL +
                                                                    product.url_image1
                                                                }
                                                            />
                                                        </picture>
                                                        <picture>
                                                            <img
                                                                className="img-loop img-hover"
                                                                src={
                                                                    API_URL +
                                                                    product.url_image2
                                                                }
                                                            />
                                                        </picture>
                                                    </a>
                                                </div>
                                                <div className="product-detail clearfix">
                                                    <div className="box-pro-detail">
                                                        <h3 className="pro-name">
                                                            <a
                                                                href={`/detail/${product._id}`}
                                                                title={
                                                                    product.name
                                                                }
                                                            >
                                                                {product.name}
                                                            </a>
                                                        </h3>
                                                        <div className="box-pro-prices">
                                                            <p className="pro-price ">
                                                                {formattedPrice(
                                                                    product.price
                                                                )}
                                                                <span className="pro-price-del" />
                                                            </p>
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
            </div>
            <ToastContainer />
        </main>
    );
}

export default Detail;
