import { home_page } from "../viewpage/home_page.js";
import { users_page } from "../viewpage/users_page.js";
import { search_page } from "../viewpage/search_page.js";

export const routePathnames = {
    HOME: '/',
    USERS: '/users',
    SEARCH: '/search',
}

export const routes = [
    {path: routePathnames.HOME, page: home_page },
    {path: routePathnames.USERS, page: users_page},
    {path: routePathnames.SEARCH, page: search_page},
];

export function routing(pathname, hash){
    const route = routes.find(r => r.path == pathname);
    if(route){
        /*if(hash && hash.length > 1) 
            route.page(hash.substring(1));
        else */
            route.page();
    }else{
        routes[0].page();
    }
}