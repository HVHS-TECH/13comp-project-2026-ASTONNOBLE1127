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
        this.#element.appendChild(this.prepareHTML());
    }

    /*****************************************************/
    //pageChangeHandler(_parent)
    //
    //input _parent
    //=the parent element to append to
    //
    //changes the title, and calls the display of text
    /*****************************************************/
    async pageChangeHandler(_parent) {
        document.title = this.getPageID();
        _parent.appendChild(this.#element);
        this.displayText();
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
            _key => ELEMENT.setAttribute(_key,_attributes[_key]))
        _children.forEach(_child => ELEMENT.appendChild(_child))
        return ELEMENT
    }

    /*****************************************************/
    //createForm(_ID = [],_inputType = [])
    //
    //input _ID
    //=ID and label of the new element
    //input inputType
    //=the type of input
    //
    //makes a form to prevent lots of repeating
    /*****************************************************/
    createForm(_ID = {},_inputType = {}) {
        let element = []
        Object.keys(_ID).forEach(_id => {
            element.push(
                this.makeElement('label',{
                    id: _id,
                    class: 'label'
                })
            )
            element.push(
                this.makeElement('input',{
                    id: _id,
                    class: 'field',
                    placeholder: _id,
                    value: _ID[_id],
                    type: _inputType[_id]
                })
            )
            element.push(this.makeElement('br'))
        })
        this.appendForm(element)
    }

    /*****************************************************/
    //appendForm(_form)
    //
    //input _form
    //=the form to append
    //
    //appends the form
    /*****************************************************/
    appendForm(_form) {
        _form.forEach(_el =>
        document.querySelector('form').appendChild(_el))
        document.querySelectorAll(".label").forEach(_el => 
            _el.innerHTML = _el.id + ": ")
    }

    /*****************************************************/
    //abstract methods
    /*****************************************************/
    prepareHTML(){};
    displayText(){};
    getPageID(){};
}