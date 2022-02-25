const functions = require("firebase-functions");

var admin = require("firebase-admin");

var serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const Constants = require('./constants.js');

function authorized(email){
    return Constants.adminEmails.includes(email);
}

exports.cfn_addProduct = functions.https.onCall(addProduct);
async function addProduct(data, context){
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('permission-denied','Only admin may invoke addProduct function');
    }

    try {
        const ref = await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS).add(data);
        return ref.id; //doc id
    } catch(e) {
        if (Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`add product failed: ${JSON.stringify(e)}`);
    }
}

exports.cfn_getProductList = functions.https.onCall(async (data, context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.HttpsError('permission-denied','Only admin may invoke getProductList function');
    }
    try{
        let products = [];
        const snapShot = await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS)
                                .orderBy('name')
                                .get();
        snapShot.forEach(doc => {
            const{name, price, summary, imageName, imageURL} = doc.data();
            const p = {name, price, summary, imageName, imageURL};
            p.docId = doc.id;
            products.push(p);
        })
        return products;
    }catch(e){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`Only admin may invoke getProductList failed: ${JSON.stringify(e)}`);
    }
});

exports.cfn_deleteProductDoc = functions.https.onCall(async (docId, context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('permission-denied','Only admin may invoke getProductList function');
    }
    try {
        await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS)
                    .doc(docId).delete();
    } catch (e) {
        if (Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`deleteProductDoc failed: ${JSON.stringify(e)}`);
    }
})

exports.cfn_getProductById = functions.https.onCall(async (docId, context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('permission-denied','Only admin may invoke getProductList function');
    }
    try{
        const doc = await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS)
                        .doc(docId).get();
        if(doc.exists){
           const {name, summary, price, imageName, imageURL} = doc.data();
           const p = {name, summary, price, imageName, imageURL};
           p.docId = doc.id;
           return p;
        }else{
            return null;
        }
    }catch(e){
        if (Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`getProductById failed: ${JSON.stringify(e)}`);
    }
})

exports.cfn_updateProductDoc = functions.https.onCall(async (data,context) => {
    //data ==> {docId, updateObject}, updateObject = {key,value}
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('permission-denied','Only admin may invoke updateProductDoc function');
    }
    try{
        await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS)
                    .doc(data.docId).update(data.updateObject);
    }catch(e){
        if (Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`updateProductDoc failed: ${JSON.stringify(e)}`);
    }
});

exports.cfn_getUserList = functions.https.onCall(async (data, context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('permission-denied','Only admin may invoke updateProductDoc function');
    }
    
    const userList = [];
    const MAXRESULTS = 10;
    try{
        const result = await admin.auth().listUsers(MAXRESULTS);
        userList.push(...result.users); // ... spread operator
        let nextPageToken = result.pageToken;
        while(nextPageToken){
            result = await admin.auth().listUsers(MAXRESULTS, nextPageToken);
            userList.push(...result.users);
            nextPageToken = result.pageToken;
        }
        return userList;
    }catch(e){
        if (Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`getUserList failed: ${JSON.stringify(e)}`);
    }
});

exports.cfn_updateUser = functions.https.onCall(async (data, context) => {
    //data => {uid, updateInfo},updateInfo = {key1: value1, key2: value2...}
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('permission-denied','Only admin may invoke updateProductDoc function');
    }
    try{
        const uid = data.uid;
        const update = data.update;
        await admin.auth().updateUser(uid, update);
    } catch(e){
        if (Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`updateUser failed: ${JSON.stringify(e)}`);
    }
});

exports.cfn_deleteUser = functions.https.onCall(async (uid,context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('permission-denied','Only admin may invoke updateProductDoc function');
    }
    try{
        await admin.auth().deleteUser(uid);
    } catch(e){
        if (Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`deleteUser failed: ${JSON.stringify(e)}`);
    }
});

//Mounica Tulasi - Searching Product
exports.cfn_searchProductList = functions.https.onCall(async (data, context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.HttpsError('permission-denied','Only admin may invoke searchProductList function');
    }
    try{
        let products = [];
        const snapShot = await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS)
                                .orderBy('name')
                                .get();
        snapShot.forEach(doc => {            
            const{name, price, summary, imageName, imageURL} = doc.data();
            const p = {name, price, summary, imageName, imageURL};
            if(p.name.toLowerCase().indexOf(data) != -1)
            {
                p.docId = doc.id;
                products.push(p);
            }
        })
        return products;
    }catch(e){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`Only admin may invoke searchProductList failed: ${JSON.stringify(e)}`);
    }
});

//Mounica Tulasi - Sorting Name
exports.cfn_getProductListAscending = functions.https.onCall(async (data, context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.HttpsError('permission-denied','Only admin may invoke getProductList function');
    }
    try{
        let products = [];
        const snapShot = await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS)
                                .orderBy('name')
                                .get();
        snapShot.forEach(doc => {
            const{name, price, summary, imageName, imageURL} = doc.data();
            const p = {name, price, summary, imageName, imageURL};
            p.docId = doc.id;
            products.push(p);
        })
        return products;
    }catch(e){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`Only admin may invoke getProductList failed: ${JSON.stringify(e)}`);
    }
});

//Mounica Tulasi - Sorting Price
exports.cfn_getProductListByPriceAscending = functions.https.onCall(async (data, context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.HttpsError('permission-denied','Only admin may invoke getProductList function');
    }
    try{
        let products = [];
        const snapShot = await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS)
                                .orderBy('price').get();
        snapShot.forEach(doc => {
            const{name, price, summary, imageName, imageURL} = doc.data();
            const p = {name, price, summary, imageName, imageURL};
            p.docId = doc.id;
            products.push(p);
        })
        return products;
    }catch(e){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`Only admin may invoke getProductList failed: ${JSON.stringify(e)}`);
    }
});

//Mounica Tulasi - Sorting Price
exports.cfn_getProductListDescending = functions.https.onCall(async (data, context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.HttpsError('permission-denied','Only admin may invoke getProductList function');
    }
    try{
        let products = [];
        const snapShot = await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS)
                                .orderBy('name','desc')
                                .get();
        snapShot.forEach(doc => {
            const{name, price, summary, imageName, imageURL} = doc.data();
            const p = {name, price, summary, imageName, imageURL};
            p.docId = doc.id;
            products.push(p);
        })
        return products;
    }catch(e){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`Only admin may invoke getProductList failed: ${JSON.stringify(e)}`);
    }
});

//Mounica Tulasi - Sorting Price
exports.cfn_getProductListByPriceDescending = functions.https.onCall(async (data, context) => {
    if(!authorized(context.auth.token.email)){
        if(Constants.DEV) console.log(e);
        throw new functions.HttpsError('permission-denied','Only admin may invoke getProductList function');
    }
    try{
        let products = [];
        const snapShot = await admin.firestore().collection(Constants.COLLECTION_NAMES.PRODUCTS)
                                .orderBy('price','desc')
                                .get();
        snapShot.forEach(doc => {
            const{name, price, summary, imageName, imageURL} = doc.data();
            const p = {name, price, summary, imageName, imageURL};
            p.docId = doc.id;
            products.push(p);
        })
        return products;
    }catch(e){
        if(Constants.DEV) console.log(e);
        throw new functions.https.HttpsError('internal',`Only admin may invoke getProductList failed: ${JSON.stringify(e)}`);
    }
});