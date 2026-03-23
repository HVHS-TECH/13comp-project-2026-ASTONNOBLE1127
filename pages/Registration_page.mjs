/*********************************************************/
//Registration_page.mjs
//written by Aston Noble
//started 23/03/2026
//updated 23/03/2026
//registration page class, makes the registration page
/*********************************************************/

/*********************************************************/
//imports
/*********************************************************/
import Page from "./Page.mjs"

export default class Registration_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Registration_page"

    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        return this.makeElement('div',{},[
            this.makeElement('h1',{
                id: 'title'
            }),
            this.makeElement('p',{
                id: 'description'
            }),
            this.makeElement('form',{
                id: 'registration_form'
            },[])
        ])
    }
    
    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    displayText() {
        document.getElementById('title').textContent = "Registration Page";
        document.getElementById('description').textContent = "Fill the fields below to register"
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
        return Registration_page.#PAGEID
    }
}