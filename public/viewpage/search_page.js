import * as Elements from './elements.js';
import * as Util from './util.js';
import { routePathnames } from '../controller/route.js';
import { currentUser } from '../controller/firebase_auth.js';
import * as Constants from '../model/constants.js';
import { buildProductCard,EditDelete } from './home_page.js';
import * as CloudFunctions from '../controller/cloud_functions.js';

export function addEventListeners(){

    Elements.formSearch.addEventListener('submit',async e=> {
        e.preventDefault();
        const searchKeys = e.target.searchKeys.value.trim();
        
        if(searchKeys.length == 0){
            Util.info('Error','No Search Keys');
            return;
        }

        const button = e.target.getElementsByTagName('button')[0];
        const label = Util.disableButton(button);

        const SearchKeys = searchKeys.toLowerCase().match(/\S+/g);

        history.pushState(null,null,routePathnames + "#" + SearchKeys);
        await search_page(SearchKeys);

        Util.enableButton(button, label);

    });

}

export async function search_page(joinedSearchKeys) {
    if(!joinedSearchKeys){
        Util.info('Error','No Search Keys');
        return;
    }

    if(!currentUser){
        Elements.root.Elements = '<h1>Protected Page</h1>';
        return;
    }

    let productList;
    try{
        productList=await CloudFunctions.searchProduct(joinedSearchKeys);
    }catch(e){
        if(Constants.DEV) console.log(e);
        Util.info('Search Error', JSON.stringify(e));
        return;
    }

    let html= `
        <h1>Search for: ${joinedSearchKeys}</h1>
        <div>
            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#modal-add-product">
                +Add Product
            </button>
        </div>
    `;

    productList.forEach(p => {
        html += buildProductCard(p);
    });

    Elements.root.innerHTML=html;
    EditDelete();
}