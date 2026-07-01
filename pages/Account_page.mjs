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
        Object.keys(account.private).forEach(_private => {
            //if (_private != 'address') {
                document.getElementById('account_form').append(
                    this.makeElement('label',{id:`${_private}label`}),
                    this.makeElement('label',{id:`${_private}value`})
                )
                document.getElementById(`${_private}label`).innerHTML = _private + ': '
                document.getElementById(`${_private}value`).innerHTML = account['private'][_private]
            //}
        })
        let countriesRaw = await fetch('./countries_comprehensive.json')
        let countries = await countriesRaw.json()
        let regRaw = await fetch('./login_fields.json')
        let reg = await regRaw.json()
        reg["field"]["country of birth"] = countries
        console.log(reg["field"],account.public)
        let pre = {}
        Object.keys(reg["type"]).forEach(_obj => {
            if (reg['type'][_obj] != "dropdown") {
                if (account.public[_obj] == undefined) reg["field"][_obj] = ''
                else reg["field"][_obj] = account.public[_obj]
            } else if (_obj == 'gender') {
                reg['type'][_obj] = 'string'
                reg["field"][_obj] = account.public[_obj]
            }
        })
        this.createForm(reg["field"],reg["type"])
        Object.keys(reg["type"]).forEach(_obj => {
            if (reg['type'][_obj] == "dropdown") {
                document.getElementById(_obj).value = account.public[_obj]
            }
        })
        document.getElementById('submit').innerHTML = 'submit'
        const addressSearch = new autocomplete.GeocoderAutocomplete(
        document.getElementById("address-search"),
            "7add43974cb242659ce2a8bd7c9b709c",
            {
                skipIcons: false,
                allowNonVerifiedStreet: true,
                allowNonVerifiedHouseNumber: true,
                skipSelectionOnArrowKey: false
            }
        );
        document.querySelector(".geoapify-autocomplete-input").classList.add('field')
        document.querySelector(".geoapify-autocomplete-input").setAttribute('id','address')
        document.querySelector(".geoapify-autocomplete-input").value = account.private["address"]
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
        let accountFields = {}
        const FORMFIELDS = document.querySelectorAll('.field');
        let invalid = false
        FORMFIELDS.forEach(_el => {
            if (_el.validity.patternMismatch != true && (_el.value.replace(/\s+/g, "").length > 0 && _el.value.length <= 100) && (
                !(_el.nodeName == 'SELECT') || (_el.value != '--select--' ))) {
                if (Number.isNaN(Number(_el.value))) accountFields[_el.id] = _el.value
                else accountFields[_el.id] = Number(_el.value)
                document.getElementById(_el.id + 'error').innerHTML = ''
            } else {
                invalid = true
                document.getElementById(_el.id + 'error').innerHTML = 'please fill in the field above'
            }
        })
        if (invalid == true) return
        if (Object.keys(accountFields).length == FORMFIELDS.length) {
            console.log(accountFields)
            INSTANCES[FB_IO_INSTANCE].FB_Register(accountFields)
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