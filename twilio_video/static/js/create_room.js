const create_room = async() =>{
    let btn = document.querySelector('#create_room_btn')  
    btn.remove()    
    let room_data = await fetch('/create_room')
    let room_data_json = await room_data.json();
    sessionStorage.setItem('room_name',room_data_json.room_name)
    sessionStorage.setItem('room_sid',room_data_json.room_sid)
    let room_link = document.createElement('a')
    const container = document.querySelector('.container')
    room_link.href = room_data_json.room_name
    room_link.textContent = "Join Room"
    room_link.setAttribute('id', 'join_room_btn')
    container.appendChild(room_link)
    let date = new Date();
    let room_start_time = date.getTime();
    sessionStorage.setItem('room_start_time', room_start_time)
    
    await sleep(endRoom,room_data_json.room_sid)
}

const endRoom = async(room_sid) =>{
    // room.participants.forEach(disconnect)
    room = await fetch(`/end_room/${room_sid}`)
    room_data = await room.json()
    console.log('room_end, roomdata = ',room_data)
    window.location.replace('/')
  }

const sleep = (fn, par)=>{
return new Promise((resolve) => {
    // wait 3s before calling fn(par)
    setTimeout(() => resolve(fn(par)), 20000)
})
}