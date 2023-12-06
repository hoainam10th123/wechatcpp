

export const generateGroupName = (senderId, recipientId) =>{
    const stringCompare = senderId.localeCompare(recipientId) < 0;
    return stringCompare ? `${senderId}-${recipientId}` : `${recipientId}-${senderId}`;
}