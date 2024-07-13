async function forgetpassword(event){
    event.preventDefault();
    const data={
        email:event.target.email.value
    }
    console.log(data)
    try{
       const forgetpassword= await axios.post('http://localhost:3000/forget/password',data);
       console.log(forgetpassword)
    }catch(err){
       console.log(err)
    }
        
}