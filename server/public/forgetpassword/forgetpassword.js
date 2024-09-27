async function forgetpassword(event){
    event.preventDefault();
    const data={
        email:event.target.email.value
    }
    console.log(data)
    try{
       const forgetpassword= await axios.post('http://13.48.30.5:3000:3000/forget/password',data);
       console.log(forgetpassword)
    }catch(err){
       console.log(err)
    }
        
}