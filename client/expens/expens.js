
async function expenseAdd(event){
    event.preventDefault()
    const data={
        expense:event.target.expense.value,
        dicription:event.target.dicription.value,
        expenses:event.target.expenses.value,
        userid:localStorage.getItem('userid')
    }
    const jwtToken=localStorage.getItem('jwtToken');
try{
    const postData= await axios.post('http://localhost:3000/expense',data,{headers:{ 'Authorization': `Bearer ${jwtToken}`}});
    getDataExpenses()
    event.target.reset()
} catch(err){
    if(err.response.status==401){
        window.location.href='../login/login.html'
    }
} 
}

window.onload=()=>{
    getDataExpenses() 
    jwtTokenPrimium=localStorage.getItem('primium');
    decodeToken=parseJwt(jwtTokenPrimium);
    console.log('kkkk',decodeToken)
    if(decodeToken.premium ){
        document.getElementById('rzp-button1').style.visibility = 'hidden';
        document.getElementById('dowdloadExpence').removeAttribute('hidden');
        document.getElementById('massage').innerHTML = `<button class="leaderboard" onclick='leaderboard()' >show leadr board</button>`;
        s3fileslinks();
    }
}



function parseJwt(token) {
    // Example implementation to decode JWT token
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



let stoppagenumber;
async function getDataExpenses(page=1){
 const jwtToken=localStorage.getItem('jwtToken');

 try{
    
    const response=await axios.get(`http://localhost:3000/getExpenses/${page}`,{headers:{'Authorization': `Bearer ${jwtToken}`} })
        console.log(response.data);
        let chElement=document.getElementById('dataElement');
        chElement.innerHTML=''
        if(response.data.length==0){
            stoppagenumber=page;
        }
        for(let i=0;i<response.data.length;i++){
            let tempElement=document.createElement('div');
            tempElement.className='data-container'
            tempElement.id=`${response.data[i].id}`
            tempElement.innerHTML=`<div class='data-item-container'>${response.data[i].expense} => ${response.data[i].dicription} => ${response.data[i].expenses}</div>
            <button class='data-delete-button-container' onclick="deleteData(event,'${response.data[i].id}')">Delete</button>`;
            chElement.prepend(tempElement);
        }  
 }catch(err){
    if(err.response.status==401){
        window.location.href="../login/login.html"
   }
    else if(err.response.status==404){
        console('err')
    }else{
        console.log(err)
    }
    
 }
}



//delete button finction
function deleteData(event,i){
    const jwtToken=localStorage.getItem('jwtToken');
    console.log(i);
    const id = event.target.parentElement.id;
    axios.get(`http://localhost:3000/expenseDelete/${id}`,{
        headers:{
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(re=>{
        getDataExpenses()
        leaderboard()
        console.log(re)
    })
    .catch(er=>console.log(er))
    console.log(id)
}




document.getElementById('rzp-button1').onclick = function(e){
    const jwtToken=localStorage.getItem('jwtToken');
    axios.get('http://localhost:3000/premium',{
        headers:{
            'Authorization': `Bearer ${jwtToken}`
        }
    }).then(res=>{
    const {orderId,amount,currency}=res.data;
    console.log('hi')

    var options = {
        "key": "rzp_test_P9yDvw31QolihZ", // Enter the Key ID generated from the Dashboard
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": async function (response) {
                try{
                    const d= await axios.post('http://localhost:3000/premiumUpdate', {
                        orderId: orderId,
                        paymentId: response.razorpay_payment_id
                    }, {
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`
                        }
                    }).then(res=>{
                        alert('success')
                    localStorage.setItem('primium',res.data)
                    document.getElementById('rzp-button1').style.visibility = 'hidden'; 
                    leaderboard();
                    })

                }catch(err){
                    alert('Somthing wrong')
                }
        }

    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
    
    }).catch(err=>{
        console.log("err",err)
    })
}




async function leaderboard(){
    const jwtToken=localStorage.getItem('jwtToken');
    try{
        const res= await axios.get('http://localhost:3000/leaderboard',{headers:{'Authorization' : `Bearer ${jwtToken}`}})
        let data =res.data
        const ele = document.getElementById('leederboard');
        // ele.id='leederboards'
        ele.innerHTML='<div class="ld"><h2 class="leaderboard-heading">LEADER BOARD</h2> <div class="table-headings"> <div class="flex-container bb"> <div class="table-heading-name">NameS</div> <div class="table-heading-amount">Amout</div> </div></div></div>';
        for (let i = 0; i < data.length; i++) {
            let li = document.createElement('div');
            li.innerHTML = `<div class=" ld flex-container"><div class=' flex-item name-container'>${data[i].name}</div> <div class=' flex-item amount-container'> ${data[i].totalamount}</div></div>`;
            ele.appendChild(li);
        }
    }catch(err){
    //     if(err.response.status==401){
    //         window.location.href="../login/login.html"
    //    }
    //     else if(err.response.status==404){
    //         console('err')
    //     }else{
    //         console.log(err)
    //     }
    
    console.log(err)}
}



async function dowdloadExpence(){
    const jwtToken=localStorage.getItem('jwtToken');
    try{
        const data=await axios.get('http://localhost:3000/downloadButton',{headers:{'Authorization' : `Bearer ${jwtToken}`}})
        console.log(data.data)
    }catch(err){
        console.log(err)
    }
}


//pagination
let current=1
function pagination_current(){
   let value= document.getElementById('pagination_current').value;
    value=parseInt(value)
    getDataExpenses(value)
}
function pv(){
    let value= document.getElementById('pagination_current').value;
    value=parseInt(value);
    let Element=document.getElementById('pagination_current')
   if(value>1){
    Element.value=value-1;
    Element.innerText=`${value-1}`
    pagination_current()
   }
}
function next(){
    let value= document.getElementById('pagination_current').value;
    value=parseInt(value);
    let Element=document.getElementById('pagination_current')
   
   if(value<stoppagenumber || stoppagenumber==undefined ){
    Element.value=value+1;
    Element.innerText=`${value+1}`
    pagination_current()
   }
   
}



//s3 files geting
async function s3fileslinks(){
  const jwtToken=localStorage.getItem('jwtToken');
  const s3links=await axios.get('http://localhost:3000/s3filekink',{headers:{'Authorization' : `Bearer ${jwtToken}`}});
  console.log(s3links.data);
  const Element = document.getElementById('s3files-container');

  for (let i = 0; i < s3links.data.length; i++) {
      let tempElement = document.createElement('div');
      tempElement.innerHTML = `<a class="s3linksw" href="${s3links.data[i].link}">${i+1} Previous Todu List iles</a>`;
      Element.append(tempElement);
  }
}