import FacebookLogin from 'react-facebook-login';
import axios from 'axios'; 

axios.interceptors.request.use(function(config){
  const token = sessionStorage.getItem('access_token')
  if(token)
   config.headers['Authorization'] = `Bearer ${token}`
  return config
}, function(err){
  return Promise.reject(err)
})
const responseFacebook = async (response) => {
  if(response.accessToken){
    console.log('log in with accessToken=' + response.accessToken)
    let result = await axios.post('localhost:8080/api/login',{
      token: response.accessToken
    })
    console.log(result.data);
    sessionStorage.setItem('access_token', result.data.access_token)
  }
}

const callInfoAPI = async () => {
 let result =await axios.get('http://localhost:8080/api/info')
 console.log(result.data)
}

function App() {
  return (
    <div >
      <FacebookLogin
      appId="1275025332992675"
      autoLoad={true}
      fields="name,email,picture"
      callback={responseFacebook} />
      <button onClick={callInfoAPI}></button>
    </div>
  );
}

export default App;
