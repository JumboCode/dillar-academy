
const postContact = async (body) => {
  try {
    const response = await fetch("/api/contact", {
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