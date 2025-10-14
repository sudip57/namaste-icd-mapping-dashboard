import React, { use } from 'react'
import { useEffect,useRef } from 'react'
import { useState } from 'react';
import Items from './Items';
const Map = () => {
    const listRef = useRef();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 100;
    const [Mappingdata, setMappingData] = useState([]);
    const mapping_data  = async() => {
        console.log("Fetching mapping data...");
        try {
            const response = await fetch(`https://ayushlink-microservice.vercel.app/data/get-map-data?page=${currentPage}&limit=${limit}`);
            const data = await response.json();
            setTotalPages(data.totalPages);
            setMappingData(data.data);
            console.log("Mapping data fetched:", data.data);
        }
        catch (error) {
            console.error("Error fetching mapping data:", error);
    }
}
   useEffect(() => {
        if (listRef.current) {
        listRef.current.scrollTop = 0;
         // reset scroll to top
     }
       mapping_data();
    }, [currentPage])
 return (
    <>
     <div ref={listRef} className='h-[600px] overflow-y-scroll border-3 m-2 flex flex-col gap-4 transiton-all-ease-out duration-300'>
        {Mappingdata.map((item, index) => (
            <Items item={item} index={index} />
          ))}
    </div>
    <div className='flex justify-center items-center p-2 w-full'>
        <div className='flex overflow-x-auto gap-2'>
        {[...Array(totalPages)].map((page,i) => (
            <div onClick={()=>{setCurrentPage(i+1)}} className='min-w-8 min-h-8 flex items-center justify-center border cursor-pointer'>{i+1}
            </div>
        ))}
    </div>
    </div>
    
    </>
   
  )
}
export default Map
