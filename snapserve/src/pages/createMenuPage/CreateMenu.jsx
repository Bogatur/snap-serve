import React, { useState, useEffect } from "react";
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom';
import SideMenu from "../../components/sidemenu/SideMenu"
import './CreateMenu.css';
import { addMenuPage, addMenuPageProduct, deleteMenuPage, getCompanyData, updateCompanyMenuNameMenuSlogan, updateMenuPageProduct} from "../../services/companyService";

function CreateMenu() {
  const { user, username, companyKey, logout } = useAuth();
  const navigate = useNavigate();


  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [newMenuName, setNewMenuName] = useState("SAMPLE MENU NAME");
  const [newSlogan, setNewSlogan] = useState("SAMPLE SLOGAN");
  const [newPageName, setNewPageName] = useState("");
  const [newItem, setNewItem] = useState({ title: "", description: "", price: "", image: "" });
  const [editItem, setEditItem] = useState(null);
  const [pages, setPages] = useState([]);
  const [items, setItems] = useState([]);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenPageModal = () => setIsPageModalOpen(true);
  const handleClosePageModal = () => setIsPageModalOpen(false);
  const handleOpenDeleteModal = (pageKey) => {
   // deleteMenuPage(pageKey, companyKey); // firebase silme
    setPageToDelete(pageKey);
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




  const handleSaveMenuInfo = async (e) => {
    e.preventDefault();
    await updateCompanyMenuNameMenuSlogan(companyKey, newMenuName, newSlogan);
    handleCloseModal();
  };

  const handleAddPage = (e) => {
    e.preventDefault();
  //  setPages([...pages, newPageName]);
    addMenuPage(newPageName, companyKey);
    setNewPageName("");
    handleClosePageModal();
  };

  const handleDeletePage = (pageKey) => {
    deleteMenuPage(pageToDelete, companyKey); 
   // setPages(pages.filter((page) => page !== pageToDelete));
   // setPageToDelete(null);
    handleCloseDeleteModal();
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    addMenuPageProduct(pages[activeTabIndex].pageKey, companyKey, newItem.title, newItem.description, newItem.price, newItem.image);
    setItems([...items, newItem]);
    setNewItem({ title: "", description: "", price: "", image: null }); // Formu sıfırlıyoruz
    handleCloseItemModal();
  };
  
  const handleEditItem = (productKey) => {
    updateMenuPageProduct(productKey, pages[0].pageKey, companyKey, "düzenlenmiş name", "edit description", "10", " edit image");
   // setItems(items.map(item => item === editItem ? newItem : item)); // Düzenlenmiş öğeyi listeye kaydediyoruz
  //  setEditItem(null);
   // setNewItem({ title: "", description: "", price: "", image: null }); // Düzenleme sonrası sıfırlıyoruz
    handleCloseEditItemModal();
  };
  

  const handleDeleteItem = () => {
    setItems(items.filter(item => item !== itemToDelete));
    setItemToDelete(null);
    setIsDeleteItemModalOpen(false);
    setIsEditItemModalOpen(false); // Edit modal'ı kapanacak
  };
  console.log(user ? user.displayName : "empty")



  /*---------------*/
  const[companyData, setCompanyData] = useState();

  
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyData = await getCompanyData(companyKey);
     
        
        const pages = Object.entries(companyData.menu || {}).map(([key, value]) => ({
          pageKey: key,
          name: value?.menuPageName || 'Default Page Name',  // Eğer menuPageName yoksa bir varsayılan isim
          products: value?.products || {},  // Eğer products yoksa boş bir nesne
        }));
        
        setPages(pages);
        setCompanyData(companyData);
        // console.log("pages 0 : " + Object.entries(pages[0]).toString());
      } catch (error) {
        console.error('Şirket verisi alınırken hata oluştu:', error);
      }
    };

    if( companyKey) {
      console.log("aaa" + companyKey);
      fetchCompany();
    }

  }, [companyKey]);


  const [activeTabIndex, setActiveTabIndex] = useState(0); // Aktif tab'ı tutacak state

  const handleTabClick = (index) => {
    setActiveTabIndex(index); // Tıklanan tab'a geçiş yap
  };

  
  /*----------------*/

  return (

     companyData != null ? (
    <div className="profile-page">
      <SideMenu />
      <div className="current-profile-page">
        <div className="menu-container">
            <div className="page-info-text">
              <h5>Create Your Digital Menu</h5>
              <button onClick={handleOpenModal}>Edit Menu Name</button>
            </div>
            <div className="menu-info-container">
              <div className="menu-title">
                <h2>{companyData.menuName}</h2>
              </div>
              <div className="menu-subtitle">
                <h3>{companyData.menuSlogan}</h3>
              </div>
            </div>

        <div className="page-buttons">
              {/* Tab Başlıkları */}
            <div className="tabs">
              {pages && pages.length > 0 ? (
                pages.map((page, index) => (
                  <button
                    key={page.pageKey}
                    onClick={() => handleTabClick(index)}
                    className={activeTabIndex === index ? 'active' : ''} // Aktif tab'a stil ver
                  >
                    {page.name}
                  </button>
                ))
              ) : (
                <p>First, create a menu page to start building your digital menu.</p>
              )}
            </div>
            <div >
                  <button className="add-page-button"onClick={handleOpenPageModal}>Add Page</button>
            </div>
        </div>


        <div className="add-new-item-section">
            {pages[activeTabIndex] && ( // active page varsa bu kod bloğunu çalıştır
              <>
                <div className="menu-info-container">
                  <div className="menu-subtitle">
                    <h3>Create Products for {pages[activeTabIndex].name} page</h3>
                  </div>
                </div>
                <button className="add-new-item-button" onClick={handleOpenItemModal}>Add New Item</button>
              </>
            )}
        </div>


        <div className="product-area">
          {pages && pages.length > 0 && pages[activeTabIndex] && (
            <div className="product-list">
              {pages[activeTabIndex].products && Object.keys(pages[activeTabIndex].products).length > 0 ? (
                Object.entries(pages[activeTabIndex].products).map(([key, val]) => (
                  val && Object.keys(val).length > 0 ? (
                    <div className="product-container" key={key}>
                      <div className="product-elements">
                        <img className="product-photo" src={val.productPhotoURL} />
                        <p className="product-title">{val.productName}</p>
                        <p className="product-description">{val.productDescription}</p>
                        <div className="edit-product-contanier">
                          <p className="product-price">${val.productPrice}</p>
                          <button className="edit-icon-button" onClick={() => handleEditItem(key)}><img src={`${process.env.PUBLIC_URL}/pen.png`} alt="Edit-Icon" ></img></button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={key}>
                      <p>No data available for this product.</p>
                    </div>
                  )
                ))
              ) : (
                <div>
                  <p>No products available for {pages[activeTabIndex].name}.</p>
                </div>
              )}
            </div>
          )}
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
                  <li key={page.pageKey}>
                    {page.name}{" "}
                    <button onClick={() => handleOpenDeleteModal(page.pageKey)}>Delete</button>
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
                    required
                    type="file"
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                  />
                </label>
                <label>
                  Title:
                  <input
                    required
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    required
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </label>
                <label>
                  Price:
                  <input
                    required
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
              <form>
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
  ) : (<h2>Yükleniyor..</h2>));
}

export default CreateMenu;

