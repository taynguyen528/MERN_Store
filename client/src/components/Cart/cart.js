import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "./CartContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import API_URL from "../../config";
import axios from "axios";

const Cart = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const phoneLocal = localStorage.getItem("phone");
    const addressLocal = localStorage.getItem("address");

    const phoneRef = useRef(null);
    const addressRef = useRef(null);
    const noteRef = useRef(null);

    useEffect(() => {
        if (phoneLocal && phoneRef.current) {
            phoneRef.current.value = phoneLocal;
        }
        if (addressLocal && addressRef.current) {
            addressRef.current.value = addressLocal;
        }
    }, [phoneLocal, addressLocal]);

    const { productsCount, updateToCart } = useCart();

    let productData = JSON.parse(localStorage.getItem("cart")) || [];

    const [products, SetProducts] = useState(productData);

    // -----Increment Event------
    const increaseQuantity = (i, id) => {
        const storedCount = localStorage.getItem("count");

        localStorage.setItem("count", parseInt(storedCount, 10) + 1);
        updateToCart();

        SetProducts((preValue) =>
            preValue.map((data, o) => {
                if (i === o) {
                    const storedData =
                        JSON.parse(localStorage.getItem("cart")) || [];

                    const itemIndex = storedData.findIndex(
                        (item) => item.id == id
                    );

                    if (itemIndex !== -1) {
                        storedData[itemIndex].qty = data.qty + 1;

                        localStorage.setItem(
                            "cart",
                            JSON.stringify(storedData)
                        );
                    }

                    return {
                        ...data,
                        qty: data.qty + 1,
                    };
                }
                return data;
            })
        );
    };

    // -----Decrement Event------
    const decreaseQuantity = (i, id) => {
        const storedCount = localStorage.getItem("count");
        if (parseInt(storedCount, 10) > 1) {
            localStorage.setItem("count", parseInt(storedCount, 10) - 1);
            updateToCart();
        }

        SetProducts((preValue) =>
            preValue.map((data, o) => {
                if (i === o) {
                    if (data.qty > 1) {
                        const storedData =
                            JSON.parse(localStorage.getItem("cart")) || [];

                        const itemIndex = storedData.findIndex(
                            (item) => item.id == id
                        );

                        if (itemIndex !== -1) {
                            storedData[itemIndex].qty = data.qty - 1;

                            localStorage.setItem(
                                "cart",
                                JSON.stringify(storedData)
                            );
                        }
                        return { ...data, qty: data.qty - 1 };
                    } else {
                        return data;
                    }
                }
                return data;
            })
        );
    };

    // -----Remove Event------
    const removeFromCart = (i, id) => {
        if (
            window.confirm(
                "Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng của mình không?"
            )
        ) {
            SetProducts((prevCart) =>
                prevCart.filter((item, o) => {
                    return i !== o;
                })
            );
            const storedData = JSON.parse(localStorage.getItem("cart")) || [];

            const itemIndexToRemove = storedData.findIndex(
                (item) => item.id == id
            );

            if (itemIndexToRemove !== -1) {
                const storedCount = localStorage.getItem("count");

                localStorage.setItem(
                    "count",
                    parseInt(storedCount, 10) - itemIndexToRemove.qty
                );
                updateToCart();
                storedData.splice(itemIndexToRemove, 1);
            }

            localStorage.setItem("cart", JSON.stringify(storedData));
            toast("Xóa sản phẩm khỏi giỏ hàng thành công");
        }
    };

    // -empty-cart--------
    const emptycart = () => {
        confirmAlert({
            title: "Xác nhận",
            message: "Xóa tất cả các mặt hàng vào giỏ hàng của bạn?",
            buttons: [
                {
                    label: "Xác nhận",
                    onClick: () => {
                        SetProducts([]);
                        localStorage.removeItem("cart");
                        localStorage.setItem("count", 0);
                        updateToCart();
                    },
                },
                {
                    label: "Hủy",
                },
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            keyCodeForClose: [8, 32],
            willUnmount: () => {},
            afterClose: () => {},
            onClickOutside: () => {},
            onKeypress: () => {},
            onKeypressEscape: () => {},
            overlayClassName: "overlay-custom-class-name",
        });
    };

    // ------Total Product Incart and Total Price of cart
    const cartTotalQty = products.reduce((acc, data) => acc + data.qty, 0);
    const cartTotalAmount = products.reduce(
        (acc, data) => acc + data.price * data.qty,
        0
    );

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

    const checkout = () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            toast("Vui lòng đăng nhập trước khi đặt hàng");
            return;
        }
        const userid = localStorage.getItem("user_id") || 0;
        let dataOrderDetail = [];

        productData.forEach((item) => {
            const sizeText = item.size;
            const colorMatch = sizeText.match(/Màu: (\S+)/);
            const sizeMatch = sizeText.match(/Kích thước: (\d+)/);

            const color = colorMatch[1];
            const size = sizeMatch[1];

            const newData = {
                product_id: item.product_id,
                color: item.price,
                color: color,
                size: size,
                quantity: item.qty,
            };

            dataOrderDetail.push(newData);
        });

        const currentTime = new Date();

        const newData = {
            user_id: userid,
            phone: phoneRef.current.value,
            address: addressRef.current.value,
            order_date: currentTime,
            total_price: cartTotalAmount,
            status: "Chờ xác nhận",
            note: noteRef.current.value,
            order_items: dataOrderDetail,
        };

        axios.post(`${API_URL}/api/orders`, newData).then((response) => {
            if (response.status === 200) {
                SetProducts([]);
                localStorage.removeItem("cart");
                localStorage.setItem("count", 0);
                updateToCart();
                toast("Đặt đơn hàng thành công");
            } else {
                toast("Lỗi khi đặt hàng");
            }
        });
    };

    return (
        <>
            <div className="sec_row container">
                <div className="justify-content-center m-0">
                    <div className="mt-5 mb-5">
                        <div className="card">
                            <div className="card-header bg-dark p-3">
                                <div className="card-header-flex">
                                    <h5 className="text-white m-0">
                                        Giỏ hàng{" "}
                                        {products.length > 0
                                            ? `(${products.length})`
                                            : ""}
                                    </h5>
                                    {products.length > 0 ? (
                                        <button
                                            className="btn btn-danger mt-0 btn-sm"
                                            onClick={() => emptycart()}
                                        >
                                            <i className="fa fa-trash-alt mr-2"></i>
                                            <span>Làm trống giỏ hàng</span>
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                            <div className="card-body p-0">
                                {products.length === 0 ? (
                                    <table className="table cart-table mb-0">
                                        <tbody>
                                            <tr>
                                                <td colSpan="6">
                                                    <div className="cart-empty">
                                                        <i className="fa fa-shopping-cart"></i>
                                                        <p>Giỏ hàng trống</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <>
                                        <table className="table cart-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Xóa</th>
                                                    <th>Hình ảnh</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Kích thước</th>
                                                    <th>Giá</th>
                                                    <th>Số lượng</th>
                                                    <th className="text-right">
                                                        <span
                                                            id="amount"
                                                            className="amount"
                                                        >
                                                            Tổng giá
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((data, index) => {
                                                    const {
                                                        id,
                                                        image,
                                                        name,
                                                        price,
                                                        qty,
                                                        size,
                                                    } = data;
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <button
                                                                    className="prdct-delete"
                                                                    onClick={() =>
                                                                        removeFromCart(
                                                                            index,
                                                                            id
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <div className="product-img">
                                                                    <img
                                                                        src={
                                                                            API_URL +
                                                                            image
                                                                        }
                                                                        alt=""
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="product-name">
                                                                    <p>
                                                                        {name}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p>{size}</p>
                                                            </td>
                                                            <td>
                                                                {formattedPrice(
                                                                    price
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="prdct-qty-container">
                                                                    <button
                                                                        className="prdct-qty-btn"
                                                                        type="button"
                                                                        onClick={() =>
                                                                            decreaseQuantity(
                                                                                index,
                                                                                id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="fa fa-minus"></i>
                                                                    </button>
                                                                    <input
                                                                        type="text"
                                                                        name="qty"
                                                                        className="qty-input-box"
                                                                        value={
                                                                            qty
                                                                        }
                                                                        disabled
                                                                    />
                                                                    <button
                                                                        className="prdct-qty-btn"
                                                                        type="button"
                                                                        onClick={() =>
                                                                            increaseQuantity(
                                                                                index,
                                                                                id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="fa fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="text-right">
                                                                {formattedPrice(
                                                                    qty * price
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th>&nbsp;</th>
                                                    <th colSpan="4">&nbsp;</th>
                                                    <th>
                                                        Tổng
                                                        <span className="ml-2 mr-2">
                                                            :
                                                        </span>
                                                        <span className="text-danger">
                                                            {cartTotalQty}
                                                        </span>
                                                    </th>
                                                    <th className="text-right">
                                                        <span className="text-danger">
                                                            {formattedPrice(
                                                                cartTotalAmount
                                                            )}
                                                        </span>
                                                    </th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                        {isLoggedIn ? (
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>
                                                        Số điện thoại{" "}
                                                        <b
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            *
                                                        </b>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        ref={phoneRef}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>
                                                        Địa chỉ{" "}
                                                        <b
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            *
                                                        </b>
                                                    </label>
                                                    <textarea
                                                        className="form-control"
                                                        ref={addressRef}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Ghi chú</label>
                                                    <textarea
                                                        className="form-control"
                                                        ref={noteRef}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={checkout}
                                                    >
                                                        Đặt hàng
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <a
                                                href="/login"
                                                className="btn btn-success"
                                            >
                                                Đăng nhập trước khi đặt hàng
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Cart;
