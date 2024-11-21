import React, { useState,useEffect } from 'react';
import { Col, FormGroup, Input } from 'reactstrap';
import api from '../../constants/api';

const Location = () => {
  // Use object destructuring for useState
  const [selectedLocation, setSelectedLocation] = useState(() => {
    // Initialize selectedLocation with the value from localStorage, if available
    return localStorage.getItem('selectedLocation') || '';
  });

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setSelectedLocation(value);
    // Save selected Location to localStorage
    localStorage.setItem('selectedLocation', value);
    console.log('Selected Location saved:', value);
    window.location.reload();
  };

  // Log the updated value of selectedLocation after the state has been updated
  console.log('selectedLocation', selectedLocation);
  const [site, setsite] = useState(null);
  const getsite = () => {
    api
      .get('/site/getLocation')
      .then((res) => {
        setsite(res.data.data)
        })
      .catch(() => {
        
      });
  };
  console.log('site',site)
  useEffect(() => {
    getsite();
  }, []);
 

  return (
    // <Col md="7">
    //   <FormGroup>
    //     <Input
    //       type="select"
    //       name="category"
    //       value={selectedLocation}
    //       onChange={handleLocationChange}
    //     >
    //       <option value="">Please Select</option>
    //       <option value="Chennai">Chennai</option>
    //       <option value="Tirunelveli">Tirunelveli</option>
    //     </Input>
    //   </FormGroup>
    // </Col>
     <Col md="7">
     <FormGroup>
    
       <Input
         type="select"
         name="address_country"
         onChange={handleLocationChange}
         value={selectedLocation}
       >
         {/* <option defaultValue="selected" value="">
           Please Select
         </option> */}
         {site &&
           site.map((siteValue) => (
             <option key={siteValue.site_id} value={siteValue.site_id}>
               {siteValue.title}
             </option>
           ))}
       </Input>
     </FormGroup>
   </Col>
  );
};

export default Location;
