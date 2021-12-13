import logo from './logo.svg';
import './App.css';
import React from 'react';
import action from './action.js'

function App() {
  const [userList, setUserList] = React.useState(() => ([]));

  React.useEffect(() => {
    action.onGlobalStateChange((state) => {
      console.log('子类获取----react', state);
      setUserList(state.usersInfo);
    }, true)
  }, []);
  const changeGlobalUserList = () => {
    const temp = JSON.parse(JSON.stringify(userList));
    temp.push({
      usrName: 'xxxx',
      userId: new Date().getTime(),
    })
    action.setGlobalState({
      usersInfo: temp,
    })
  };
  return (
    <div className="App">
      <p>在子类中的数量是----{userList.length}</p>
      <button onClick={changeGlobalUserList}>更改</button>
    </div>
  );
}

export default App;
