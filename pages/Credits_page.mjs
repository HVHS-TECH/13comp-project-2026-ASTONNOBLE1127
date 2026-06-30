/*********************************************************/
//Credits_page.mjs
//written by Aston Noble
//started 30/06/2026
//updated 30/03/2026
//credits page class, makes the credits page
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

export default class Credits_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Credits_page"

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
                this.makeElement('img',{
                    src:"../images/starbucks.png",
                    class: "creds"
                }),
                this.makeElement('a',{
                    id:'starbucks',
                    href:'https://pngtree.com/freepng/logo-frame_7456369.html'
                }),
                this.makeElement('img',{
                    src:"../images/gamer.png",
                    class: "creds"
                }),
                this.makeElement('a',{
                    id:'gamer',
                    href:'https://pngtree.com/freepng/metallic-game-avatar-frame-vector-icon_7393473.html'
                })
            ])
        ])
    }
    
    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    async displayText() {
        document.getElementById('title').textContent = "credits Page";
        document.getElementById('description').textContent = "attributions below"
        document.getElementById('starbucks').innerHTML= 'png image from pngtree.com'
        document.getElementById('gamer').innerHTML= 'png image from pngtree.com'
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
        return Credits_page.#PAGEID
    }
}