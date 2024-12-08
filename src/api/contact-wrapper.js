const apiUrl = (endpoint) => `${endpoint}`

const postContact = async (body) => {
  try {
    const response = await fetch(apiUrl("/api/contact"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error response from /api/contact:', errorResponse);
      throw new Error(errorResponse.message || 'Failed to submit contact form');
    }

    return response;
  } catch (error) {
    console.error('Contact endpoint post error:', error);
    throw error; // Propagate the error to the caller
  }
};


export {
  postContact
}