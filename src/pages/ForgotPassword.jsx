import Form from "@/components/Form/Form";
import { useState } from "react";

//Fetching first

const getUserPassword = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users/password')
      const jsonData = await response.json() // Converting data to json
      return jsonData
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


//Updating the person's password property
