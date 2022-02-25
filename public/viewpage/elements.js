//main root element
export const root = document.getElementById('root');

//menu
export const menuSignout = document.getElementById('menu-signout');
export const menuHome = document.getElementById('menu-home');
export const menuUsers = document.getElementById('menu-users');

//Form
export const formSearch = document.getElementById('form-search');
export const formSignIn = document.getElementById('form-signin');
export const formAddProduct = {
    form: document.getElementById('form-add-product'),
    imageTag: document.getElementById('form-add-product-image-tag'),
    imageButton: document.getElementById('form-add-product-image-button'),
}
export const formEditProduct = {
    form: document.getElementById('form-edit-product'),
    imageTag: document.getElementById('form-edit-product-image-tag'),
    imageButton: document.getElementById('form-edit-product-image-button'),
}
//Modals
export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin'),{backdrop:'static'});
export const modalInfobox = {
    modal:new bootstrap.Modal(document.getElementById('modal-infobox'), {backdrop: 'static'}),
    title:document.getElementById('modal-infobox-title'),
    body:document.getElementById('modal-infobox-body'),
}

export const modalAddProduct = new bootstrap.Modal(document.getElementById('modal-add-product'),{backdrop:'static'});
export const modalEditProduct = new bootstrap.Modal(document.getElementById('modal-edit-product'),{backdrop:'static'});

//Component - Dropdown
export const dropdown_sorter_name_increasing = document.getElementById('dropdown-item-name-increasing');
export const dropdown_sorter_price_increasing = document.getElementById('dropdown-item-price-increasing');
export const dropdown_sorter_name_decreasing = document.getElementById('dropdown-item-name-decreasing');
export const dropdown_sorter_price_decreasing = document.getElementById('dropdown-item-price-decreasing');