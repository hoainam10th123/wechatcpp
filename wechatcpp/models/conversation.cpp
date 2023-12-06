#include "conversation.h"

Conversation::Conversation(const QString &id, const QList<User> &users, const QString &messageContent)
{
    this->_id = id;
    this->users = users;
    this->messageContent = messageContent;
}
