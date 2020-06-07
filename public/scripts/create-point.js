// Function to list all states provided by IBGE Brasil API
function populateUFs() {
    
    const ufSelect = document.querySelector("select[name=uf]")

    // Requesting the list of states provided by IBGE Brasil API
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        .then( res => res.json() )
        .then( states => {
            for( const state of states ) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>` 
            }                    
        } )
}

populateUFs()

// Function to list all cities provided by IBGE Brazil API, in addition to releasing the city selector after selecting the state
function getCities() {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    // Updates the list of cities when changing states
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    // Requesting the list of cities provided by IBGE Brasil API
    fetch(url)
        .then( res => res.json() )
        .then( cities => {
            for( const city of cities ) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>` 
            }              
            citySelect.disabled = false
        } )
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

// changes collect items buttons when they are clicked
const itemsToCollect = document.querySelectorAll(".items-grid li")

for ( const item of itemsToCollect ) {
    item.addEventListener("click", handleSelectedItem)
}

// Update the hidden field - in create-point.html - with the variable selectedItems
const collectedItems = document.querySelector("input[name=items]")

// Variable used to store total of selected collect items
let selectedItems = [];

// Function to change classes of collect items buttons
function handleSelectedItem(event) {    
    const itemLi = event.target

    // Add or Remove some class with JavaScript
    itemLi.classList.toggle("selected")
    const itemId = itemLi.dataset.id

    // Check if there are selected items, if yes, pick the selected items
    const alreadySelected = selectedItems.findIndex( item => {
        const itemFound = item == itemId
        return itemFound
    })  
    
    // If already selected, remove from the selected items total
    if (alreadySelected >= 0) {
        // Remove from selected
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })
        selectedItems = filteredItems

    // If not already selected, add to the selected items total
    } else {
        selectedItems.push(itemId)
    }    
  
    collectedItems.value = selectedItems    
}