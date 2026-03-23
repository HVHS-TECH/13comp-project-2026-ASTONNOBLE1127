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
                id: 'registration-form'
            },[
                this.makeElement('button',{
                    id: 'submit',
                    type: 'submit'
                })
            ])
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
        this.createForm({cheese:'',cheddar:''},{cheese:'number'})
        document.getElementById('registration-form').addEventListener('submit', (_event) => this.attemptRegister(_event));

    }

    /*****************************************************/
    //attemptRegister(_event)
    //
    //input _event
    //=event passed from the listener
    //
    //makes the page not reload and attemps to register
    /*****************************************************/
    attemptRegister(_event){
        _event.preventDefault();
        const FORMFIELDS = document.querySelectorAll('.field');
        FORMFIELDS.forEach(_el =>
            console.log(_el.value))
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