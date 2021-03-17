
import './App.css';
import {useState, useEffect} from 'react';


const URL = 'http://localhost/ostoslista/';

function App() {

  const [list, setEditList] = useState([]);
  const [item, setItem] = useState(''); 
  const [amount, setAmount] = useState(''); 
  
  const [editItem, setEditItem] = useState(null);
  const [editAmount, setEditAmount] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    let status = 0; 
    fetch (URL + 'index.php')
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if ( status === 200) {
            setEditList(res);
          } else {
            alert(res.error); 
          }
        }, (error) => {
          alert(error);
        }
      )
  }, []);

  function save(e) {
    e.preventDefault(); 
    let status = 0; 
    fetch(URL + 'add.php', {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Constent-type': 'application/json',
      },
      body: JSON.stringify({
        description: item,
        amount: amount
      })
    })
    .then(res=> {
      status = parseInt(res.status); 
      return res.json(); 
    })
    .then(
      (res) => {
        if (status === 200) {
          setEditList(list => [...list, res]);
          setItem('');
          setAmount('');
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error)
      }
    )
  };

  function remove(id) {
    let status = 0; 
    fetch(URL + 'delete.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
      if (status === 200) {
        const newListaWithoutRemove = list.filter((item) => item.id !==id);
        setEditList(newListaWithoutRemove); 
      } else {
        alert(res.error);
      }
      }, (error) => {
        alert(error);
      }
    )
  };

  function setEditedOstos(item, amount) {
    setEditItem(item);
    setEditDescription(item?.description);
    setEditAmount(amount);
    setEditAmount(item?.amount)
  }

  function update(e) {
    e.preventDefault(); 
    let status = 0; 
    fetch (URL + 'update.php', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: editItem.id,
        description: editDescription,
        amount: editAmount
      })
    })
    .then(res => {
      status = parseInt(res.status); 
      return res.json(); 
    })
    .then (
      (res) => {
        if (status === 200) {
          list[(list.findIndex(item => item.id == editItem.id))].description = editDescription;
          list[(list.findIndex(item => item.id == editItem.id))].amount = editAmount;
          setEditList([...list]);


          setEditItem(null); 
          setEditDescription('');
          setEditAmount('');
        } else {
          alert(res.error); 
        }
      }, (error) => {
        alert(error); 
      }
    )
  };



  return (
    <div className="container">
      <div className="row">
        <h3>Ostoslista</h3>
        <div>
          <form onSubmit={save} className="form-group row w-50">
          <div className="mt-2">
            <input type="text" className="form-control" placeholder="Kuvaus ostoksesta" value={item} onChange={e=> setItem(e.target.value)}/>
          </div>
          <div className="mt-2">
            <input type="text" class="form-control" placeholder="Määrä" value={amount} onChange={e=> setAmount(e.target.value)} />
          </div>
          <div>
            <button className="col-3 btn btn-outline-primary mt-2">Save</button>
          </div>
          </form>
        </div>
        <div className="mt-4">
          <ol>
            {list.map(item => (
              <li key={item.id} className="mt-1">
                {editItem?.id !== item.id && item.description} {editItem?.id !== item.id && item.amount}
                  
                  {editItem?.id === item.id && 
                    <form onSubmit={update}>
                      <div>
                        <input value={editDescription} onChange={e => setEditDescription(e.target.value)}/>
                        <input value={editAmount} onChange={e => setEditAmount(e.target.value)}/>
                      </div>
                      <button className="btn btn-outline-primary btn-sm mt-2">Save</button>
                      <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={() => setEditedOstos(null)}>Cancel</button>
                    </form>
                  }
              &nbsp;
              {editItem===null &&
                <a type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditedOstos(item)} href="#">
                  Edit
                </a>  
              } &nbsp;
              {editItem===null &&
               <a type="button" className="btn btn-outline-warning btn-sm" onClick={() => remove(item.id)} href="#">
                Delete
              </a> 
              }
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
