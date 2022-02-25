import { 
    getFunctions, httpsCallable,connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-functions.js";
import { Product } from "../model/product.js";

const functions = getFunctions();

// setup for emulator
const hostname = window.location.hostname;
if(hostname=='localhost' || hostname == '127.0.0.1'){
    connectFunctionsEmulator(functions,hostname, 5001);
}

const cfn_addProduct = httpsCallable(functions, 'cfn_addProduct');
export async function addProduct(product) {
    const result = await cfn_addProduct(product);
    return result.data;
}

const cfn_getProductList = httpsCallable(functions, 'cfn_getProductList');
export async function getProductList(){
    const products = []; // array of Product object
    const result = await cfn_getProductList({});
    result.data.forEach(element => {
        const p = new Product(element);
        p.set_docId(element.docId);
        products.push(p);
    });
    return products;
}

const cfn_deleteProductDoc = httpsCallable(functions, 'cfn_deleteProductDoc');
export async function deleteProductDoc(docId){
    await cfn_deleteProductDoc(docId);
}

const cfn_getProductById = httpsCallable(functions, 'cfn_getProductById');
export async function getProductById(docId){
    const result = await cfn_getProductById(docId);
    if(result.data){
        const product = new Product(result.data);
        product.set_docId(result.data.docId);
        return product;
    } else {
        return null;
    }
}

const cfn_updateProductDoc = httpsCallable(functions, 'cfn_updateProductDoc');
export async function updateProductDoc(product){
    const docId = product.docId;
    const updateObject = product.toFirestoreForUpdate();
    await cfn_updateProductDoc({docId,updateObject});
}

const cfn_getUserList = httpsCallable(functions, 'cfn_getUserList');
export async function getUserList(){
    const result = await cfn_getUserList({});
    result.data.sort((a,b) => {
        if(a.email>b.email) return 1;
        else if(a.email < b.email) return -1;
        else return 0;
    })
    return result.data;
}

const cfn_updateUser = httpsCallable(functions, 'cfn_updateUser');
export async function updateUser(uid, update){
    await cfn_updateUser({uid, update});
}

const cfn_deleteUser = httpsCallable(functions,'cfn_deleteUser');
export async function deleteUser(uid){
    await cfn_deleteUser(uid);
}
//Mounica Tulasi - Searching Product
const cfn_searchProductList = httpsCallable(functions, 'cfn_searchProductList');
export async function searchProduct(productName){
    const products = []; // array of Product object
    const result = await cfn_searchProductList(productName);
    result.data.forEach(element => {
        const p = new Product(element);
        p.set_docId(element.docId);
        products.push(p);
    });
    return products;
}


//Mounica Tulasi - Sorting Name
const cfn_getProductListAscending = httpsCallable(functions, 'cfn_getProductListAscending');
export async function getProductListAscending(){
    const products = []; // array of Product object
    const result = await cfn_getProductListAscending({});
    result.data.forEach(element => {
        const p = new Product(element);
        p.set_docId(element.docId);
        products.push(p);
    });
    return products;
}
//Mounica Tulasi - Sorting Price
const cfn_getProductListByPriceAscending = httpsCallable(functions, 'cfn_getProductListByPriceAscending');
export async function getProductListByPriceAscending(){
    const products = []; // array of Product object
    const result = await cfn_getProductListByPriceAscending({});
    result.data.forEach(element => {
        const p = new Product(element);
        p.set_docId(element.docId);
        products.push(p);
    });
    return products;
}
//Mounica Tulasi - Sorting Name
const cfn_getProductListDescending = httpsCallable(functions, 'cfn_getProductListDescending');
export async function getProductListDescending(){
    const products = []; // array of Product object
    const result = await cfn_getProductListDescending({});
    result.data.forEach(element => {
        const p = new Product(element);
        p.set_docId(element.docId);
        products.push(p);
    });
    return products;
}
//Mounica Tulasi - Sorting Price
const cfn_getProductListByPriceDescending = httpsCallable(functions, 'cfn_getProductListByPriceDescending');
export async function getProductListByPriceDescending(){
    const products = []; // array of Product object
    const result = await cfn_getProductListByPriceDescending({});
    result.data.forEach(element => {
        const p = new Product(element);
        p.set_docId(element.docId);
        products.push(p);
    });
    return products;
}