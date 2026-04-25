/*********************************************************/
//FB_IO.mjs
//written by Aston Noble
//started 22/03/2026
//updated 25/04/2026
//holds all the firebase methods
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    update,
    query,
    orderByChild,
    orderByKey,
    limitToFirst,
    limitToLast,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { CONTENT_MANAGER_INSTANCE, INSTANCES } from "./Instance_vault.mjs";
import Home_page from "../pages/Home_page.mjs"
import Landing_page from "../pages/Landing_page.mjs";

export default class FB_IO {
    /*****************************************************/
    //constructor(_FB_Config)
    //
    //input _FB_Config
    //=the config to the firebase
    //
    //calls the FB_Init method
    /*****************************************************/
    constructor(_FB_Config) {
        this.FB_Init(_FB_Config);
    }

    /*****************************************************/
    //FB_Init(_FB_Config)
    //
    //input _FBConfig
    //=the config to the firebase
    //
    //initializes the firebase
    /*****************************************************/
    async FB_Init(_FB_Config) {
        getDatabase(initializeApp(_FB_Config));
        this.userCheck()
    }

    /*****************************************************/
    //FB_Write(_path,_object)
    //
    //input _path
    //=path to write to
    //input _object
    //=object to write to the firebase
    //
    //output
    //=proof that the promise was fufilled
    //
    //writes _object to _path in the firebase
    /*****************************************************/
    async FB_Write(_path,_object) {
        const FB_REF = ref(getDatabase(),_path);
        return await update(FB_REF,_object);
    }

    /*****************************************************/
    //FB_Read(_path)
    //
    //input _path
    //=path to read from
    //
    //output
    //=read result, also proof of promise fufilled
    //
    //reads _path from the firebase and returns result
    /*****************************************************/
    async FB_Read(_path) {
        const FB_REF = ref(getDatabase(),_path);
        const RAWREAD = await get(FB_REF);
        return RAWREAD.val();
    }

    /*****************************************************/
    //FB_SortedRead(_path,_side,_quantity,_orderBy)
    //
    //input _path
    //=path to read from
    //input _side
    //=which side to take from
    //input _quantity
    //=how much to take from that side
    //input orderBy
    //=whether to order by child or key
    //
    //output
    //=sorted read results, also proof of promise fufilled
    //
    //outputs a sorted selection of data from the firebase
    /*****************************************************/
    async FB_SortedRead(_path,_side,_quantity,_orderBy) {
        const FB_REF = ref(getDatabase(),_path);
        const LIMITTO = await this.isHigh(_side,_quantity);
        const ORDERBY = await this.isOrderChild(_orderBy);
        const QUERY = query(FB_REF,ORDERBY,LIMITTO);
        return await get(QUERY);
    }

    /*****************************************************/
    //FB_Remove(_path)
    //
    //input _path
    //=path to remove
    //
    //output
    //=proof that the promise was fufilled
    //
    //removes _path from the firebase
    /*****************************************************/
    async FB_Remove(_path) {    
        const FB_REF = ref(getDatabase(),_path);
        return await remove(FB_REF);
    }

    /*****************************************************/
    //FB_Listener(_path,_method)
    //
    //input _path
    //=path to listen for changes in
    //input _method
    //=the method called to handle the data
    //
    //work in progress
    /*****************************************************/
    FB_Listener(_path,_method) {
        const FB_REF = ref(getDatabase(),_path);
        onValue(FB_REF, (snapshot) => {
            const FB_DATA = snapshot.val();
            _method(FB_DATA);
        })
    }
    
    /*****************************************************/
    //isHigh(_input,_quantity)
    //
    //input _input
    //=boolean with true for high and false for low
    //input _quantity
    //=quantity to read
    //
    //output
    //=limitToFirst(_quantity) or limitToLast(_quantity)
    //
    //used for the FB_SortedRead method
    /*****************************************************/
    isHigh(_input,_quantity) {
        if (_input == true) return limitToFirst(_quantity)
        else return limitToLast(_quantity)
    }

    /*****************************************************/
    //isOrderChild(_input)
    //
    //input _input
    //=boolean with true for child and false for key
    //
    //output
    //=orderByChild() or orderByKey()
    //
    //used for the FB_SortedRead method
    /*****************************************************/
    isOrderChild(_input) {
        if (_input == true) return orderByChild()
        else return orderByKey()
    }
    
    /*****************************************************/
    //
    //google auth methods
    //
    /*****************************************************/

    /*****************************************************/
    //googleAuthenticate()
    //
    //authenticates the user to the firebase
    /*****************************************************/
    async googleAuthenticate() {
        const PROVIDER = new GoogleAuthProvider()
        PROVIDER.setCustomParameters({prompt: 'select_account'})
        const AUTH = await signInWithPopup(getAuth(), PROVIDER)
        if (await this.FB_Read("users/"+AUTH.user.uid) == null) return true 
        else return false
    }

    /*****************************************************/
    //userCheck(_function)
    //
    //input _function
    //=the function to call when checked
    //
    //calls onAuthStateChange
    /*****************************************************/
    userCheck(_function) {
        onAuthStateChanged(getAuth(),async _user => {
            if(_user != null) {
                if (await this.FB_Read(`/users/${_user.uid}/publicFixed/uid`) == _user.uid) {
                    await console.log('success')
                    INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Home_page)
                }
            }
        })
    }

    /*****************************************************/
    //auth()
    //
    //output
    //=true or false
    //
    //checks if the user is authed
    /*****************************************************/
    auth() {
        if (getAuth().currentUser != null) return true
            else return false
    }

    /*****************************************************/
    //FB_Register(_formFields)
    //
    //input _formFields
    //=the fields of the form calling the function
    //
    //registers the users details to the firebase
    /*****************************************************/
    FB_Register(_formFields){
        onAuthStateChanged(getAuth(),_user => {
            let userDetails = {
                [_user.uid]:{
                    private: {
                        email: _user.email
                    },
                    publicFixed: {
                        PhotoURL: _user.photoURL,
                        uid: _user.uid
                    },
                    public: _formFields
                }
            }
            this.FB_Write("/users/",userDetails);
        })
    }

    /*****************************************************/
    //signOut()
    //
    //signs the user out and sends them to the landing page
    /*****************************************************/
    async signOut() {
        await signOut(getAuth())
        INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Landing_page)
    }
}