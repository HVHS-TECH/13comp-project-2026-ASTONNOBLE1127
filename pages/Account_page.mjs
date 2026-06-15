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
        return this.makeElement('div',{id:'leaderboards_div'},[
            this.makeElement('h1',{
                id: 'title'
            }),
            this.makeElement('p',{
                id: 'description'
            }),
            this.makeElement('form',{
                id: 'account_form'
            })
        ])
    }

    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    async displayText() {
        const UID = INSTANCES[FB_IO_INSTANCE].getUID()
        let account = await INSTANCES[FB_IO_INSTANCE].FB_Read(`users/${UID}`)
        console.log(account)
        let publick = Object.keys(account.public)
        Object.keys(account.private).forEach(_private => {
            document.getElementById('account_form').append(
                this.makeElement('label',{id:`${_private}label`}),
                this.makeElement('label',{id:`${_private}value`})
            )
            document.getElementById(`${_private}label`).innerHTML = _private + ': '
            document.getElementById(`${_private}value`).innerHTML = account['private'][_private]
        })
        let type = {}
        publick.forEach(_field => type[_field] = 'string')
        type['age'] = 'number'
        this.createForm(account.public,type)
        document.getElementById('title').textContent = "Welcome to the Account Page!";
        document.getElementById('description').textContent = "change the fields below to modify account"
        document.getElementById('submit').innerHTML = 'submit'
        document.getElementById('account_form').addEventListener('submit', (_event) => this.updateDetails(_event))
    }

    /*****************************************************/
    //updateDetails(_event)
    //
    //input _event 
    //=the form submit event
    //
    //updates the users details
    /*****************************************************/
    async updateDetails(_event) {
        _event.preventDefault();
        let registrationFields = {}
        const FORMFIELDS = document.querySelectorAll('.field');
        let invalid = false
        FORMFIELDS.forEach(_el => {
            if (_el.value.replace(/\s+/g, "").length > 0) {
                if (Number.isNaN(Number(_el.value))) registrationFields[_el.id] = _el.value
                else registrationFields[_el.id] = Number(_el.value)
                document.getElementById(_el.id + 'error').innerHTML = ''
            } else {
                invalid = true
                document.getElementById(_el.id + 'error').innerHTML = 'please fill in the field above'
            }
        })
        if (invalid == true) return
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
        return Account_page.#PAGEID
    }
}