import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './profile.css';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLoginRedirect = () => {
    navigate('/login'); // Login sayfasına yönlendir
  };

  const handleSignupRedirect = () => {
    navigate('/signup'); // Login sayfasına yönlendir
  };

  const handleLogoutRedirect = () => {
    logout();
    navigate('/login'); // Login sayfasına yönlendir
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [newMenuName, setNewMenuName] = useState("XYZ Company Menu");
  const [newSlogan, setNewSlogan] = useState("Delicious Meals");
  const [newPageName, setNewPageName] = useState("");
  const [newItem, setNewItem] = useState({ title: "", description: "", price: "", image: null });
  const [editItem, setEditItem] = useState(null);
  const [pages, setPages] = useState(["Main Dishes", "Desserts", "Drinks"]);
  const [items, setItems] = useState([]);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenPageModal = () => setIsPageModalOpen(true);
  const handleClosePageModal = () => setIsPageModalOpen(false);
  const handleOpenDeleteModal = (page) => {
    setPageToDelete(page);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const handleOpenItemModal = () => {
    setNewItem({ title: "", description: "", price: "", image: null }); // Formu sıfırlıyoruz
    setIsItemModalOpen(true);
  };
  const handleCloseItemModal = () => setIsItemModalOpen(false);
  const handleOpenEditItemModal = (item) => {
    setEditItem(item);
    setNewItem({ ...item }); // Burada düzenlenen öğeyi newItem ile eşliyoruz
    setIsEditItemModalOpen(true);
  };
  
  const handleCloseEditItemModal = () => setIsEditItemModalOpen(false);
  const handleOpenDeleteItemModal = (item) => {
    setItemToDelete(item);
    setIsDeleteItemModalOpen(true);
  };
  const handleCloseDeleteItemModal = () => setIsDeleteItemModalOpen(false);



  const handleSaveMenuInfo = (e) => {
    e.preventDefault();
    handleCloseModal();
  };

  const handleAddPage = (e) => {
    e.preventDefault();
    setPages([...pages, newPageName]);
    setNewPageName("");
    handleClosePageModal();
  };

  const handleDeletePage = () => {
    setPages(pages.filter((page) => page !== pageToDelete));
    setPageToDelete(null);
    handleCloseDeleteModal();
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setItems([...items, newItem]);
    setNewItem({ title: "", description: "", price: "", image: null }); // Formu sıfırlıyoruz
    handleCloseItemModal();
  };
  
  const handleEditItem = () => {
    setItems(items.map(item => item === editItem ? newItem : item)); // Düzenlenmiş öğeyi listeye kaydediyoruz
    setEditItem(null);
    setNewItem({ title: "", description: "", price: "", image: null }); // Düzenleme sonrası sıfırlıyoruz
    handleCloseEditItemModal();
  };
  

  const handleDeleteItem = () => {
    setItems(items.filter(item => item !== itemToDelete));
    setItemToDelete(null);
    setIsDeleteItemModalOpen(false);
    setIsEditItemModalOpen(false); // Edit modal'ı kapanacak
  };

  return (
    <div className="profile-page">
      <div className="profile-menu">
        <div className="user-info-container">
          <h3>PROFILE INFORMATION</h3>
          <div className="userinfo">
            <h4>XYZ Company</h4>
            <h5>{user ? user.displayName : ""}</h5>
            <img src="" alt="" />
          </div>
        </div>
        <div className="profile-navigation">
          <h5>GENERAL</h5>
          <button>Create Menu</button>
          <button>Generate QR</button>
          <button>Order Tracking</button>
          <button>Statistics</button>
          <button onClick={handleLogoutRedirect}>Logout</button>
          <button onClick={handleLoginRedirect}>Go to Login</button>
          <button onClick={handleSignupRedirect}>Go to Signup</button>
        </div>
      </div>

      <div className="current-profile-page">
        <h5>Create Your Digital Menu</h5>
        <hr />
        <div className="menu-container">
          <div className="menu-info-container">
            <div className="menu-title">
              <h2>{newMenuName}</h2>
            </div>
            <div className="menu-subtitle">
              <h3>{newSlogan}</h3>
            </div>
            <button onClick={handleOpenModal}>Edit Info</button>
          </div>

          <div className="menu-pages">
            {pages.map((page) => (
              <button key={page}>{page}</button>
            ))}
            <button onClick={handleOpenPageModal}>Add Page</button>
          </div>

          <div className="menu-item-container">
            <div className="menu-item add-item">
              <button onClick={handleOpenItemModal}>Add New Item</button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="menu-item">
                <img src={item.image} alt="item" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>${item.price}</p>
                <button onClick={() => handleOpenEditItemModal(item)}>Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Menu Info Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSaveMenuInfo}>
              <label>
                Menu Name:
                <input
                  type="text"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                />
              </label>
              <label>
                Slogan:
                <input
                  type="text"
                  value={newSlogan}
                  onChange={(e) => setNewSlogan(e.target.value)}
                />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={handleCloseModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Page Modal */}
      {isPageModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Page</h2>
            <form onSubmit={handleAddPage}>
              <label>
                Page Name:
                <input
                  type="text"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                />
              </label>
              <button type="submit">Add Page</button>
              <button type="button" onClick={handleClosePageModal}>
                Cancel
              </button>
            </form>
            <h3>Current Pages:</h3>
            <ul>
              {pages.map((page) => (
                <li key={page}>
                  {page}{" "}
                  <button onClick={() => handleOpenDeleteModal(page)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Delete Page Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure you want to delete this page?</h2>
            <button onClick={handleDeletePage}>Yes</button>
            <button onClick={handleCloseDeleteModal}>No</button>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isItemModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Item</h2>
            <form onSubmit={handleAddItem}>
              <label>
                Photo:
                <input
                  type="file"
                  onChange={(e) => setNewItem({ ...newItem, image: URL.createObjectURL(e.target.files[0]) })}
                />
              </label>
              <label>
                Title:
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </label>
              <label>
                Description:
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
              </label>
              <button type="submit">Add Item</button>
              <button type="button" onClick={handleCloseItemModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {isEditItemModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Item</h2>
            <button onClick={() => handleOpenDeleteItemModal(editItem)}>Delete</button>
            <form onSubmit={handleEditItem}>
              <label>
                Photo:
                <input
                  type="file"
                  onChange={(e) => setNewItem({ ...newItem, image: URL.createObjectURL(e.target.files[0]) })}
                />
              </label>
              <label>
                Title:
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </label>
              <label>
                Description:
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
              </label>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={handleCloseEditItemModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Modal */}
      {isDeleteItemModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure you want to delete this item?</h2>
            <button onClick={handleDeleteItem}>Yes</button>
            <button onClick={handleCloseDeleteItemModal}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

