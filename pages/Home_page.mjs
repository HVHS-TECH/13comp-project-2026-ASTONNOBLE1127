/*********************************************************/
//Home_page.mjs
//written by Aston Noble
//started 23/03/2026
//updated 23/03/2026
//home page class, makes the home page
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import Page from "./Page.mjs"
import Registration_page from "./Registration_page.mjs";
import {
    INSTANCES,
    CONTENT_MANAGER_INSTANCE,
    FB_IO_INSTANCE
} from "../controllers/Instance_vault.mjs"

export default class Home_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Home_page"

    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML(_form) {
        return this.makeElement('div',{},[
            this.makeElement('h1',{
                id: 'title'
            }),
            this.makeElement('p',{
                id: 'description'
            }),
            this.makeElement('button',{
                id: 'login_button'
            })
        ])
    }

    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    displayText() {
        document.getElementById('title').textContent = "Welcome to the Home Page!";
        document.getElementById('description').textContent = "click the button below to login"
        document.getElementById('login_button').textContent = "login"
        document.getElementById('login_button').onclick = async () => {
            if (await INSTANCES[FB_IO_INSTANCE].googleAuthenticate()) INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Registration_page)
        }
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
        return Home_page.#PAGEID
    }
}