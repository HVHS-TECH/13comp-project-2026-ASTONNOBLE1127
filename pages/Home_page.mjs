/*********************************************************/
//Home_page.mjs
//written by Aston Noble
//started 01/04/2026
//updated 25/04/2026
//home page class, makes the home page
/*********************************************************/

import Page from "./Page.mjs"
import Registration_page from "./Registration_page.mjs"
import {
    INSTANCES,
    CONTENT_MANAGER_INSTANCE,
    FB_IO_INSTANCE
} from "../controllers/Instance_vault.mjs"

export default class Home_page extends Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //ID of the page
    static #PAGEID = "Home_page"
    //list of gates directing to
    static #GATES = {
        mahjong:{
            page:Registration_page,
            leaderboard:true,
            thumbnail:'unnamed1.png'
        }
    }

    /*****************************************************/
    //prepareHTML()
    //
    //prepares the HTML for creation
    /*****************************************************/
    prepareHTML() {
        return this.makeElement('div',{},[
            this.makeElement('div',{id:'header'},[]),
            this.makeElement('div',{id:'body',class:'body'},[
                this.makeElement('p',{})
            ])
        ])
    }

    /*****************************************************/
    //displayText()
    //
    //sets the text on the page and makes the buttons work
    /*****************************************************/
    displayText() {
        this.createGates({mahjong:true,unnamed1:false},{mahjong:'unnamed.png',unnamed1:'unnamed1.png'})
    }
    
    /*****************************************************/
    //createGates()
    //
    //creates the thumbnail/gates to the games
    /*****************************************************/
    createGates() {
        let element = []
        Object.keys(Home_page.#GATES).forEach(_gate => {
            let subElement = []
            subElement.push(
                this.makeElement('img',{
                    class:'thumb',src:`../${Home_page.#GATES[_gate].thumbnail}`}),
                this.makeElement('button',{class:'play',id:_gate})
            )
            if (Home_page.#GATES[_gate].leaderboard = true) {
                subElement.push(this.makeElement('button',{class:'leaderboard',id:`${_gate}L`}))}
            element.push(this.makeElement('div',{class:'gate'},subElement))
        })
        this.appendGates(element)
    }

    /*****************************************************/
    //appendGates(_gates)
    //
    //input _gates
    //=the gates to append
    //
    //appends the gates to the body
    /*****************************************************/
    appendGates(_gates) {
        _gates.forEach(_el => 
            document.querySelector('.body').appendChild(_el))
        document.querySelectorAll('.play').forEach(_el => {
            _el.onclick = () => {
                INSTANCES[CONTENT_MANAGER_INSTANCE].changePage(Home_page.#GATES[_el.id].page)}
            _el.innerHTML = 'play'})
        document.querySelectorAll('.leaderboard').forEach(_el =>
            _el.innerHTML = 'leaderboard')
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
        return Home_page.#PAGEID
    }
}