
import './App.css';
import {useState, useEffect} from 'react';


const URL = 'http://localhost/ostoslista/';

function App() {

  const [lista, setLista] = useState([]);
  const [ostos, setOstos] = useState(''); 
  const [maara, setMaara] = useState(''); 
  
  const [editOstos, setEditOstos] = useState(null);
  const [editMaara, setEditMaara] = useState(null);
  const [editKuvaus, setEditKuvaus] = useState('');

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
            setLista(res);
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
        kuvaus: ostos,
        maara: maara
      })
    })
    .then(res=> {
      status = parseInt(res.status); 
      return res.json(); 
    })
    .then(
      (res) => {
        if (status === 200) {
          setLista(lista => [...lista, res]);
          setOstos('');
          setMaara('');
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
        const newListaWithoutRemove = lista.filter((item) => item.id !==id);
        setLista(newListaWithoutRemove); 
      } else {
        alert(res.error);
      }
      }, (error) => {
        alert(error);
      }
    )
  };

  function setEditedOstos(ostos, maara) {
    setEditOstos(ostos);
    setEditKuvaus(ostos?.kuvaus);
    setEditMaara(maara);
    setEditMaara(ostos?.maara)
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
        id: editOstos.id,
        kuvaus: editKuvaus,
        maara: editMaara
      })
    })
    .then(res => {
      status = parseInt(res.status); 
      return res.json(); 
    })
    .then (
      (res) => {
        if (status === 200) {
          lista[(lista.findIndex(ostos => ostos.id == editOstos.id))].kuvaus = editKuvaus;
          lista[(lista.findIndex(ostos => ostos.id == editOstos.id))].maara = editMaara;
          setLista([...lista]);


          setEditOstos(null); 
          setEditKuvaus('');
          setEditMaara('');
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
            <input type="text" className="form-control" placeholder="Kuvaus ostoksesta" value={ostos} onChange={e=> setOstos(e.target.value)}/>
          </div>
          <div className="mt-2">
            <input type="text" class="form-control" placeholder="Määrä" value={maara} onChange={e=> setMaara(e.target.value)} />
          </div>
          <div>
            <button className="col-3 btn btn-outline-primary mt-2">Save</button>
          </div>
          </form>
        </div>
        <div className="mt-4">
          <ol>
            {lista.map(ostos => (
              <li key={ostos.id} className="mt-1">
                {editOstos?.id !== ostos.id && ostos.kuvaus} {editOstos?.id !== ostos.id && ostos.maara}
                  
                  {editOstos?.id === ostos.id && 
                    <form onSubmit={update}>
                      <div>
                        <input value={editKuvaus} onChange={e => setEditKuvaus(e.target.value)}/>
                        <input value={editMaara} onChange={e => setEditMaara(e.target.value)}/>
                      </div>
                      <button className="btn btn-outline-primary btn-sm mt-2">Save</button>
                      <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={() => setEditedOstos(null)}>Cancel</button>
                    </form>
                  }
              &nbsp;
              {editOstos===null &&
                <a type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditedOstos(ostos)} href="#">
                  Edit
                </a>  
              } &nbsp;
              {editOstos===null &&
               <a type="button" className="btn btn-outline-warning btn-sm" onClick={() => remove(ostos.id)} href="#">
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
