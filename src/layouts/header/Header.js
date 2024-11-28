import React, {useState,useEffect,useContext} from 'react';
// import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import {
  Navbar,
  // Nav,
  // NavItem,
  // NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
   DropdownItem,
  Button,
  Label
} from 'reactstrap';
import { useLocation} from 'react-router-dom';
import axios from 'axios';
import { ErrorOutlineSharp } from '@material-ui/icons';
import AppContext from '../../context/AppContext';
// import { MessageSquare } from 'react-feather';
// import * as Icon from 'react-feather';
// import LogoWhite from '../../assets/images/logos/logo.png';
// import MessageDD from './MessageDD';
// import MegaDD from './MegaDD';
// import NotificationDD from './NotificationDD';
import user1 from '../../assets/images/users/user1.jpg';
import Language from './Language';
import Location from './Location'
import api from '../../constants/api';
import { ToggleMiniSidebar, ToggleMobileSidebar } from '../../store/customizer/CustomizerSlice';
import ProfileDD from './ProfileDD';


const Header = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const topbarColor = useSelector((state) => state.customizer.topbarBg);

  const location = useLocation();

  const located = location

  console.log('location',located)

  const [convertedText, setConvertedText] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const logout=()=>{
    localStorage.clear()
    setTimeout(()=>{
      window.location.reload()
    },200)
  }
  const getSelectedLanguageFromLocalStorage = () => {
    return localStorage.getItem('selectedLanguage') || '';
  };
  const getSelectedLocationFromLocalStorage = () => {
    const locations = localStorage.getItem('selectedLocation');
    const loc=JSON.parse(locations);
    console.log('locat',locations);
    console.log('loc',loc);
    return locations ? Number(loc) : null;
  };
  
 

  const { loggedInuser } = useContext(AppContext);
  const selectedLanguage = getSelectedLanguageFromLocalStorage();
   const selectedLocation = getSelectedLocationFromLocalStorage();
 

   console.log('selectedLocation',Number(selectedLocation))

   console.log('email',)

const [locationValue, setLocationValue] = useState([]);
const [staffSiteValue, setStaffSiteValue] = useState([]);
 console.log('staffSiteValue',staffSiteValue.site_id)
// const LocationValue = () => {
//   api
//     .post('/site/getsiteById', { site_id:parseFloat(selectedLocation) })
//     .then((res) => {
//       setLocationValue(res.data.data);
//     })
//     .catch((err) => {
//       console.error("Error fetching site data:", err);
//     });
// };

const LocationValue = () => {
  const siteId = parseFloat(selectedLocation); // Make sure selectedLocation is a valid number
 
    api
      .post('/site/getsiteById', { site_id: siteId })
      .then((res) => {
        setLocationValue(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching site data:", err);
      });
  
};


const StaffSite = () => {
  api
    .post('/staff/getStaffSiteById', { staff_id: loggedInuser?.staff_id })
    .then((res) => {
      setStaffSiteValue(res.data.data);
    })
    .catch((err) => {
      console.error("Error fetching site data:", err);
    });
};



const [arabicsetting, setArabicsetting] = useState([]);

console.log('arabicsetting',arabicsetting)
const getsite = () => {
  api
    .get('/setting/getarabicdrop')
    .then((res) => {
      setArabicsetting(res.data.data); 
    })
    .catch(() => {
    
    });
};

// const [showmultiSite, setshowmultiSite] = useState([]);



console.log('arabicsetting',arabicsetting)
// const getsetshowmultiSite = () => {
//   api
//     .get('/setting/getMultiSite')
//     .then((res) => {
//       const multiSiteData = res.data.data[0]; 
//       const showMultiSite = multiSiteData?.ShowMultiSite;
//       setshowmultiSite(showMultiSite); 
//     })
//     .catch(() => {
    
//     });
// };

const  showmultiSite = '0'

console.log('showmultiSiteheader',showmultiSite)
useEffect(() => {
  LocationValue();
  getsite();
  // getsetshowmultiSite();
  StaffSite();
}, []);


// const handleLocationChange = () => {
//   if (loggedInuser?.site_id) {
//     localStorage.setItem('selectedLocation', loggedInuser.site_id);
//     console.log('Selected Location saved:', loggedInuser.site_id);
//     window.location.reload();
//   } else {
//     console.error('No site_id available for the logged-in user.');
//   }
// };


  // Fetch translation when selectedLanguage or plannings changes
  const fetchTranslation = async () => {
    api.get('/translation/getTranslation')
    .then((res) => {
      res.data.data.forEach(async (cell) => {
    if (!selectedLanguage) return; // Don't make API call if language not selected
    try {
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        {},
        {
          params: {
            q: cell.value,
            target: "ar",
            key: 'AIzaSyA_eJTEvBDRBHo8SYmq_2PyCh8s_Pl6It4' // Replace with your Google Translate API key
          }
        }
      );
      await api.post('/translation/editTranslationArb', {
        translation_id: cell.translation_id,
        arb_value1: response.data.data.translations[0].translatedText,
        
      });
      console.log('id',cell.translation_id)
      console.log('trabsss',response.data.data.translations[0].translatedText)
      setConvertedText(response.data.data.translations[0].translatedText);
      setError('');
    } catch (errors) {
      setError('Translation failed. Please try again later.');
      console.error('Translation error:', ErrorOutlineSharp);
    }
  })
})
  };

  useEffect(() => {
  fetchTranslation();
}, [selectedLanguage]);

    
   
 

console.log('convertedText',convertedText)

console.log('error',error)

  return (
    <Navbar
      color={topbarColor}
      dark={!isDarkMode}
      light={isDarkMode}
      expand="lg"
      className="topbar"
    >
      {/******************************/}
      {/**********Toggle Buttons**********/}
      {/******************************/}
      <div className="d-flex align-items-center">
        <Button
          color={topbarColor}
          className="d-none d-lg-block"
          onClick={() => dispatch(ToggleMiniSidebar())}
        >
          <i className="bi bi-list" />
        </Button>
        {/* <NavbarBrand href="/" className="d-sm-block d-lg-none">
        <img src={LogoWhite} alt="Logo" className='w-50' />
          {/* <LogoWhite /> */}
        {/* </NavbarBrand> */}
        <Button
          color={topbarColor}
          className="d-sm-block d-lg-none"
          onClick={() => dispatch(ToggleMobileSidebar())}
        >
          <i className="bi bi-list" />
        </Button>
      </div>

      {/******************************/}
      {/**********Left Nav Bar**********/}
      {/******************************/}

      {/* <Nav className="me-auto d-none d-lg-flex" navbar> */}
        {/* <NavItem>
          <Link to="/starter" className="nav-link">
            Starter
          </Link>
        </NavItem> */}
       
        
       <Label className='text-white'>
            HR Demo
          </Label>
      {/* </Nav> */}
      {/******************************/}
      {/**********Notification DD**********/}
      {/******************************/}
      <div className="d-flex">
        {/******************************/}
        {/**********Mega DD**********/}
        {/******************************/}
        {/* <UncontrolledDropdown className="mega-dropdown mx-1">
          <DropdownToggle className="bg-transparent border-0" color={topbarColor}>
            <Icon.Grid size={18} />
          </DropdownToggle>
          <DropdownMenu>
            <MegaDD />
          </DropdownMenu>
        </UncontrolledDropdown>
        <UncontrolledDropdown>
          <DropdownToggle color={topbarColor}>
            <Icon.Bell size={18} />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <DropdownItem header>
              <span className="mb-0">Notifications</span>
            </DropdownItem>
            <DropdownItem divider />
            <SimpleBar style={{ maxHeight: '350px' }}>
              <NotificationDD />
            </SimpleBar> */}
            {/* <DropdownItem divider />
            <div className="p-2 px-3">
              <Button color="primary" size="sm" block>
                Check All
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown> */}
        {/******************************/}
        {/**********Message DD**********/}
        {/******************************/}
        {/* <UncontrolledDropdown className="mx-1">
          <DropdownToggle color={topbarColor}>
            <MessageSquare size={18} />
          </DropdownToggle> */}
          {/* <DropdownMenu className="ddWidth">
            <DropdownItem header>
              <span className="mb-0">Messages</span>
            </DropdownItem> */}
            {/* <DropdownItem divider />
            <SimpleBar style={{ maxHeight: '350px' }}>
              <MessageDD />
            </SimpleBar>
            <DropdownItem divider /> */}
            {/* <div className="p-2 px-3">
              <Button color="primary" size="sm" block>
                Check All
              </Button>
            </div> */}
          {/* </DropdownMenu> */}
        {/* </UncontrolledDropdown> */}
        {/******************************/}
        {/**********Profile DD**********/}
        {/******************************/}
        {arabicsetting.length > 0 && arabicsetting[0].arabicdrop === '1' && (
        <UncontrolledDropdown className="mx-1">
        <DropdownToggle color={topbarColor}className="shadow-none"
                onClick={() => {
                  fetchTranslation();
                }}>
              Arabic Language update
          </DropdownToggle>
          </UncontrolledDropdown>
        )}

       {arabicsetting.length > 0 && arabicsetting[0].arabicdrop === '1' && (
  <UncontrolledDropdown className="mx-1">
    <DropdownToggle color={topbarColor} className="text-white">
      Language: {parseFloat(selectedLanguage)}
    </DropdownToggle>
    <DropdownMenu className="ddWidth">
      <DropdownItem header>
        <span className="mb-0">Language</span>
      </DropdownItem>
      <DropdownItem divider />
      <SimpleBar style={{ maxHeight: '350px' }}>
        <Language />
      </SimpleBar>
      <DropdownItem divider />
      <div className="p-2 px-3">
        {/* <Button color="primary" size="sm" block>
          Check All
        </Button> */}
      </div>
    </DropdownMenu>
  </UncontrolledDropdown>
)}

{/* {loggedInuser.email && showmultiSite.length > 0 && loggedInuser.email === showmultiSite[0]?.showmultiSite && (
  <UncontrolledDropdown className="mx-1"> */}
    {/* <DropdownToggle color={topbarColor} className="text-white">
      Location: {locationValue.length > 0 ? locationValue[0]?.title : 'No Location'}
    </DropdownToggle> */}
    {/* <DropdownMenu className="ddWidth"> */}
      {/* <DropdownItem header>
        <span className="mb-0">Location</span>
      </DropdownItem> */}
      {/* <DropdownItem divider />
      <SimpleBar style={{ maxHeight: '350px' }}>
        <Location />
      </SimpleBar>
      <DropdownItem divider /> */}
      {/* <div className="p-2 px-3"> */}
        {/* Additional controls can go here */}
      {/* </div> */}
    {/* </DropdownMenu> */}
  {/* </UncontrolledDropdown>
)} */}

{/* {loggedInuser?.email && showmultiSite?.length > 0 && loggedInuser.email === showmultiSite[0]?.showmultiSite ? ( */}
{(loggedInuser?.user_group_id === 8  || loggedInuser?.user_group_id === 5)&& showmultiSite === '1' && 
(located.pathname !== '/Training' && located.pathname !== '/Loan'&& located.pathname !== '/LoanDetails'&& located.pathname !== '/LoanEdit'&& located.pathname !== '/TrainingEdit'&& located.pathname !== '/TrainingDetails') && (

  <UncontrolledDropdown className="mx-1">
    <DropdownToggle color={topbarColor} className="text-white">
     Location: {locationValue[0]?.title}
    </DropdownToggle>
    <DropdownMenu className="ddWidth">
      <DropdownItem header>
        <span className="mb-0">Location</span>
      </DropdownItem>
      <DropdownItem divider />
      <SimpleBar style={{ maxHeight: '350px' }}>
        <Location />
      </SimpleBar>
      <DropdownItem divider />
      <div className="p-2 px-3">
        {/* Additional controls or options can go here */}
      </div>
    </DropdownMenu>
  </UncontrolledDropdown>
   )}

        <UncontrolledDropdown>
          <DropdownToggle color={topbarColor}>
            <img src={user1} alt="profile" className="rounded-circle" width="30" />
          </DropdownToggle>
          <DropdownMenu className="ddWidth">
            <ProfileDD />
            <div className="p-2 px-3">
              <Button onClick={logout} color="danger" size="sm">
                Logout
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </Navbar>
  );
};

export default Header;
