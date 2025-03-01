export const fetchConversationClasses = async () => {
    try {
        const response = await fetch('/api/conversation-classes');
        if (!response.ok) {
            throw new Error("Failed to fetch conversation classes");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching conversation classes:", error);
        return [];
    }
};
