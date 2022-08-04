const API_HOST = "http://localhost:3000/api/addresses/";

let oldAddress = false;
let editId;

const Modal = {
    toggle(){
        document.querySelector('.modal-overlay').classList.toggle('active');
    }
}

async function getAddresses(){
    const response = await fetch(API_HOST);
    const data = await response.json()
    return data;
}

function printAddresses(){
    getAddresses().then((db) => {
        const main = document.querySelector('main');
        const section = document.createElement('section');
        section.classList = 'addressList';
        main.appendChild(section);

        for(let i = 0; i<db.length; i++){
            const ul = document.createElement('ul');
            ul.id = db[i].id;
            section.appendChild(ul);
            ul.appendChild(createName(db[i]));
            ul.appendChild(createStreet(db[i]));
            ul.appendChild(createCity(db[i]));
            ul.appendChild(createState(db[i]));
            ul.appendChild(removeButton(db[i]));
            ul.appendChild(editButton(db[i]));
        }
    })  
}

async function postAddress(address){
    const response = await fetch(API_HOST, {
        method: "POST",
        body: JSON.stringify(address),
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
    })
    const data = await response.json()
            .then((info) => console.log('The address has been added'))
            .catch((error) => alert('Something went wrong ' + error))
    
}

async function deleteAddress(id){
   const response = await fetch(`${API_HOST}+${id}`, {
    method: 'Delete',
    headers: {'Content-type': 'application/json'}
})
    .then((data) => data.json())
    .catch((error) => console.log(error))
    return response;
}

async function updateAddress(address, id){
    const response = await fetch(`${API_HOST}${id}`, {
        method: 'PATCH',
        body: JSON.stringify(address),
        headers: {
            'Content-type': 'application/json'
        },
    })
    const data = await response.json()
            .then(() => console.log('Update successfully completed'))
            .catch((error) => alert('Somenthing went wrong' + error))
}

const DOM = {
    addressList: document.querySelector('main'),

    clearList(){
        DOM.addressList.innerHTML = "";
    }
}

function createName(data){
    const li = document.createElement('li');
    li.innerHTML = `Name: ${data.name}`;
    li.classList = 'name'
    return li;
}

function createStreet (data){
    const li = document.createElement('li');
    li.innerHTML = `Street: ${data.street}`;
    li.classList = 'street';
    return li;
}

function createCity(data){
    const li = document.createElement('li');
    li.innerHTML = `City: ${data.city}`;
    li.classList = 'city';
    return li;
}

function createState(data){
    const li = document.createElement('li');
    li.innerHTML = `State: ${data.state}`;
    li.classList = 'state';
    return li;
}

function removeButton(data){
    const button = document.createElement('button');
    button.innerText='Remove';
    button.id = `remove${data.id}`;
    button.classList = 'btn-remove';
    button.addEventListener('click', () => removeAddress(data.id));
    return button;
}

function editButton(data){
    const btn = document.createElement('button');
    btn.innerHTML = 'Edit';
    btn.id = `edit${data.id}`;
    btn.classList = 'btn-edit';
    btn.addEventListener('click', () => {
        Modal.toggle()
        oldAddress = true
        editId = data.id;
    } )
    return btn;
}

const Form = {
    name: document.querySelector('input#name'),
    street: document.querySelector('input#street'),
    city: document.querySelector('input#city'),
    state: document.querySelector('input#state'),

    getValues(){
        return {
            name: Form.name.value,
            street: Form.street.value,
            city: Form.city.value,
            state: Form.state.value
        }
    },

    validateFields(){
        const {name, street, city, state} = Form.getValues();

        if(name.trim() === "" || street.trim() === "" || city.trim() === "" || state.trim() === ""){
            throw new Error ('Please, fill in all spaces');
        } else { return {name, street, city, state} }
    },

    clearFields(){
        Form.name.value = "",
        Form.street.value = "",
        Form.city.value = "",
        Form.state.value = ""
    },

    submit(event){
        
        if(oldAddress){
            try{
                const address = Form.validateFields();
                updateAddress(address, editId);
                App.reload();
                Form.clearFields();
                Modal.toggle();
                oldAddress = false;
                editId = 0;
                location.reload();
            } catch(error) { 
                alert(error.message)
            }
        } else {try {
            const address = Form.validateFields();
            postAddress(address);
            App.reload();
            Form.clearFields();
            Modal.toggle();
            location.reload();

        } catch(error){
            alert(error.message)
        }}
    }
}

function removeAddress(id){
    const addressToRemove = document.querySelector(`[id='${id}']`);
    if(addressToRemove != undefined){
        addressToRemove.remove();
    }

    deleteAddress(id);
}

function editAddress(data){
    const dbAddress = printAddresses();
    dbAddress[data.id] = data;
    return updateAddress(dbAddress);
}

function searchAddress(value){
    let address ;
    const dbAddress = getAddresses().then((db) => {
        address = db.filter((address) => address.name.toLowerCase() === value.toLowerCase())
        if(address.length !== 0){
            DOM.clearList();
            const main = document.querySelector('main');
            const section = document.createElement('section');
            section.classList = 'addressList';
            main.appendChild(section);
            
            for(let i = 0; i<address.length; i++){
                const ul = document.createElement('ul');
                ul.id = address[i].id;
                section.appendChild(ul);
                ul.appendChild(createName(address[i]));
                ul.appendChild(createStreet(address[i]));
                ul.appendChild(createCity(address[i]));
                ul.appendChild(createState(address[i]));
                ul.appendChild(removeButton(address[i]));
                ul.appendChild(editButton(address[i]));
            }
        } 
    });  
}

const App = {
    init(){
        printAddresses();
    },

    reload(){
        DOM.clearList();
        App.init();
    }
}


App.init()

