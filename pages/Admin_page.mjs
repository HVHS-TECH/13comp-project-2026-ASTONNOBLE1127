/*********************************************************/
//Admin_page.mjs
//written by Aston Noble
//started 09/06/2026
//updated 09/06/2026
//admin page class, makes the admin page
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

export default class Admin_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Admin_page"

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
            this.makeElement('div',{
                id:'path'
            }),
            this.makeElement('div',{
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
        document.getElementById('title').textContent = "Welcome to the Admin Page!";
        document.getElementById('description').textContent = "change the fields below to modify admin"
        this.makeAdmin('/')
        //document.getElementById('submit').innerHTML = 'submit'
        // const UID = INSTANCES[FB_IO_INSTANCE].getUID()
        // let admin = await INSTANCES[FB_IO_INSTANCE].FB_Read(`users/${UID}`)
        // console.log(admin)
        // let publick = Object.keys(admin.public)
        // Object.keys(admin.private).forEach(_private => {
        //     document.getElementById('admin_form').append(
        //         this.makeElement('label',{id:`${_private}label`}),
        //         this.makeElement('label',{id:`${_private}value`})
        //     )
        //     document.getElementById(`${_private}label`).innerHTML = _private + ': '
        //     document.getElementById(`${_private}value`).innerHTML = admin['private'][_private]
        // })
        // let type = {}
        // publick.forEach(_field => type[_field] = 'string')
        // type['age'] = 'number'
        // this.createForm(admin.public,type)
        // document.getElementById('title').textContent = "Welcome to the Admin Page!";
        // document.getElementById('description').textContent = "change the fields below to modify admin"
        // document.getElementById('submit').innerHTML = 'submit'
        document.getElementById('account_form').addEventListener("keydown", this.updateDB.bind(this));
        //.addEventListener('submit', (_event) => this.updateDB(_event))
    }

    //
    //
    //
    async makeAdmin(_path) {
        document.getElementById('path').innerHTML = ''
        let indicies = [0]
        for (let i = 0; i < _path.length; i++) {
            if (_path[i] == '/') indicies.push(i+1)
        }
        let els = []
        for (let i = 0 ; i < indicies.length-1; i++) {
            els.push(this.makeElement('button',{id:i,class:'paths'}))
        }
        document.getElementById('path').append(this.makeElement('div',{},els))
        for (let i = 0 ; i < indicies.length-1; i++) {
            document.getElementById(i).innerHTML = _path.slice(indicies[i],indicies[i+1])
            document.getElementById(i).onclick = () => {this.makeAdmin(_path.slice(0,indicies[i+1]))}
        }
        document.getElementById('account_form').innerHTML = ''
        const ADMIN = await INSTANCES[FB_IO_INSTANCE].FB_Read(_path)
        Object.keys(ADMIN).forEach(_field => {
            if (this.isObject(ADMIN[_field])) {
                document.getElementById('account_form').append(
                    this.makeElement('label',{id:`${_field}label`}),
                    this.makeElement('button',{id:`${_field}value`,class:'adminlink'})
                )
                document.getElementById(`${_field}label`).innerHTML = _field + ': '
                document.getElementById(`${_field}value`).innerHTML = 'enter'
                document.getElementById(`${_field}value`).onclick = () => {
                    this.makeAdmin(`${_path}${_field}/`)
                }
            } else {
                document.getElementById('account_form').append(
                    this.makeElement('label',{id:`${_field}label`}),
                    this.makeElement('input',{id:`${_field}`,class:'adminfield','data-value':_path})
                )
                document.getElementById(`${_field}label`).innerHTML = _field + ': '
                document.getElementById(`${_field}`).setAttribute('value',ADMIN[_field])
            }
        })
    }

    //
    //
    //
    async updateDB() {
        let key = event.key;
        if (key == "Enter") {
        } else return
        console.log('bitch')
        //_event.preventDefault();
        const FORMFIELDS = document.querySelectorAll('.adminfield');
        FORMFIELDS.forEach(_el => {
            console.log(_el.getAttribute('data-value'),{[_el.id]:_el.value})
            INSTANCES[FB_IO_INSTANCE].FB_Write(_el.getAttribute('data-value'),{[_el.id]:_el.value})
        })
    }

    //
    //
    //
    isObject(_value) {
        return typeof _value === 'object' && _value !== null && !Array.isArray(_value);
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
        return Admin_page.#PAGEID
    }
}