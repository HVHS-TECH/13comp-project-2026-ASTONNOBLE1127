/*********************************************************/
//Chat.mjs
//written by Aston Noble
//started 24/04/2026
//updated 15/06/2026
//chat class, makes the chat
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import Page from "./Page.mjs"
import Landing_page from "./Landing_page.mjs"
import Home_page from "./Home_page.mjs"
import Leaderboards_page from "./Leaderboards_page.mjs"
import Account_page from "./Account_page.mjs"
import {
    INSTANCES,
    CONTENT_MANAGER_INSTANCE,
    FB_IO_INSTANCE
} from "../controllers/Instance_vault.mjs"
import Admin_page from "./Admin_page.mjs"

export default class Chat extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Landing_page"

    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        return this.makeElement('div',{},[
            this.makeElement('div',{id:'pfpDiv'},[this.makeElement('img',{id:'pfp',src:'./images/unnamed.png'})]),
            this.makeElement('div',{id:'homebuttondiv',class:'chatdiv'},[this.makeElement('button',{id:'homebutton'})]),
            this.makeElement('div',{id:'accountbuttondiv',class:'chatdiv'},[this.makeElement('button',{id:'accountbutton'})]),
            this.makeElement('div',{id:'leaderboardsdiv',class:'chatdiv'},[this.makeElement('button',{id:'leaderboards'})]),
            this.makeElement('div',{id:'signoutdiv',class:'chatdiv'},[this.makeElement('button',{id:'signout'})]),
            this.makeElement('div',{id:'admindiv',class:'chatdiv'})
        ])
    }

    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    displayText() {
        const HOME = document.getElementById('homebutton')
        const ACCOUNT = document.getElementById('accountbutton')
        const SIGNOUT = document.getElementById('signout')
        const LEADERBOARDS = document.getElementById('leaderboards')
        HOME.textContent = 'home'
        SIGNOUT.textContent = 'signout'
        LEADERBOARDS.textContent = 'leaderboards'
        ACCOUNT.textContent = 'account'
        HOME.onclick = () => {
            if (INSTANCES[FB_IO_INSTANCE].auth()) {
                INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Home_page)
            } else INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Landing_page)
        }
        SIGNOUT.onclick = () => {
            INSTANCES[FB_IO_INSTANCE].signOut()
            document.getElementById('adminbutton')?.remove()
        }
        LEADERBOARDS.onclick = () => INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Leaderboards_page)
        ACCOUNT.onclick = () => INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Account_page)
        INSTANCES[FB_IO_INSTANCE].userCheck(this.checkAdmin.bind(this))
    }
    
    /*****************************************************/
    //checkAdmin()
    //
    //checks if the user is an admin    
    /*****************************************************/
    async checkAdmin() {
        
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
        return Chat.#PAGEID
    }
}