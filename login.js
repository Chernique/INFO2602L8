async function login(event) {
  event.preventDefault();

  const form = event.target;
  let fields = form.elements;

  let data = {
    username: fields['username'].value,
    password: fields['password'].value,
  }

  form.reset();

  let result = await sendRequest(`${server}/token`, 'POST', data);
  
  if ("detail" in result) {
    toast("Login Failed: " + result.detail);
  } else {
    toast("Login Successful");
    window.localStorage.setItem('access_token', result.access_token);
    window.location.href = 'app.html';
  }
}

document.forms['loginForm'].addEventListener('submit', login);