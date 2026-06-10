/*********************************************************/
//Account_page.mjs
//written by Aston Noble
//started 09/06/2026
//updated 09/06/2026
//account page class, makes the account page
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

export default class Account_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Account_page"

    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        return this.makeElement('div',{id:'account_div'},[
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
        document.getElementById('title').textContent = "Welcome to the Account Page!";
        document.getElementById('description').textContent = "click the button below to login"
        document.getElementById('login_button').textContent = "login/register"
        document.getElementById('login_button').onclick = async () => {
            if (await INSTANCES[FB_IO_INSTANCE].googleAuthenticate())
                INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Registration_page);
             //console.log(getAuth().currentUser.uid)
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
        return Account_page.#PAGEID
    }
}