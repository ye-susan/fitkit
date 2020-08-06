const form = document.querySelector('form');
const loadingGif = document.querySelector('.loading');
const woofsElement = document.querySelector('.woofs');
const errorMsg = document.querySelector('.error-msg');
const API_URL = 'http://localhost:5000/woofs'

listAllWoofs();

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const woof = {
        name, 
        content
    }

    loadingGif.style.display = 'block';
    form.style.display = 'none';

    //trying to POST to server, sending it our woof object (with the name and content of the woof)
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(woof),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(createdWoof => {
            //once we've sent off the woof to the db, we want to reset the form and redisplay it
            form.reset();
            //unhide form in 30seconds
            setTimeout(() => {
                form.style.display = '';
            }, 30000);             
            listAllWoofs();
            loadingGif.style.display = 'none';

        })
        .catch(error => {
            console.log(error);
        });
})

function listAllWoofs() {
    //clear out woofs so we can append new ones (want to limit the list so it's not showing everything)
    woofsElement.innerHTML = "";

    //since we're making get request, we don't have to specify the requirements --- like header, body, method, etc.
    fetch(API_URL)
        .then(res => res.json())
        .then(woofs => {
            woofs.reverse();
            woofs.forEach(woof => {
               
                //display each woof onto the client page
                const div = document.createElement('div');
                const header = document.createElement('h3');
                header.textContent = woof.name;

                const contents = document.createElement('p');
                contents.textContent = woof.content;

                const date = document.createElement('small')
                date.textContent = new Date(woof.create);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                woofsElement.appendChild(div);
            });
            //hide loading spinner after all woofs load
            loadingGif.style.display = 'none';
        })
}