import {routing} from './controller/route.js'
import * as FirebaseAuth from './controller/firebase_auth.js';
import * as Home_page from './viewpage/home_page.js';
import * as UsersPage from './viewpage/users_page.js';
import * as EditProduct from './controller/edit_product.js';
import * as SearchPage from './viewpage/search_page.js';

window.onload = () => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    //if(pathname == '/') Home.home_page();
    //else if(pathname == '/about') About.about_page();
    routing(pathname,hash);
};

window.addEventListener('popstate', e=> {
    e.preventDefault(); // no refreshing
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    routing(pathname,hash);

});

FirebaseAuth.addEventListeners();
Home_page.addEventListeners();
UsersPage.addEventListeners();
EditProduct.addEventListeners();
SearchPage.addEventListeners();
Home_page.home_pageSorting();