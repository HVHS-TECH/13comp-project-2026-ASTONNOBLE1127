/*********************************************************/
//Home_page.mjs
//written by Aston Noble
//started 01/04/2026
//updated 23/04/2026
//home page class, makes the home page
/*********************************************************/

import Page from "./Page.mjs"
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
    //createGates(_leaderboard,_thumbnail)
    //
    //input _leaderboard
    //=does the game have a leaderboard
    //input _thumbnail
    //=the thumbnail and ID
    //
    //creates the thumbnail/gates to the games
    /*****************************************************/
    createGates(_leaderboard = {},_thumbnail = {}) {
        let element = []
        Object.keys(_thumbnail).forEach(_ID => {
            if (_leaderboard[_ID] == true) {
                element.push(
                    this.makeElement('div',{class:'gate'},[
                        this.makeElement('img',{class:'thumb',src:`../${_thumbnail[_ID]}`}),
                        this.makeElement('button',{class:'play',id:_ID}),
                        this.makeElement('button',{class:'leaderboard',id:`${_ID}L`})
                    ])
                )
            } else {
                element.push(
                    this.makeElement('div',{class:'gate'},[
                        this.makeElement('img',{class:'thumb',src:`../${_thumbnail[_ID]}`}),
                        this.makeElement('button',{class:'play',id:_ID})
                    ])
                )
            }
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
        document.querySelectorAll('.play').forEach(_el =>
            _el.innerHTML = 'play')
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