const create_room = async() =>{
    let btn = document.querySelector('#create_room_btn') 
    btn.remove()    
    let room_data = await fetch('/create_room')
    let room_data_json = await room_data.json();
    
    let room_link = document.createElement('a')
    room_link.href = room_data_json.room_name
    room_link.textContent = "Join Room"
    room_link.setAttribute('id', 'join_room_btn')
    document.body.appendChild(room_link)
}