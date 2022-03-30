import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
  console.log(response);
}
function App() {
  return (
    <div >
      <FacebookLogin
      appId="1275025332992675"
      autoLoad={true}
      fields="name,email,picture"
      callback={responseFacebook} />
     
    </div>
  );
}

export default App;
