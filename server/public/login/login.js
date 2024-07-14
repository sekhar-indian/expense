
async function loginform(event){
    event.preventDefault();
    const data={
        email:event.target.email.value,
        password:event.target.password.value
    }
   
    try{
        const loginformData= await axios.post('http://13.48.30.5:3000/loginformdata',data)
        if(loginformData.status==200){
            alert("login sucsuss")
            localStorage.setItem('jwtToken',loginformData.data);
            window.location.href="../expens/expens.html"
        }
        console.log(loginformData.status)
        event.target.reset()
        
    }catch(err){
         if(err.response.status==401){
                alert("Password not mach")
            }else if(err.response.status==404){
                alert(`Email not found`)
            }
    }
}    