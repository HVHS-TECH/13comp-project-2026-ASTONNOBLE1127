/*********************************************************/
//Mahjong_page.mjs
//written by Aston Noble
//started 28/04/2026
//updated 28/04/2026
//mahjong class, makes the mahjong page
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import Page from "./Page.mjs"

export default class Mahjong_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Mahjong_page"
    
    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        return this.makeElement('div',{},[
            this.makeElement('button',{id:'join'}),
            this.makeElement('a',{id:'waitCount'}),
            this.makeElement('a',{id:'waitIndicator'})
        ])
    }

    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    displayText() {
        document.getElementById('join').innerHTML = 'join'
        document.getElementById('waitCount').innerHTML = '0'
        document.getElementById('join').onclick = () => {
            document.getElementById('waitIndicator').appendChild(this.makeElement(
                'div',{id:'waitBox'},[this.makeElement('a',{id:'waiting'}),
                    this.makeElement('button',{id:'leave'})]
            ))
            document.getElementById('waiting').innerHTML = 'waiting'
            document.getElementById('leave').innerHTML = 'leave'
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
        return Mahjong_page.#PAGEID
    }
}