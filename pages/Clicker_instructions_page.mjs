/*********************************************************/
//Clicker_instructions_page.mjs
//written by Aston Noble
//started 02/07/2026
//updated 02/07/2026
//clicker_instructions_page page class, makes the clicker_instructions_page page
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import Page from "./Page.mjs"
import {
    INSTANCES,
    CONTENT_MANAGER_INSTANCE,
    FB_IO_INSTANCE
} from "../controllers/Instance_vault.mjs"

export default class Clicker_instructions_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Clicker_instructions_page"

    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        return this.makeElement('div',{},[
            this.makeElement('div',{id:'infodiv'},[
                this.makeElement('h1',{
                    id: 'title'
                }),
                this.makeElement('p',{
                    id: 'description'
                }),
            ])
        ])
    }
    
    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    async displayText() {
        document.getElementById('title').textContent = "clicker instructions page";
        document.getElementById('description').textContent = "click the image lol"
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
        return Clicker_instructions_page.#PAGEID
    }
}