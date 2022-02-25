import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
    createUserWithEmailAndPassword, } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';
import * as Elements from '../viewpage/elements.js';
import * as Constants from '../model/constants.js';
import * as Util from '../viewpage/util.js';
import { routing,routePathnames } from './route.js';
import * as WelcomeMessage from '../viewpage/welcome_page.js';
const auth = getAuth();

export let currentUser = null;

export function addEventListeners() {
    Elements.formSignIn.addEventListener('submit', async e => {
        e.preventDefault();//keeps from refreshing current page
        const email = e.target.email.value;
        const password = e.target.password.value;

        if(!Constants.adminEmails.includes(email)){
            Util.info('Error','Only for admins',Elements.modalSignin);
            return;
        }

        try{
            await signInWithEmailAndPassword(auth,email,password);
            Elements.modalSignin.hide();
            console.log('Sign-in Success');
        }catch(e){
            if(Constants.DEV) console.log(e);
            Util.info('Sign in Error',JSON.stringify(e),Elements.modalSignin);

        }
    });

    Elements.menuSignout.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log('Sign out success');
        } catch (e) {
            Util.info('sign out error', JSON.stringify(e));
            if (Constants.DEV)
                console.log('Sign out error: Try Again' + e);
        }
    });

    onAuthStateChanged(auth, AuthStateChangedObserver);
}

function AuthStateChangedObserver(user) {
    if (user && Constants.adminEmails.includes(user.email)) {
        currentUser = user;
        let elements = document.getElementsByClassName('modal-preauth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
        elements = document.getElementsByClassName('modal-postauth'); {
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
            }
        }
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        routing(pathname, hash);
        //console.log('auth state changed: $(user.email)');
    }
    else {
        currentUser = null;
        let elements = document.getElementsByClassName('modal-preauth');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'block';
        }
        elements = document.getElementsByClassName('modal-postauth'); {
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'none';
            }
        }

        Elements.root.innerHTML=WelcomeMessage.html;

        history.pushState(null,null,routePathnames.HOME);
        //Elements.root.innerHTML = WelcomeMessage.html;
        //Elements.root.innerHTML = 'Signed Out';
        //console.log('auth state changed: Signed out');
    }
}
        