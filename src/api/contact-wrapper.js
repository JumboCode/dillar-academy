const apiUrl = (endpoint) => `${import.meta.env.VITE_API_URL}${endpoint}`

const postContact = async (body) => {
  try {
    const response = await fetch(apiUrl("/api/contact"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })

    return response
  } catch (error) {
    console.error('Contact endpoint post error:', error);
  }
}

export {
  postContact
}