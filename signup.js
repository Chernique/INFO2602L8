async function signup(event){
  event.preventDefault();

  let form = event.target;
  let fields = event.target.elements;
  
  let data = {
    username: fields['username'].value,
    email: fields['email'].value,
    password: fields['password'].value,
  }

  // Check if password is at least 8 characters (backend requirement)
  if (data.password.length < 8) {
    toast("Password must be at least 8 characters");
    return;
  }

  form.reset();

  let result = await sendRequest(`${server}/signup`, 'POST', data);
  
  if('detail' in result){
    toast("Signup Failed: " + result['detail']);
  }else{
    toast("Signup Successful");
    window.location.href = 'index.html';
  }
}

document.forms['signUpForm'].addEventListener('submit', signup);