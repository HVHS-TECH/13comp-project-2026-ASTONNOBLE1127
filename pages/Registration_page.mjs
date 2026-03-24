/*********************************************************/
//Registration_page.mjs
//written by Aston Noble
//started 23/03/2026
//updated 24/03/2026
//registration page class, makes the registration page
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
            })
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
        this.createForm({username:'',age:'',gender:{male:'',female:''}},{username:'string',age:'number',gender:'dropdown'})
        document.getElementById('registration-form').addEventListener('submit', (_event) => this.attemptRegister(_event));
        document.getElementById('submit').innerHTML = 'submit'

    }

    /*****************************************************/
    //attemptRegister(_event)
    //
    //input _event
    //=event passed from the listener
    //
    //makes the page not reload and attemps to register
    /*****************************************************/
    async attemptRegister(_event){
        _event.preventDefault();
        let registrationFields = {}
        const FORMFIELDS = document.querySelectorAll('.field');
        FORMFIELDS.forEach(_el => {
            if (_el.value.replace(/\s+/g, "").length > 0) {
                if (Number.isNaN(Number(_el.value))) registrationFields[_el.id] = _el.value
                else registrationFields[_el.id] = Number(_el.value)
            }
            else return
        })
        if (Object.keys(registrationFields).length == FORMFIELDS.length) {
            console.log(registrationFields)
            INSTANCES[FB_IO_INSTANCE].FB_Register(registrationFields)
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
        return Registration_page.#PAGEID
    }
}