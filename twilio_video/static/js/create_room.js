const create_room = async() =>{
    let btn = document.querySelector('#create_room_btn')  
    let head1 = document.querySelector('#head1')
    let head2 = document.querySelector('#head2')
    const headings_container = document.querySelector('.headings')
    head1.remove()
    head2.remove()
    btn.remove()    
    let room_data = await fetch('/create_room')
    let room_data_json = await room_data.json();
    sessionStorage.setItem('room_name',room_data_json.room_name)
    sessionStorage.setItem('room_sid',room_data_json.room_sid)
    let room_link = document.createElement('a')
    const container = document.querySelector('.container')
    room_link.href = room_data_json.room_name
    room_link.target = '_blank'
    room_link.textContent = "Join Room"
    room_link.setAttribute('id', 'join_room_btn')
    container.appendChild(room_link)
    const new_heading1 = document.createElement('p')
    const new_heading2 = document.createElement('p')
    const new_heading3 = document.createElement('p')
    new_heading1.setAttribute('id','head1')
    new_heading2.setAttribute('id','head2')
    new_heading3.setAttribute('id','head3')
    new_heading1.setAttribute('class','header')
    new_heading2.setAttribute('class','header')
    new_heading3.setAttribute('class','header')
    new_heading1.textContent = " Your video call room link: "
    new_heading2.textContent = room_link
    new_heading3.textContent = "Scan to open link"
    headings_container.appendChild(new_heading1)
    headings_container.appendChild(new_heading2)
    headings_container.appendChild(new_heading3)
    let date = new Date();
    let room_start_time = date.getTime();
    sessionStorage.setItem('room_start_time', room_start_time)

    // Generate QR code
    qr_image = document.createElement('img')
    qr_image.src = `https://api.qrserver.com/v1/create-qr-code/?data=${window.location.href+room_data_json.room_name}/&size=200x200`
    qr_container = document.querySelector('#qr_container')
    qr_container.appendChild(qr_image)
    qr_url = 'https://api.qr-code-generator.com/v1/create/'    
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
    setTimeout(() => resolve(fn(par)), 1200000)
})
}