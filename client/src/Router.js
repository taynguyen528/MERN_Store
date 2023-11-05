import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Detail from './components/pages/Detail';
import Search from './components/pages/Search';
import Collection from './components/pages/Collection';
import Cart from './components/Cart/cart';
import ManageUser from './components/pages/ManageUser';
import ManageOrder from './components/pages/ManageOrder';
import ManageProduct from './components/pages/ManageProduct';
import PurchaseOrder from './components/pages/PurchaseOrder';

class DieuHuongURL extends Component {
    render() {
        return (
            <Routes>
                <Route path="/purchase-order" element={<PurchaseOrder />} />
                <Route path="/manage-product" element={<ManageProduct />} />
                <Route path="/manage-order" element={<ManageOrder />} />
                <Route path="/manage-user" element={<ManageUser />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/collection/:name" element={<Collection />} />
                <Route path="/collection/:category/:name" element={<Collection />} />
                <Route path="/search/:keyword" element={<Search />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
            </Routes>
        );
    }
}

export default DieuHuongURL;