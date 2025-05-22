import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '',category: ''});
  const [searchQuery,setSearchQuery]=useState('');
  const [filteredProducts, setFilteredProducts] = useState('');
  const [Editingid, setEditingid] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try{
      const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
    }catch(err){
      console.log(err);
    } 
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
     try{
      if(Editingid){
        const res =await fetch(`${API_URL}/${Editingid}`,{
          method: 'PUT',
          headers: {'content-type':'application/json'},
          body: JSON.stringify(form)
        });
        const updatedProduct =await res.json();
        setProducts((prev)=>
          prev.map((p)=>(p._id === Editingid ? updatedProduct : p))
        );
        setEditingid(null);
      }else{
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {'content-type':'application/json'},
          body: JSON.stringify(form)  
          });
          const newProduct = await res.json();
          setProducts([...products, newProduct]);
      }
      setForm({ name: '', description: '',category: ''});
      }catch(err){
        console.log(err);
      }
     };

 const handleDelete = async (id) => {
  try{
       await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
       setProducts((prev)=> prev.filter((p)=> p._id !== id));
  }catch(err){
    console.log(err);
  }
  };


  const handleEdit = (product)=>{
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
    })
    setEditingid(product._id);
  };

     
  const handleSearch = async()=>{
    try{
      const res = await fetch(`${API_URL}/search?q=${searchQuery}`);
      const data = await res.json();
      setProducts(data);
    }catch(err){
      console.log(err);
    }
  };

  const handlefilter = async ()=>{
    try{
      const res = await fetch(`${API_URL}/category/${filteredProducts}`);
      const data = await res.json();
      setProducts(data);
    }
    catch(err){
      console.log(err);
  }
  };
 
  return (
     <div style={{ padding: '20px' }}>
      <h2>Product Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <button type="submit">{Editingid ? 'Update' : 'Add'}</button>
        {Editingid && (
          <button
            type="button"
            onClick={() => {
              setEditingid(null);
              setForm({ name: '', description: '', category: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <div>
        <input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <input
          placeholder="Filter by category..."
          value={filteredProducts}
          onChange={(e) => setFilteredProducts(e.target.value)}
        />
        <button onClick={handlefilter}>Filter</button>

        <button onClick={fetchProducts}>Reset</button>
      </div>

      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <strong>{product.name}</strong> - {product.description} [{product.category}]
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;