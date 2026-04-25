/*********************************************************/
//Header.mjs
//written by Aston Noble
//started 24/04/2026
//updated 25/04/2026
//header class, makes the header
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import Page from "./Page.mjs"
import Landing_page from "./Landing_page.mjs"
import Home_page from "../pages/Home_page.mjs"
import {
    INSTANCES,
    CONTENT_MANAGER_INSTANCE,
    FB_IO_INSTANCE
} from "../controllers/Instance_vault.mjs"

export default class Header extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //#header is the reference to the header element
    #header
    //ID of the page
    static #PAGEID = "Landing_page"

    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        return this.makeElement('div',{},[
            this.makeElement('button',{id:'homebutton'}),
            this.makeElement('div',{id:'admindiv'}),
            this.makeElement('button',{id:'signout'})
        ])
    }
    
    /*****************************************************/
    //getPageID()
    //
    //output
    //=page ID
    //
    //litterally just returns #PAGEID
    /*****************************************************/
    getPageID() {
        return Header.#PAGEID
    }

    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    displayText() {
        const HOME = document.getElementById('homebutton')
        const SIGNOUT = document.getElementById('signout')
        HOME.textContent = 'home'
        SIGNOUT.textContent = 'signout'
        HOME.onclick = () => {
            if (INSTANCES[FB_IO_INSTANCE].auth()) {
                INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Home_page)
            } else INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Landing_page)
        }
        SIGNOUT.onclick = () => {
            INSTANCES[FB_IO_INSTANCE].signOut()
        }
    }
}