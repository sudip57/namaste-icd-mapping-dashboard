import React from "react";
import { useState } from "react";
import axios from "axios";
const Items = (props) => {
  const [allData, setAllData] = useState([]);
  const sendToBackend = async (endpoint, data) => {
    try {
      const res = await axios.post(`http://localhost:3000/data/${endpoint}`, data);
      console.log(res.data);
    } catch (err) {
      console.error("Error sending data:", err);
    }
  };

  const { item,index } = props;
  if (!item || !item.namaste_entry) {
    return null;
  }
  const [entries, setEntries] = useState([]);
  const generatePosData = (namaste,icd) => {
    return {
      id: `${namaste.code}-${icd.code}`,
      text1: `${namaste.discipline}; ${namaste.name_diacritical_cleaned} , ${namaste.name_term_sanskrit}; ${namaste.description||""}`,
      text2: `ICD-11 TM2: ${icd.fullySpecifiedName}; ${icd.description||""} ${icd.path.slice(2)||""}; ${icd.indexTerms||""}`,
      label: 1
    };
  }
  const generateNegData = (namaste,icd) => {
    return {
      id: `${namaste.code}-${icd.code}`,
      text1: `${namaste.discipline}; ${namaste.name_diacritical_cleaned} , ${namaste.name_term_sanskrit};${namaste.description||""}`,
      text2: `ICD-11 TM2: ${icd.fullySpecifiedName}; ${icd.description||""} ${icd.path.slice(2)||""}; ${icd.indexTerms||""}`,
      label: 0
    };
  }
  const Namasteentry = item.namaste_entry;
  const IcdMatches = item.top_icd_matches || [];
  function handleAccept(Namaste,ICD){
    const data = generatePosData(Namaste,ICD);
    setAllData((prev) => [...prev, data]);
    sendToBackend("accept", data);
    console.log("Accepted data:", data);
  }
  function handleReject(Namaste,ICD){
    const data = generateNegData(Namaste,ICD);
    setAllData((prev) => [...prev, data]);
    sendToBackend("reject", data);
    console.log("Rejected data:", data);
  }
  return (
    <div className="w-full bg-white">
    <p className="p-1 font-bold text-md bg-black text-white">{index+1}</p>
    <p className="text-center text-xl font-bold bg-green-500">Namaste</p>
      <div className="flex flex-col justify-around gap-2 p-2">
        <p>
          {" "}
          <span className="font-bold">code:</span> {`${Namasteentry.code}`}
        </p>
         <p>
          {" "}
          <span className="font-bold">Terms:</span>{" "}
          {` ${Namasteentry.name_diacritical_cleaned}, ${Namasteentry.name_term_sanskrit}`}
        </p>
        <p>
          {" "}
          <span className="font-bold">Descipline:</span>{" "}
          {` ${Namasteentry.discipline}`}
        </p>
        <p>
          {" "}
          <span className="font-bold">Description:</span>{" "}
          {` ${Namasteentry.description||""}`}
        </p>
      </div>
      <p className="text-center text-xl font-bold bg-blue-400">ICD</p>
      <div className="flex overflow-x-scroll gap-2 p-2 ">
        {IcdMatches.length > 0 ? (
          IcdMatches.map((match, index) => {
            const icd = match.mapped_icd_entry || {};
            const fullySpecifiedName =icd.fullySpecifiedName
            return (
              <div key={index} className="border-2  w-[60%] flex-shrink-0 flex flex-col justify-around p-2">
                <p>
                  <span className="font-bold">Code:</span> {icd.code || ""}
                </p>
                <p>
                  <span className="font-bold">Term:</span> {fullySpecifiedName}
                </p>
                <p>
                  <span className="font-bold">Description:</span>{" "}
                  {icd.description || ""}
                </p>
                <p>
                  <span className="font-bold">Path:</span> {` ${icd.path || ""}`}
                </p>
                <p>
                  <span className="font-bold">Indexterms:</span>{" "}
                  {` ${icd.indexTerms || ""}`}
                </p>
                <p>
                  <span className="font-bold">Similarity:</span>{" "}
                  {match.similarity || ""}
                </p>
                <div className="flex gap-7 w-full justify-center">
                    <button onClick={()=>{handleAccept(Namasteentry,icd)}} className="bg-green-400 text-lg font-bold px-2 py-1 rounded-2xl cursor-pointer">Accept</button>
                    <button onClick={()=>{handleReject(Namasteentry,icd)}} className="bg-red-400 text-lg font-bold px-2 py-1 rounded-2xl">Reject</button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No ICD matches found</p>
        )}
      </div>
    </div>
  );
};

export default Items;
