async function  singupform (event){
    event.preventDefault();
    let data={
        name:event.target.name.value,
        phone:event.target.phone.value,
        email:event.target.email.value,
        password:event.target.password.value
    }
    console.log(data)
    try{
        const singupform = await axios.post('http://localhost:3000/singupformdata',data);
        event.target.reset()
        window.location.href="../login/login.html"
        console.log('ok')
    }catch(err){
        console.log('err')
    }
}    
