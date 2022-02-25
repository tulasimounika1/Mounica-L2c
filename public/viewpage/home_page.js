import * as Elements from './elements.js';
import { routePathnames } from '../controller/route.js';
import { currentUser } from '../controller/firebase_auth.js';
import { Product } from '../model/product.js';
import * as CloudFunctions from '../controller/cloud_functions.js';
import * as Util from './util.js';
import * as Constants from '../model/constants.js';
import * as CloudStorage from '../controller/cloud_storage.js';
import * as EditProduct from '../controller/edit_product.js';
let imageFile2Upload = null;

export function addEventListeners() {

    Elements.menuHome.addEventListener('click', async () => {
        history.pushState(null, null, routePathnames.HOME);
        const button = Elements.menuHome;
        const label = Util.disableButton(button);
        await home_page();
        //await Util.sleep(1000);
        Util.enableButton(button, label);

    });

    Elements.formAddProduct.imageButton.addEventListener('change', e => {
        imageFile2Upload = e.target.files[0];
        if (!imageFile2Upload) {
            Elements.formAddProduct.imageTag.removeAttribute('src');
            return;
        }
        const reader = new FileReader(); // Local File Referenced by this Object.
        reader.readAsDataURL(imageFile2Upload); // Load
        reader.onload = () => Elements.formAddProduct.imageTag.src = reader.result; //Render
    });

    Elements.formAddProduct.form.addEventListener('submit', addNewProduct);
}

export async function home_page() {

    if (!currentUser) {
        Elements.root.innerHTML = '<h1>Protected Page</h1>'
        return;
    }

    let html = `
        <div>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-add-product">
                +Add Product
            </button>
        </div>
    `;

    let products;
    try {
        products = await CloudFunctions.getProductList();
    } catch (e) {
        if (Constants.DEV) console.log(e);
        Util.info('Cannot get product list', JSON.stringify(e));
        return;
    }

    products.forEach(p => {
        html += buildProductCard(p);
    });

    Elements.root.innerHTML = html;
    EditDelete();
}

export async function EditDelete(){
    const forms = document.getElementsByClassName('form-edit-delete-product');
    for (let i = 0; i < forms.length; i++) 
    {
        forms[i].addEventListener('submit', async e => {
            e.preventDefault();
            const buttons = e.target.getElementsByTagName('button');
            const submitter = e.target.submitter;
            if (submitter == 'EDIT') {
                const label = Util.disableButton(buttons[0]);
                await EditProduct.edit_product(e.target.docId.value);
                //await Util.sleep(1000);
                Util.enableButton(buttons[0], label);
            } else if (submitter == 'DELETE') {
                const label = Util.disableButton(buttons[1]);
                await EditProduct.delete_product(e.target.docId.value, e.target.imageName.value);
                //await Util.sleep(1000);
                Util.enableButton(buttons[1], label);
            }
            else {
                console.log('No suc submitter', submitter);
            }
            //const submitter=e.target.submitter;
            //const docId=e.target.docId.value;
            //const imageName=e.target.imageName.value;
        })
    }
}

async function addNewProduct(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const price = e.target.price.value;
    const summary = e.target.summary.value;

    const product = new Product({ name, price, summary });

    const button = e.target.getElementsByTagName('button')[0];
    const label = Util.disableButton(button);

    try {
        // upload the product image => imageName, imageURL
        const { imageName, imageURL } = await CloudStorage.uploadImage(imageFile2Upload);
        product.imageName = imageName;
        product.imageURL = imageURL;
        const docId = await CloudFunctions.addProduct(product.toFirestore());
        Util.info('Success!', `Added: ${product.name} ,docId=${docId}`, Elements.modalAddProduct);
        e.target.reset();
        Elements.formAddProduct.imageTag.removeAttribute('src');
        await home_page();
    } catch (e) {
        if (Constants.DEV) console.log(e);
        Util.info('Add Product Failed', `${e.code}: ${e.name} = ${e.message}`, Elements.modalAddProduct);
    }

    Util.enableButton(button, label);
}

export function buildProductCard(product) {
    return `
    <div id="card-${product.docId}" class="card d-inline-flex" style="width: 18rem;">
        <img src="${product.imageURL}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price.toFixed(2)}<br>${product.summary}</p>
            <form class="form-edit-delete-product" method="post">
                <input type="hidden" name="docId" value="${product.docId}">
                <input type="hidden" name="imageName" value="${product.imageName}">
                <button type="submit" class="btn btn-outline-primary"
                    onclick="this.form.submitter='EDIT'">Edit</button>
                <button type="submit" class="btn btn-outline-danger"
                    onclick="this.form.submitter='DELETE'">Delete</button>
            </form>
        </div>
    </div>
    `;
}

export function home_pageSorting() {
    //Mounica - EventListener - Sorting Name Increasing
    Elements.dropdown_sorter_name_increasing.addEventListener('click', async e => {
        e.preventDefault();
        
        let products;
        products = await CloudFunctions.getProductListAscending();

        let html = `
        <div>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-add-product">
                +Add Product
            </button>
        </div>
        `;

        products.forEach(p => {
            html += buildProductCard(p);
        });

        Elements.root.innerHTML = html;
        EditDelete();
    });
    //Mounica Tulasi - EventListener - Sorting Price Increasing
    Elements.dropdown_sorter_price_increasing.addEventListener('click', async e => {
        e.preventDefault();
        
        let products;
        products = await CloudFunctions.getProductListByPriceAscending();

        let html = `
        <div>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-add-product">
                +Add Product
            </button>
        </div>
        `;

        products.forEach(p => {
            html += buildProductCard(p);
        });

        Elements.root.innerHTML = html;
        EditDelete();
    });
    //Mounica - EventListener - Sorting Name Decreasing
    Elements.dropdown_sorter_name_decreasing.addEventListener('click', async e => {
        e.preventDefault();
        
        let products;
        products = await CloudFunctions.getProductListDescending();

        let html = `
        <div>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-add-product">
                +Add Product
            </button>
        </div>
        `;

        products.forEach(p => {
            html += buildProductCard(p);
        });

        Elements.root.innerHTML = html;
        EditDelete();
    });
    //Mounica Tulasi - EventListener - Sorting Price Decreasing
    Elements.dropdown_sorter_price_decreasing.addEventListener('click', async e => {
        e.preventDefault();
        
        let products;
        products = await CloudFunctions.getProductListByPriceDescending();

        let html = `
        <div>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-add-product">
                +Add Product
            </button>
        </div>
        `;

        products.forEach(p => {
            html += buildProductCard(p);
        });

        Elements.root.innerHTML = html;
        EditDelete();        
    });
}