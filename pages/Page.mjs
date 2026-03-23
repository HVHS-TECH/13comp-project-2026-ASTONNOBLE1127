/*********************************************************/
//Page.mjs
//written by Aston Noble
//started 23/03/2026
//updated 23/03/2026
//parent class for the pages
/*********************************************************/

export default class Page {
    /*****************************************************/
    //private fields
    /*****************************************************/
    //#element is the top level page element
    #element

    /*****************************************************/
    //constructor()
    //
    //calls the making of the page on initialization 
    /*****************************************************/
    constructor() {
        this.#element = document.createElement('div');
    }

    /*****************************************************/
    //cull()
    //
    //cull the page
    /*****************************************************/
    cull() {
        this.#element.remove();
    }

    /*****************************************************/
    //makeElement(_type,_attributes,_children = [])
    //
    //input _type
    //=the type of element being created
    //input _attributes
    //=array with the attributes of the element
    //input _children = []
    //=array with the children elements 
    //
    //output
    //=the created element ready for appending
    //
    //creates elements ready for appending
    /*****************************************************/
    makeElement(_type,_attributes = {},_children = []) {
        let ELEMENT = document.createElement(_type)
        Object.keys(_attributes).forEach(
            _key => ELEMENT.setAttribute(key,_attributes[key]))
        _children.forEach(_child => ELEMENT.appendChild(_child))
        return ELEMENT
    }

    /*****************************************************/
    //abstract methods
    /*****************************************************/
    prepareHTML(){};
    displayText(){};
    getPageID(){};
}